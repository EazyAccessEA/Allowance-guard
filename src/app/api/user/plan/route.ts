import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserSubscription } from '@/lib/billing'
import { getPlanLimits, type ConsumerPlan } from '@/lib/plans'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/user/plan
 *
 * Returns the authenticated user's current plan, limits, and subscription status.
 * Unauthenticated users receive the free plan (no error).
 */
export async function GET(req: Request) {
  const L = withReq(req)

  try {
    const session = await getSession()

    if (!session) {
      // Unauthenticated users default to free — no 401
      const freeLimits = getPlanLimits('free')
      return NextResponse.json({
        plan: 'free' as ConsumerPlan,
        status: 'active',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        limits: freeLimits,
      })
    }

    const subscription = await getUserSubscription(session.user_id as number)
    const limits = getPlanLimits(subscription.plan)

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      limits,
    })
  } catch (error) {
    L.error('user.plan.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    // Fall back to free plan on error to avoid breaking the UI
    const freeLimits = getPlanLimits('free')
    return NextResponse.json({
      plan: 'free' as ConsumerPlan,
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      limits: freeLimits,
    })
  }
}
