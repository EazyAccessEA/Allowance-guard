import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'

interface ActivateOpts {
  userId: number
  plan: string
  interval: 'monthly' | 'yearly'
  chargeCode: string
}

/**
 * Activate or extend a crypto-paid subscription.
 *
 * Coinbase Commerce charges are one-time, so we compute `current_period_end`
 * ourselves: now + 1 month (or 1 year). If the user already has an active
 * crypto subscription for the same plan, extend its period instead of
 * creating a new row.
 *
 * Idempotent on `coinbase_charge_code` (unique partial index).
 */
export async function activateCryptoSubscription(opts: ActivateOpts): Promise<void> {
  const { userId, plan, interval, chargeCode } = opts

  // Idempotency: if we've already processed this charge, do nothing.
  const existing = await pool.query(
    `SELECT id FROM subscriptions WHERE coinbase_charge_code = $1 LIMIT 1`,
    [chargeCode]
  )
  if (existing.rows[0]) {
    apiLogger.info('coinbase.subscription.already_activated', { chargeCode })
    return
  }

  const intervalSql = interval === 'yearly' ? "INTERVAL '1 year'" : "INTERVAL '1 month'"

  // If the user has an active crypto subscription on the same plan, extend it.
  const active = await pool.query(
    `SELECT id, current_period_end
       FROM subscriptions
      WHERE user_id = $1
        AND provider = 'coinbase'
        AND plan = $2
        AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1`,
    [userId, plan]
  )

  if (active.rows[0]) {
    await pool.query(
      `UPDATE subscriptions
          SET current_period_end = GREATEST(COALESCE(current_period_end, NOW()), NOW()) + ${intervalSql},
              coinbase_charge_code = $2,
              billing_interval = $3,
              updated_at = NOW()
        WHERE id = $1`,
      [active.rows[0].id, chargeCode, interval]
    )
    apiLogger.info('coinbase.subscription.extended', { userId, plan, chargeCode })
    return
  }

  await pool.query(
    `INSERT INTO subscriptions (
        id, user_id, provider, coinbase_charge_code, plan, status,
        current_period_start, current_period_end, billing_interval,
        cancel_at_period_end, metadata, created_at, updated_at
     ) VALUES (
        gen_random_uuid(), $1, 'coinbase', $2, $3, 'active',
        NOW(), NOW() + ${intervalSql}, $4,
        false, '{}'::jsonb, NOW(), NOW()
     )`,
    [userId, chargeCode, plan, interval]
  )

  apiLogger.info('coinbase.subscription.activated', { userId, plan, interval, chargeCode })
}
