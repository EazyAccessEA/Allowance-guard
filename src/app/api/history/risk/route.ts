import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { getRiskSnapshots } from '../risk-snapshots'

/**
 * GET /api/history/risk — Time Machine.
 *
 * Pricing claim: "Time Machine" (historical risk timeline) requires
 * the Pro plan or above. Previously the route was a thin pass-through
 * to getRiskSnapshots with no auth and no plan gate — Free users could
 * read history by hitting the endpoint directly. P0 fix.
 */
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(Number(session.user_id), 'timeMachine')
  if (!access.allowed) {
    return NextResponse.json(
      {
        error: 'Time Machine requires the Pro plan or above',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: access.plan,
        requiredPlan: access.requiredPlan,
        upgradeUrl: '/pricing',
      },
      { status: 403 },
    )
  }

  return getRiskSnapshots(req)
}
