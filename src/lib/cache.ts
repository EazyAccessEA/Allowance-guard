// lib/cache.ts - Caching layer with Redis (primary) and database (fallback)
import { pool } from './db'
import { getRedisClient } from './redis'
import { log } from './logger'

// --- Predefined TTLs (seconds) matching caching strategy ---
export const CACHE_TTL = {
  GAS_PRICES: 60,
  TOKEN_METADATA: 3600,
  PLAN_LIMITS: 300,
  SCAN_RESULTS: 300,
  HEALTH_CHECK: 60,
  DEFAULT: 3600,
} as const

// Create cache table if it doesn't exist (DB fallback)
export async function initCache() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cache (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache(expires_at)
  `)
}

// Set a cache entry with TTL in seconds
export async function cacheSet(key: string, value: unknown, ttlSeconds: number = CACHE_TTL.DEFAULT): Promise<void> {
  const serializedValue = JSON.stringify(value)

  // Try Redis first
  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.set(key, serializedValue, { EX: ttlSeconds })
      log('debug', 'cache:set:redis', { key, ttl: ttlSeconds })
      return
    } catch {
      log('warn', 'cache:set:redis:fallback', { key, reason: 'Redis write failed, falling back to DB' })
    }
  }

  // DB fallback
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)
  await pool.query(`
    INSERT INTO cache (key, value, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (key)
    DO UPDATE SET value = $2, expires_at = $3
  `, [key, serializedValue, expiresAt])
  log('debug', 'cache:set:db', { key, ttl: ttlSeconds })
}

// Get a cache entry
export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  // Try Redis first
  const redis = getRedisClient()
  if (redis) {
    try {
      const val = await redis.get(key)
      if (val !== null) {
        log('debug', 'cache:hit:redis', { key })
        return JSON.parse(val) as T
      }
      log('debug', 'cache:miss:redis', { key })
      return null
    } catch {
      log('warn', 'cache:get:redis:fallback', { key, reason: 'Redis read failed, falling back to DB' })
    }
  }

  // DB fallback
  const { rows } = await pool.query(`
    SELECT value FROM cache
    WHERE key = $1 AND expires_at > NOW()
  `, [key])

  if (rows.length === 0) {
    log('debug', 'cache:miss:db', { key })
    return null
  }

  log('debug', 'cache:hit:db', { key })
  try {
    return JSON.parse(rows[0].value as string) as T
  } catch {
    return null
  }
}

// Delete a cache entry (supports wildcard patterns)
export async function cacheDel(pattern: string): Promise<void> {
  // Redis
  const redis = getRedisClient()
  if (redis) {
    try {
      if (pattern.includes('*')) {
        // Use SCAN + DEL for wildcard patterns
        let cursor = 0
        do {
          const result = await redis.scan(cursor, { MATCH: pattern, COUNT: 100 })
          cursor = result.cursor
          if (result.keys.length > 0) {
            await redis.del(result.keys)
          }
        } while (cursor !== 0)
      } else {
        await redis.del(pattern)
      }
    } catch {
      // Fallthrough to DB cleanup
    }
  }

  // DB cleanup (always run to keep DB cache consistent)
  if (pattern.includes('*')) {
    const sqlPattern = pattern.replace(/\*/g, '%')
    await pool.query('DELETE FROM cache WHERE key LIKE $1', [sqlPattern])
  } else {
    await pool.query('DELETE FROM cache WHERE key = $1', [pattern])
  }
}

// Clean up expired entries
export async function cleanupCache(): Promise<void> {
  await pool.query('DELETE FROM cache WHERE expires_at <= NOW()')
}

// Invalidate plan-related caches for a user (call on subscription changes)
export async function invalidateUserPlanCache(userId: string): Promise<void> {
  await cacheDel(`plan:${userId}*`)
  await cacheDel(`features:${userId}*`)
}

// Health check for cache
export async function cacheHealthCheck(): Promise<{ ok: boolean; message: string; backend: string }> {
  const redis = getRedisClient()
  if (redis) {
    try {
      await redis.set('health_check', JSON.stringify({ timestamp: Date.now() }), { EX: 60 })
      const val = await redis.get('health_check')
      if (val) {
        return { ok: true, message: 'ok', backend: 'redis' }
      }
      return { ok: false, message: 'Redis read failed', backend: 'redis' }
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Unknown error', backend: 'redis' }
    }
  }

  // DB fallback health check
  try {
    await initCache()
    await cacheSet('health_check', { timestamp: Date.now() }, CACHE_TTL.HEALTH_CHECK)
    const result = await cacheGet<{ timestamp: number }>('health_check')

    if (result && result.timestamp) {
      return { ok: true, message: 'ok', backend: 'database' }
    } else {
      return { ok: false, message: 'cache read failed', backend: 'database' }
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      backend: 'database',
    }
  }
}
