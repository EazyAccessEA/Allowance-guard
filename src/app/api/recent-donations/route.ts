import { NextResponse } from 'next/server'
import { db } from '@/db'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Normalize into: created_at, amount_minor, currency, source, ref, status, email
  const q = sql`
    (
      SELECT
        created_at,
        amount_total     AS amount_minor,
        currency,
        'stripe'         AS source,
        stripe_session_id AS ref,
        payment_status   AS status,
        email
      FROM donations
    )
    UNION ALL
    (
      SELECT
        created_at,
        local_amount     AS amount_minor,
        local_currency   AS currency,
        'coinbase'       AS source,
        charge_code      AS ref,
        status,
        email
      FROM coinbase_donations
    )
    ORDER BY created_at DESC
    LIMIT 200
  `
  const { rows } = await db.execute(q as any)
  return NextResponse.json(rows)
}
