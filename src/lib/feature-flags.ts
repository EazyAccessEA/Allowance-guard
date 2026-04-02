/**
 * Feature flags — Phase 8.4
 *
 * Runtime feature toggles with deterministic user assignment.
 * Flags are cached in Redis (60s TTL) for zero-latency evaluation.
 *
 * Usage:
 *   import { isEnabled } from '@/lib/feature-flags'
 *   if (await isEnabled(userId, 'new_pricing_page')) { ... }
 */
import { pool } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/cache'
import { secureLogger } from '@/lib/secure-logger'

const CACHE_PREFIX = 'ff:'
const CACHE_TTL = 60 // seconds
const ALL_FLAGS_KEY = 'ff:__all__'

export interface FeatureFlag {
  id: string
  name: string
  description: string | null
  enabled: boolean
  rolloutPercentage: number
  targetPlans: string[]
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

/**
 * Check if a feature flag is enabled for a specific user.
 * Uses consistent hashing for deterministic assignment.
 */
export async function isEnabled(
  userId: number | null,
  flagName: string,
  userPlan?: string,
): Promise<boolean> {
  try {
    const flag = await getFlag(flagName)
    if (!flag || !flag.enabled) return false

    // Plan targeting: if targetPlans is non-empty, user must be on one of those plans
    if (flag.targetPlans.length > 0 && userPlan) {
      if (!flag.targetPlans.includes(userPlan)) return false
    }

    // 100% rollout — always enabled
    if (flag.rolloutPercentage >= 100) return true

    // 0% rollout — always disabled
    if (flag.rolloutPercentage <= 0) return false

    // No user context — use 50/50 default for anonymous
    if (userId === null) return flag.rolloutPercentage >= 50

    // Deterministic assignment via consistent hashing
    const bucket = userId % 100
    return bucket < flag.rolloutPercentage
  } catch (err) {
    secureLogger.error('Feature flag evaluation failed', {
      flagName,
      error: err instanceof Error ? err.message : String(err),
    })
    return false // fail closed
  }
}

/**
 * Get a single flag by name (with caching).
 */
async function getFlag(name: string): Promise<FeatureFlag | null> {
  const cacheKey = `${CACHE_PREFIX}${name}`

  // Check cache first
  const cached = await cacheGet<FeatureFlag>(cacheKey)
  if (cached) return cached

  const { rows } = await pool.query(
    `SELECT id, name, description, enabled, rollout_percentage, target_plans, metadata, created_at, updated_at
     FROM feature_flags WHERE name = $1`,
    [name],
  )

  if (rows.length === 0) return null

  const row = rows[0]
  const flag: FeatureFlag = {
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    enabled: Boolean(row.enabled),
    rolloutPercentage: Number(row.rollout_percentage),
    targetPlans: Array.isArray(row.target_plans) ? (row.target_plans as string[]) : [],
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }

  await cacheSet(cacheKey, flag, CACHE_TTL)
  return flag
}

/**
 * Get all feature flags (for admin UI).
 */
export async function getAllFlags(): Promise<FeatureFlag[]> {
  const cached = await cacheGet<FeatureFlag[]>(ALL_FLAGS_KEY)
  if (cached) return cached

  const { rows } = await pool.query(
    `SELECT id, name, description, enabled, rollout_percentage, target_plans, metadata, created_at, updated_at
     FROM feature_flags ORDER BY name ASC`,
  )

  const flags: FeatureFlag[] = rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    enabled: Boolean(row.enabled),
    rolloutPercentage: Number(row.rollout_percentage),
    targetPlans: Array.isArray(row.target_plans) ? (row.target_plans as string[]) : [],
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }))

  await cacheSet(ALL_FLAGS_KEY, flags, CACHE_TTL)
  return flags
}

/**
 * Create a feature flag (admin only).
 */
export async function createFlag(data: {
  name: string
  description?: string
  enabled?: boolean
  rolloutPercentage?: number
  targetPlans?: string[]
}): Promise<FeatureFlag> {
  const { rows } = await pool.query(
    `INSERT INTO feature_flags (name, description, enabled, rollout_percentage, target_plans)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, description, enabled, rollout_percentage, target_plans, metadata, created_at, updated_at`,
    [
      data.name,
      data.description ?? null,
      data.enabled ?? false,
      data.rolloutPercentage ?? 0,
      JSON.stringify(data.targetPlans ?? []),
    ],
  )

  await invalidateCache()
  const row = rows[0]
  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    enabled: Boolean(row.enabled),
    rolloutPercentage: Number(row.rollout_percentage),
    targetPlans: Array.isArray(row.target_plans) ? (row.target_plans as string[]) : [],
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

/**
 * Update a feature flag (admin only).
 */
export async function updateFlag(
  id: string,
  data: Partial<{
    description: string
    enabled: boolean
    rolloutPercentage: number
    targetPlans: string[]
  }>,
): Promise<FeatureFlag | null> {
  const sets: string[] = []
  const params: unknown[] = []
  let idx = 1

  if (data.description !== undefined) {
    sets.push(`description = $${idx++}`)
    params.push(data.description)
  }
  if (data.enabled !== undefined) {
    sets.push(`enabled = $${idx++}`)
    params.push(data.enabled)
  }
  if (data.rolloutPercentage !== undefined) {
    sets.push(`rollout_percentage = $${idx++}`)
    params.push(data.rolloutPercentage)
  }
  if (data.targetPlans !== undefined) {
    sets.push(`target_plans = $${idx++}`)
    params.push(JSON.stringify(data.targetPlans))
  }

  if (sets.length === 0) return null

  sets.push(`updated_at = NOW()`)
  params.push(id)

  const { rows } = await pool.query(
    `UPDATE feature_flags SET ${sets.join(', ')} WHERE id = $${idx}
     RETURNING id, name, description, enabled, rollout_percentage, target_plans, metadata, created_at, updated_at`,
    params,
  )

  await invalidateCache()

  if (rows.length === 0) return null
  const row = rows[0]
  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    enabled: Boolean(row.enabled),
    rolloutPercentage: Number(row.rollout_percentage),
    targetPlans: Array.isArray(row.target_plans) ? (row.target_plans as string[]) : [],
    metadata: (row.metadata as Record<string, unknown>) || {},
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }
}

/**
 * Delete a feature flag (admin only).
 */
export async function deleteFlag(id: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `DELETE FROM feature_flags WHERE id = $1`,
    [id],
  )
  await invalidateCache()
  return rowCount > 0
}

/** Invalidate all flag caches */
async function invalidateCache(): Promise<void> {
  // We can't easily wildcard-delete from our cache layer,
  // but the 60s TTL ensures flags refresh quickly after changes
  await cacheSet(ALL_FLAGS_KEY, null, 1) // expire immediately
}
