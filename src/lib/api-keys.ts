import { randomBytes, createHash } from 'crypto'
import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'
import type { ApiPlan } from '@/lib/plans'
import { API_PLAN_LIMITS } from '@/lib/plans'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SECRET_KEY_PREFIX = 'ag_live_'
const PUBLIC_KEY_PREFIX = 'ag_pub_'
const KEY_RANDOM_BYTES = 32 // 256-bit entropy

export type KeyType = 'secret' | 'public'

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

/**
 * Generate a new API key.
 * Returns the full plaintext key (shown once to the user) and stores
 * only the SHA-256 hash in the database.
 */
export async function generateApiKey(
  userId: number,
  name: string,
  plan: ApiPlan = 'api_free',
): Promise<{ key: string; id: string; prefix: string }> {
  const random = randomBytes(KEY_RANDOM_BYTES).toString('hex')
  const fullKey = `${SECRET_KEY_PREFIX}${random}`
  const keyHash = hashKey(fullKey)
  const prefix = fullKey.slice(0, SECRET_KEY_PREFIX.length + 8) // ag_live_xxxxxxxx

  const rateLimit = API_PLAN_LIMITS[plan].callsPerDay

  const { rows } = await pool.query(
    `INSERT INTO api_keys (user_id, key_hash, prefix, name, plan, rate_limit, key_type)
     VALUES ($1, $2, $3, $4, $5, $6, 'secret')
     RETURNING id`,
    [userId, keyHash, prefix, name, plan, rateLimit],
  )

  apiLogger.info('api_key.created', { userId, keyId: rows[0].id, prefix, plan, keyType: 'secret' })

  return {
    key: fullKey,
    id: rows[0].id as string,
    prefix,
  }
}

/**
 * Generate a new PUBLIC API key (`ag_pub_*`). These keys are safe to embed
 * in browser code because the middleware:
 *   - restricts them to GET requests only
 *   - enforces the `api_public` rate limit tier (500 calls/day)
 *   - optionally checks `allowed_origins` against the Origin header
 *
 * The caller should only persist the returned `key` in an env var scoped
 * to the browser bundle (e.g. `NEXT_PUBLIC_ALLOWANCE_GUARD_KEY`). The
 * plaintext is shown once and then lost — only the hash is stored.
 */
export async function generatePublicApiKey(
  userId: number,
  name: string,
  allowedOrigins?: string[],
): Promise<{ key: string; id: string; prefix: string }> {
  const random = randomBytes(KEY_RANDOM_BYTES).toString('hex')
  const fullKey = `${PUBLIC_KEY_PREFIX}${random}`
  const keyHash = hashKey(fullKey)
  const prefix = fullKey.slice(0, PUBLIC_KEY_PREFIX.length + 8) // ag_pub_xxxxxxxx

  const rateLimit = API_PLAN_LIMITS.api_public.callsPerDay

  const { rows } = await pool.query(
    `INSERT INTO api_keys (user_id, key_hash, prefix, name, plan, rate_limit, key_type, allowed_origins)
     VALUES ($1, $2, $3, $4, 'api_public', $5, 'public', $6)
     RETURNING id`,
    [userId, keyHash, prefix, name, rateLimit, allowedOrigins ?? null],
  )

  apiLogger.info('api_key.created', {
    userId,
    keyId: rows[0].id,
    prefix,
    plan: 'api_public',
    keyType: 'public',
    allowedOrigins,
  })

  return {
    key: fullKey,
    id: rows[0].id as string,
    prefix,
  }
}

// ---------------------------------------------------------------------------
// Key validation
// ---------------------------------------------------------------------------

export interface ValidatedKey {
  id: string
  userId: number
  plan: ApiPlan
  rateLimit: number
  prefix: string
  name: string
  keyType: KeyType
  allowedOrigins: string[] | null
}

/**
 * Validate an API key from a request.
 * Returns the key record if valid, or null if invalid/revoked/expired.
 * Accepts both secret (`ag_live_*`) and public (`ag_pub_*`) prefixes.
 */
