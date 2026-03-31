import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getUserSubscription } from '@/lib/billing'
import { getPlanLimits } from '@/lib/plans'
import { pool } from '@/lib/db'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/account/usage
 *
 * Returns detailed usage data for the authenticated user:
 * - Daily API call counts for the last 30 days
 * - Wallet count
 * - Chain count
 * - Scan count for the last 30 days
 */
export async function GET(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()
    const userId = session.user_id as number

    const subscription = await getUserSubscription(userId)
    const limits = getPlanLimits(subscription.plan)

    // Daily API calls for last 30 days
    const dailyApiCalls = await pool.query(
      `SELECT
         DATE(timestamp) AS date,
         COUNT(*)::int AS count
       FROM usage_records
       WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(timestamp)
       ORDER BY date ASC`,
      [userId],
    )

    // Today's API calls
    const todayCalls = await pool.query(
      `SELECT COUNT(*)::int AS count FROM usage_records
       WHERE user_id = $1 AND timestamp >= CURRENT_DATE`,
      [userId],
    )

    // Wallet count
    const wallets = await pool.query(
      `SELECT COUNT(*)::int AS count FROM user_wallets WHERE user_id = $1`,
      [userId],
    )

    // Scans in last 30 days
    const scans = await pool.query(
      `SELECT COUNT(*)::int AS count FROM wallet_events
       WHERE wallet_address IN (SELECT wallet_address FROM user_wallets WHERE user_id = $1)
       AND event_type = 'scan'
       AND created_at >= NOW() - INTERVAL '30 days'`,
      [userId],
    )

    // Monitored wallets count
    const monitored = await pool.query(
      `SELECT COUNT(*)::int AS count FROM monitored_wallets
       WHERE user_id = $1 AND enabled = TRUE`,
      [userId],
    )

    return NextResponse.json({
      plan: subscription.plan,
      limits: {
        maxWallets: limits.maxWallets,
        maxApiCallsPerDay: limits.maxApiCallsPerDay,
        maxChains: limits.maxChains,
        maxMonitoredWallets: limits.maxMonitoredWallets,
      },
      usage: {
        apiCallsToday: todayCalls.rows[0]?.count ?? 0,
        walletsUsed: wallets.rows[0]?.count ?? 0,
        scansLast30Days: scans.rows[0]?.count ?? 0,
        monitoredWallets: monitored.rows[0]?.count ?? 0,
      },
      dailyApiCalls: dailyApiCalls.rows.map((r) => ({
        date: r.date,
        count: r.count,
      })),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    L.error('account.usage.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to fetch usage data' }, { status: 500 })
  }
}
