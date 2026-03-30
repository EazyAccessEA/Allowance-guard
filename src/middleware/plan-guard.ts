import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature, checkWalletQuota, type FeatureCheckResult } from '@/lib/feature-gate'
import type { GatedFeature } from '@/lib/plans'

/**
 * Middleware that gates a route handler behind a feature check.
 * Returns 403 with upgrade information if the user's plan doesn't include the feature.
 *
 * Usage:
 * ```ts
 * export async function POST(req: Request) {
 *   const guard = await requireFeature(req, 'batchRevoke')
 *   if (guard) return guard // 401 or 403
 *   // ... handler logic
 * }
 * ```
 */
export async function requireFeature(
  _req: Request,
  feature: GatedFeature,
): Promise<NextResponse | null> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHENTICATED' },
      { status: 401 },
    )
  }

  const result = await checkFeature(session.user_id as number, feature)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Feature not available on your current plan',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: result.plan,
        requiredPlan: result.requiredPlan,
        feature,
        upgradeUrl: '/pricing',
      },
      { status: 403 },
    )
  }

  return null // Access granted
}

/**
 * Gate a route behind the wallet quota check.
 */
export async function requireWalletQuota(
  _req: Request,
): Promise<{ response: NextResponse; result?: never } | { result: FeatureCheckResult; response?: never } | NextResponse | null> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required', code: 'UNAUTHENTICATED' },
      { status: 401 },
    )
  }

  const result = await checkWalletQuota(session.user_id as number)

  if (!result.allowed) {
    return NextResponse.json(
      {
        error: 'Wallet limit reached',
        code: 'WALLET_LIMIT_EXCEEDED',
        plan: result.plan,
        limit: result.limit,
        used: result.used,
        requiredPlan: result.requiredPlan,
        upgradeUrl: '/pricing',
      },
      { status: 403 },
    )
  }

  return null
}