export async function validateApiKey(key: string): Promise<ValidatedKey | null> {
  if (!key.startsWith(SECRET_KEY_PREFIX) && !key.startsWith(PUBLIC_KEY_PREFIX)) {
    return null
  }

  const keyHash = hashKey(key)

  const { rows } = await pool.query(
    `SELECT id, user_id, plan, rate_limit, prefix, name, key_type, allowed_origins
     FROM api_keys
     WHERE key_hash = $1
       AND revoked_at IS NULL
       AND (expires_at IS NULL OR expires_at > NOW())`,
    [keyHash],
  )

  if (!rows[0]) {
    return null
  }

  // Update last_used_at asynchronously (fire and forget)
  pool.query(
    `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
    [rows[0].id],
  ).catch(() => {}) // Swallow errors on non-critical update

  return {
    id: rows[0].id as string,
    userId: rows[0].user_id as number,
    plan: rows[0].plan as ApiPlan,
    rateLimit: rows[0].rate_limit as number,
    prefix: rows[0].prefix as string,
    name: rows[0].name as string,
    keyType: (rows[0].key_type as KeyType) ?? 'secret',
    allowedOrigins: (rows[0].allowed_origins as string[] | null) ?? null,
  }
}

// ---------------------------------------------------------------------------
// Key management
// ---------------------------------------------------------------------------

export interface ApiKeyInfo {
  id: string
  prefix: string
  name: string
  plan: string
  rateLimit: number
  keyType: KeyType
  allowedOrigins: string[] | null
  lastUsedAt: string | null
  createdAt: string
}

/**
 * List all active (non-revoked) API keys for a user.
 * Never returns the full key or hash.
 */
export async function listApiKeys(userId: number): Promise<ApiKeyInfo[]> {
  const { rows } = await pool.query(
    `SELECT id, prefix, name, plan, rate_limit, key_type, allowed_origins, last_used_at, created_at
     FROM api_keys
     WHERE user_id = $1 AND revoked_at IS NULL
     ORDER BY created_at DESC`,
    [userId],
  )

  return rows.map((r) => ({
    id: r.id as string,
    prefix: r.prefix as string,
    name: r.name as string,
    plan: r.plan as string,
    rateLimit: r.rate_limit as number,
    keyType: ((r.key_type as KeyType) ?? 'secret'),
    allowedOrigins: (r.allowed_origins as string[] | null) ?? null,
    lastUsedAt: r.last_used_at ? (r.last_used_at as Date).toISOString() : null,
    createdAt: (r.created_at as Date).toISOString(),
  }))
}

/**
 * Revoke an API key. Soft-deletes by setting revoked_at.
 */
export async function revokeApiKey(userId: number, keyId: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    `UPDATE api_keys SET revoked_at = NOW()
     WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL`,
    [keyId, userId],
  )

  if (rowCount && rowCount > 0) {
    apiLogger.info('api_key.revoked', { userId, keyId })
    return true
  }
  return false
}

// ---------------------------------------------------------------------------
// Plan upgrades (called from webhook on API subscription activation)
// ---------------------------------------------------------------------------

/**
 * Upgrade all active (non-revoked) API keys for a user to a new plan tier.
 * Called by the billing webhook when an API subscription is created/updated.
 * Returns the number of keys upgraded.
 */
export async function upgradeApiKeyPlan(
  userId: number,
  newPlan: ApiPlan,
): Promise<number> {
  const newRateLimit = API_PLAN_LIMITS[newPlan].callsPerDay

  // Only upgrade secret keys. Public keys are pinned to api_public.
  const { rowCount } = await pool.query(
    `UPDATE api_keys
     SET plan = $1, rate_limit = $2
     WHERE user_id = $3 AND revoked_at IS NULL AND key_type = 'secret'`,
    [newPlan, newRateLimit, userId],
  )

  const upgraded = rowCount ?? 0
  if (upgraded > 0) {
    apiLogger.info('api_key.plan_upgraded', { userId, newPlan, keysUpgraded: upgraded })
  }

  return upgraded
}

/**
 * Downgrade all active API keys for a user to api_free.
 * Called when an API subscription is cancelled.
 */
export async function downgradeApiKeysToFree(userId: number): Promise<number> {
  return upgradeApiKeyPlan(userId, 'api_free')
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

/**
 * Record an API usage event. Called by the API auth middleware.
 */
export async function recordApiUsage(
  apiKeyId: string,
  userId: number,
  endpoint: string,
  method: string,
  responseStatus: number,
  durationMs?: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO usage_records (user_id, api_key_id, endpoint, method, response_status, duration_ms)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, apiKeyId, endpoint, method, responseStatus, durationMs ?? null],
  ).catch((err) => {
    apiLogger.error('usage.record.failed', {
      error: err instanceof Error ? err.message : 'Unknown error',
    })
  })
}

/**
 * Check if an API key has exceeded its daily rate limit.
 */
export async function checkApiKeyRateLimit(keyId: string, limit: number): Promise<{ allowed: boolean; used: number }> {
  if (limit === -1) {
    return { allowed: true, used: 0 }
  }

  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM usage_records
     WHERE api_key_id = $1 AND timestamp >= NOW() - INTERVAL '1 day'`,
    [keyId],
  )

  const used = (rows[0]?.count as number) ?? 0
  return { allowed: used < limit, used }
}
