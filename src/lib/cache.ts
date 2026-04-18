// lib/cache.ts — Caching layer. Upstash (primary) with PostgreSQL fallback.
//
// The public API is unchanged from the previous Redis-backed version.
// Internally we swap self-hosted redis for Upstash Serverless Redis. Both
// paths serialise to JSON so cache entries round-trip through either backend
// with consistent shape.
//
// Failure behaviour:
//   - Upstash unconfigured → skip directly to the PG backend.
//   - Upstash write/read throws → log once, fall back to PG.
//   - PG backend handles everything end-to-end and is also the authoritative
//     deletion path (DB cleanup runs even when Upstash succeeds, to keep
//     stale entries from piling up if we later drop Upstash).

import { pool } from './db'
import { getUpstash } from './upstash'
import { log } from './logger'

// --- Predefined TTLs (seconds) matching the caching strategy ---
export const CACHE_TTL = {
  GAS_PRICES: 60,
  TOKEN_METADATA: 3600,
  PLAN_LIMITS: 300,
  SCAN_RESULTS: 300,
  HEALTH_CHECK: 60,
  DEFAULT: 3600,
} as const

// Create cache table if it doesn't exist (DB fallback).
export async function initCache(): Promise<void> {
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

// Set a cache entry with TTL in seconds.
export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds: number = CACHE_TTL.DEFAULT,
): Promise<void> {
  const serializedValue = JSON.stringify(value)

  // Try Upstash first.
  const upstash = getUpstash()
  if (upstash) {
    try {
      await upstash.set(key, serializedValue, { ex: ttlSeconds })
      log('debug', 'cache:set:upstash', { key, ttl: ttlSeconds })
      return
    } catch {
      log('warn', 'cache:set:upstash:fallback', {
        key,
        reason: 'Upstash write failed, falling back to DB',
      })
    }
  }

  // DB fallback.
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000)
  await pool.query(
    `
    INSERT INTO cache (key, value, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (key)
    DO UPDATE SET value = $2, expires_at = $3
  `,
    [key, serializedValue, expiresAt],
  )
  log('debug', 'cache:set:db', { key, ttl: ttlSeconds })
}

// Get a cache entry.
export async function cacheGet<T = unknown>(key: string): Promise<T | null> {
  // Try Upstash first.
  const upstash = getUpstash()
  if (upstash) {
    try {
      const raw = await upstash.get<string>(key)
      if (raw !== null && raw !== undefined) {
        log('debug', 'cache:hit:upstash', { key })
        // Upstash auto-deserialises JSON when it can. Accept both shapes —
        // a string we stored ourselves, or a pre-parsed object from Upstash.
        if (typeof raw === 'string') {
          try {
            return JSON.parse(raw) as T
          } catch {
            return null
          }
        }
        return raw as unknown as T
      }
      log('debug', 'cache:miss:upstash', { key })
      return null
    } catch {
      log('warn', 'cache:get:upstash:fallback', {
        key,
        reason: 'Upstash read failed, falling back to DB',
      })
    }
  }

  // DB fallback.
  const { rows } = await pool.query(
    `
    SELECT value FROM cache
    WHERE key = $1 AND expires_at > NOW()
  `,
    [key],
  )

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

// Delete a cache entry (supports wildcard patterns).
export async function cacheDel(pattern: string): Promise<void> {
  // Upstash path.
  const upstash = getUpstash()
  if (upstash) {
    try {
      if (pattern.includes('*')) {
        // SCAN + DEL for wildcards. Upstash returns [cursor, keys] tuples.
        let cursor: string | number = 0
        do {
          const res = (await upstash.scan(cursor, {
            match: pattern,
            count: 100,
          })) as [string | number, string[]]
          const nextCursor: string | number = res[0]
          const keys: string[] = res[1]
          cursor = nextCursor
          if (keys.length > 0) {
            await upstash.del(...keys)
          }
        } while (cursor !== 0 && cursor !== '0')
      } else {
        await upstash.del(pattern)
      }
    } catch {
      // Fall through to DB cleanup.
    }
  }

  // DB cleanup (always run to keep the DB cache consistent, regardless of
  // whether Upstash succeeded — simplifies eventual migration off Upstash).
  if (pattern.includes('*')) {
    const sqlPattern = pattern.replace(/\*/g, '%')
    await pool.query('DELETE FROM cache WHERE key LIKE $1', [sqlPattern])
  } else {
    await pool.query('DELETE FROM cache WHERE key = $1', [pattern])
  }
}

// Clean up expired entries.
export async function cleanupCache(): Promise<void> {
  await pool.query('DELETE FROM cache WHERE expires_at <= NOW()')
}

// Invalidate plan-related caches for a user (call on subscription changes).
export async function invalidateUserPlanCache(userId: string): Promise<void> {
  await cacheDel(`plan:${userId}*`)
  await cacheDel(`features:${userId}*`)
}

// Health check for the cache layer.
//
// Previous implementation did SET+GET per call. On a production deployment
// where Vercel pings /api/healthz and any external uptime monitor polls the
// same endpoint, that worked out to 2 Upstash writes per probe — the single
// biggest contributor to a 497K-writes-per-month burn that tripped the
// free-tier 500K ceiling. A PING is a one-command read-class check that
// proves the same thing the SET/GET round-trip was proving (can we reach
// Upstash) without burning write budget. If reachability is fine, SET/GET
// will also work; testing it on every probe was paranoia dressed as
// coverage.
export async function cacheHealthCheck(): Promise<{
  ok: boolean
  message: string
  backend: string
}> {
  const upstash = getUpstash()
  if (upstash) {
    try {
      const res = await upstash.ping()
      if (res === 'PONG') {
        return { ok: true, message: 'ok', backend: 'upstash' }
      }
      return {
        ok: false,
        message: `unexpected ping response: ${String(res)}`,
        backend: 'upstash',
      }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        backend: 'upstash',
      }
    }
  }

  // DB fallback health check.
  try {
    await initCache()
    await cacheSet(
      'health_check',
      { timestamp: Date.now() },
      CACHE_TTL.HEALTH_CHECK,
    )
    const result = await cacheGet<{ timestamp: number }>('health_check')

    if (result && result.timestamp) {
      return { ok: true, message: 'ok', backend: 'database' }
    }
    return { ok: false, message: 'cache read failed', backend: 'database' }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      backend: 'database',
    }
  }
}
