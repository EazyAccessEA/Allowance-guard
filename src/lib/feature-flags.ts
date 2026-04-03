import { pool } from '@/lib/db'

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  rollout_percentage: number
  target_plans: string[]
  enabled: boolean
}

// In-memory cache with TTL
let flagCache: { flags: FeatureFlag[]; expiry: number } | null = null
const CACHE_TTL_MS = 60_000 // 60 seconds

/**
 * Load all feature flags (cached for 60 seconds).
 */
async function loadFlags(): Promise<FeatureFlag[]> {
  const now = Date.now()
  if (flagCache && flagCache.expiry > now) {
    return flagCache.flags
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, name, description, rollout_percentage, target_plans, enabled
       FROM feature_flags
       WHERE enabled = true`,
    )
    const flags = rows as unknown as FeatureFlag[]
    flagCache = { flags, expiry: now + CACHE_TTL_MS }
    return flags
  } catch (err) {
    console.error('[feature-flags] loadFlags failed:', err)
    return flagCache?.flags ?? []
  }
}

/**
 * Check if a feature flag is enabled for a given user.
 *
 * Uses consistent hashing: `userId % 100 < rolloutPercentage`
 * so the same user always gets the same result for a given flag.
 *
 * @param userId - The user's numeric ID (null = anonymous, always false)
 * @param flagName - The feature flag name
 * @param userPlan - Optional user plan for plan-targeted flags
 */
export async function isEnabled(
  userId: number | null,
  flagName: string,
  userPlan?: string,
): Promise<boolean> {
  const flags = await loadFlags()
  const flag = flags.find((f) => f.name === flagName)

  if (!flag || !flag.enabled) return false

  // Check plan targeting (if the flag has target_plans set)
  const targetPlans = Array.isArray(flag.target_plans) ? flag.target_plans : []
  if (targetPlans.length > 0 && userPlan) {
    if (!targetPlans.includes(userPlan)) return false
  }

  // Anonymous users never get feature flags
  if (userId == null) return false

  // Consistent hashing for deterministic assignment
  const bucket = Math.abs(userId) % 100
  return bucket < flag.rollout_percentage
}

/**
 * Invalidate the flag cache (call after admin updates).
 */
export function invalidateFlagCache(): void {
  flagCache = null
}
