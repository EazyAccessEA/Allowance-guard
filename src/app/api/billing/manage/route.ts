import { NextResponse } from 'next/server'
import { getSession, requireUser } from '@/lib/auth'
import { createPortalSession, getUserSubscription } from '@/lib/billing'
import { getPlanLimits } from '@/lib/plans'
import { pool } from '@/lib/db'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/billing/manage
 *
 * Returns the user's current subscription, plan limits, and usage stats
 * for the account dashboard.
 */
export async function GET(req: Request) {
  const L = withReq(req)

  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userId = session.user_id as number
    const subscription = await getUserSubscription(userId)
    const limits = getPlanLimits(subscription.plan)

    // Count wallets used
    const walletsResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM user_wallets WHERE user_id = $1`,
      [userId],
    )
    const walletsUsed = walletsResult.rows[0]?.count ?? 0

    // Count API calls today
    const apiCallsResult = await pool.query(
      `SELECT COUNT(*)::int AS count FROM usage_records
       WHERE user_id = $1 AND timestamp >= CURRENT_DATE`,
      [userId],
    )
    const apiCallsUsed = apiCallsResult.rows[0]?.count ?? 0

    // Count distinct chains used (from wallet events in last 30 days)
    const chainsResult = await pool.query(
      `SELECT COUNT(DISTINCT chain_id)::int AS count FROM wallet_events
       WHERE wallet_address IN (SELECT wallet_address FROM user_wallets WHERE user_id = $1)
       AND created_at >= NOW() - INTERVAL '30 days'`,
      [userId],
    )
    const chainsUsed = chainsResult.rows[0]?.count ?? 1

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      walletsUsed,
      walletsLimit: limits.maxWallets,
      apiCallsUsed,
      apiCallsLimit: limits.maxApiCallsPerDay,
      chainsUsed,
      chainsLimit: limits.maxChains,
    })
  } catch (error) {
    L.error('billing.manage.get.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to fetch account data' }, { status: 500 })
  }
}

/**
 * POST /api/billing/manage
 *
 * Redirects the user to the Stripe Customer Portal where they can:
 * - Upgrade / downgrade their plan
 * - Update payment method
 * - View billing history
 * - Cancel subscription
 */
export async function POST(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'

    const portalUrl = await createPortalSession(
      session.user_id as number,
      `${appUrl}/account`,
    )

    L.info('billing.portal.created', { userId: session.user_id })

    return NextResponse.json({ ok: true, portalUrl })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'NO_ACTIVE_SUBSCRIPTION') {
      return NextResponse.json(
        { error: 'No active subscription found', code: 'NO_SUBSCRIPTION' },
        { status: 404 },
      )
    }
    L.error('billing.portal.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
