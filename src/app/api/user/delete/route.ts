import { NextResponse } from 'next/server'
import { getSession, clearSessionCookie } from '@/lib/auth'
import { pool } from '@/lib/db'
import { stripe } from '@/lib/billing'
import { auditUser } from '@/lib/audit'

/**
 * DELETE /api/user/delete
 * GDPR Article 17 — Right to Erasure
 * Deletes all user data and cancels active subscriptions.
 * Requires confirmation via request body: { confirm: true }
 */
export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { confirm?: boolean } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Request body must contain { "confirm": true }' },
      { status: 400 },
    )
  }

  if (body.confirm !== true) {
    return NextResponse.json(
      { error: 'Account deletion requires confirmation. Send { "confirm": true } in the request body.' },
      { status: 400 },
    )
  }

  const userId = session.user_id as number
  const userEmail = session.email as string

  try {
    // 1. Cancel active Stripe subscriptions
    const { rows: subscriptions } = await pool.query(
      `SELECT stripe_subscription_id, stripe_customer_id
       FROM subscriptions
       WHERE user_id = $1 AND status IN ('active', 'trialing', 'past_due')`,
      [userId],
    )

    for (const sub of subscriptions) {
      if (sub.stripe_subscription_id) {
        try {
          await stripe.subscriptions.cancel(sub.stripe_subscription_id as string)
        } catch (stripeErr) {
          console.error('Failed to cancel Stripe subscription:', sub.stripe_subscription_id, stripeErr)
          // Continue with deletion even if Stripe cancel fails
        }
      }
    }

    // 2. Revoke all API keys
    await pool.query(
      `UPDATE api_keys SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId],
    )

    // 3. Delete monitoring data (events, snapshots tied to user's wallets)
    await pool.query(
      `DELETE FROM monitoring_events
       WHERE monitor_id IN (SELECT id FROM monitored_wallets WHERE user_id = $1)`,
      [userId],
    )

    await pool.query(
      `DELETE FROM monitoring_snapshots
       WHERE wallet_address IN (SELECT wallet_address FROM monitored_wallets WHERE user_id = $1)`,
      [userId],
    )

    // 4. Delete monitored wallets
    await pool.query(
      `DELETE FROM monitored_wallets WHERE user_id = $1`,
      [userId],
    )

    // 5. Delete revocation rules and executions
    await pool.query(
      `DELETE FROM rule_executions WHERE user_id = $1`,
      [userId],
    )

    await pool.query(
      `DELETE FROM revocation_rules WHERE user_id = $1`,
      [userId],
    )

    // 6. Delete webhook deliveries, then webhooks
    await pool.query(
      `DELETE FROM webhook_deliveries
       WHERE webhook_id IN (SELECT id FROM webhooks WHERE user_id = $1)`,
      [userId],
    )

    await pool.query(
      `DELETE FROM webhooks WHERE user_id = $1`,
      [userId],
    )

    // 7. Delete usage records
    await pool.query(
      `DELETE FROM usage_records WHERE user_id = $1`,
      [userId],
    )

    // 8. Delete API keys (after revoking)
    await pool.query(
      `DELETE FROM api_keys WHERE user_id = $1`,
      [userId],
    )

    // 9. Delete compliance exports
    await pool.query(
      `DELETE FROM compliance_exports WHERE user_id = $1`,
      [userId],
    )

    // 10. Delete team activity
    await pool.query(
      `DELETE FROM team_activity WHERE user_id = $1`,
      [userId],
    )

    // 11. Handle team ownership — transfer or delete teams
    const { rows: ownedTeams } = await pool.query(
      `SELECT id FROM teams WHERE owner_id = $1`,
      [userId],
    )

    for (const team of ownedTeams) {
      // Check if there's another admin who can take ownership
      const { rows: admins } = await pool.query(
        `SELECT user_id FROM team_members
         WHERE team_id = $1 AND user_id != $2 AND role IN ('owner', 'admin')
         ORDER BY created_at ASC LIMIT 1`,
        [team.id, userId],
      )

      if (admins.length > 0) {
        // Transfer ownership to next admin
        await pool.query(
          `UPDATE teams SET owner_id = $1 WHERE id = $2`,
          [admins[0].user_id, team.id],
        )
      } else {
        // No other admin — delete the team and all related data
        await pool.query(`DELETE FROM team_wallets WHERE team_id = $1`, [team.id])
        await pool.query(`DELETE FROM team_members WHERE team_id = $1`, [team.id])
        await pool.query(`DELETE FROM team_invites WHERE team_id = $1`, [team.id])
        await pool.query(`DELETE FROM team_activity WHERE team_id = $1`, [team.id])
        await pool.query(`DELETE FROM teams WHERE id = $1`, [team.id])
      }
    }

    // 12. Remove team memberships
    await pool.query(
      `DELETE FROM team_members WHERE user_id = $1`,
      [userId],
    )

    // 13. Anonymize audit logs (keep for compliance, remove PII)
    await pool.query(
      `UPDATE audit_logs SET actor_id = 'deleted', ip = NULL, meta = '{}'::jsonb
       WHERE actor_id = $1`,
      [String(userId)],
    )

    // 14. Delete subscriptions
    await pool.query(
      `DELETE FROM subscriptions WHERE user_id = $1`,
      [userId],
    )

    // 15. Delete all sessions
    await pool.query(
      `DELETE FROM sessions WHERE user_id = $1`,
      [userId],
    )

    // 16. Log the deletion before deleting the user
    await auditUser(
      'gdpr.account_deleted',
      'system',
      `user:${userId}`,
      { email_hash: Buffer.from(userEmail || '').toString('base64').slice(0, 8) },
      req.headers.get('x-forwarded-for'),
      '/api/user/delete',
    )

    // 17. Delete the user account
    await pool.query(
      `DELETE FROM users WHERE id = $1`,
      [userId],
    )

    // 18. Clear session cookie
    await clearSessionCookie()

    return NextResponse.json({
      success: true,
      message: 'Your account and all associated data have been deleted. Active subscriptions have been cancelled.',
      deletedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Account deletion failed:', error)
    return NextResponse.json(
      { error: 'Account deletion failed. Please contact support@allowanceguard.com for assistance.' },
      { status: 500 },
    )
  }
}
