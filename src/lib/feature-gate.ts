import { getUserSubscription } from '@/lib/billing'
import {
  type ConsumerPlan,
  type GatedFeature,
  type PlanLimits,
  getPlanLimits,
  isUnlimited,
} from '@/lib/plans'
import { pool } from '@/lib/db'

// ---------------------------------------------------------------------------
// Feature check result
// ---------------------------------------------------------------------------

export interface FeatureCheckResult {
  allowed: boolean
  /** Current plan */
  plan: ConsumerPlan
  /** Numeric limit (-1 = unlimited), present for quota-based checks */
  limit?: number
  /** Current usage count, present for quota-based checks */
  used?: number
  /** Minimum plan required to unlock this feature */
  requiredPlan?: ConsumerPlan
}

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

/**
 * Check whether a user has access to a specific boolean feature.
 */
export async function checkFeature(
  userId: number,
  feature: GatedFeature,
): Promise<FeatureCheckResult> {
  const sub = await getUserSubscription(userId)
  const limits = getPlanLimits(sub.plan)
  const allowed = limits[feature] === true

  const result: FeatureCheckResult = { allowed, plan: sub.plan }

  if (!allowed) {
    result.requiredPlan = getMinimumPlan(feature)
  }

  return result
}

/**
 * Check whether a user is within their wallet quota.
 */
export async function checkWalletQuota(userId: number): Promise<FeatureCheckResult> {
  const sub = await getUserSubscription(userId)
  const limits = getPlanLimits(sub.plan)

  if (isUnlimited(limits.maxWallets)) {
    return { allowed: true, plan: sub.plan, limit: -1, used: 0 }
  }

  // Count user's saved wallets
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM user_wallets WHERE user_id = $1`,
    [userId],
  )
  const used = (rows[0]?.count as number) ?? 0

  return {
    allowed: used < limits.maxWallets,
    plan: sub.plan,
    limit: limits.maxWallets,
    used,
    requiredPlan: used >= limits.maxWallets ? 'pro' : undefined,
  }
}

/**
 * Check whether a user is within their daily API call quota.
 */
export async function checkApiQuota(userId: number): Promise<FeatureCheckResult> {
  const sub = await getUserSubscription(userId)
  const limits = getPlanLimits(sub.plan)

  if (isUnlimited(limits.maxApiCallsPerDay)) {
    return { allowed: true, plan: sub.plan, limit: -1, used: 0 }
  }

  // Count today's API calls
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM usage_records
     WHERE user_id = $1 AND timestamp >= NOW() - INTERVAL '1 day'`,
    [userId],
  )
  const used = (rows[0]?.count as number) ?? 0

  return {
    allowed: used < limits.maxApiCallsPerDay,
    plan: sub.plan,
    limit: limits.maxApiCallsPerDay,
    used,
  }
}

/**
 * Check chain access — free tier gets 1 chain, paid get all 27.
 */
export async function checkChainAccess(userId: number, requestedChains: number): Promise<FeatureCheckResult> {
  const sub = await getUserSubscription(userId)
  const limits = getPlanLimits(sub.plan)

  return {
    allowed: requestedChains <= limits.maxChains,
    plan: sub.plan,
    limit: limits.maxChains,
    used: requestedChains,
    requiredPlan: requestedChains > limits.maxChains ? 'pro' : undefined,
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FEATURE_MIN_PLAN: Record<GatedFeature, ConsumerPlan> = {
  monitoring: 'pro',
  batchRevoke: 'pro',
  export: 'pro',
  alerts: 'pro',
  timeMachine: 'pro',
  teams: 'sentinel',
  automatedRules: 'sentinel',
  prioritySupport: 'sentinel',
  webhooks: 'sentinel',
}

function getMinimumPlan(feature: GatedFeature): ConsumerPlan {
  return FEATURE_MIN_PLAN[feature] ?? 'pro'
}

/**
 * Quick boolean check — use when you just need allowed/denied.
 */
export async function isFeatureAllowed(userId: number, feature: GatedFeature): Promise<boolean> {
  const result = await checkFeature(userId, feature)
  return result.allowed
}

/**
 * Get full plan limits for a user (resolves their subscription first).
 */
export async function getUserPlanLimits(userId: number): Promise<PlanLimits & { plan: ConsumerPlan }> {
  const sub = await getUserSubscription(userId)
  return { ...getPlanLimits(sub.plan), plan: sub.plan }
}
