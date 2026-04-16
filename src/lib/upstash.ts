// src/lib/upstash.ts — Shared Upstash client for rate limiting, metrics, and caching.
//
// Replaces the self-hosted redis client at src/lib/redis.ts. Upstash uses HTTPS
// REST, not TCP, so it plays well with Vercel's serverless function model — no
// connection pool, no cold-start connect races. A single stateless client is
// cheap to create per request; we cache one instance per process anyway.
//
// Configuration lives in two env vars:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// Both unset → the client factory returns null, and each consumer (ratelimit,
// metrics, cache) is expected to handle that gracefully:
//   - ratelimit: fail open (rate limiter intentionally disabled for this env)
//   - metrics:   silent no-op (operational telemetry is optional)
//   - cache:     fall through to the PostgreSQL cache table
//
// Both set but Upstash unreachable → consumers handle per their failure policy.
// ratelimit fails closed in this case (security-significant); cache falls back
// to Postgres; metrics logs and moves on.

import { Redis } from '@upstash/redis'

let _client: Redis | null = null
let _checked = false

/**
 * Get the shared Upstash client, or null if not configured.
 *
 * Safe to call from anywhere; idempotent; no side effects beyond the singleton.
 */
export function getUpstash(): Redis | null {
  if (_checked) return _client

  _checked = true

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    _client = null
    return null
  }

  _client = new Redis({
    url,
    token,
    // Don't retry on the client; the consumers decide whether a failure should
    // fall back, fail closed, or silently drop. Retries here would multiply
    // request latency under flaky network conditions.
    retry: false,
  })

  return _client
}

/**
 * True when Upstash env vars are configured for this process.
 * Useful for tests and startup logs; does not touch the network.
 */
export function isUpstashConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

/**
 * Health-check the Upstash connection with a PING.
 * Returns an object shaped to match the previous redisHealthCheck() contract
 * so /api/healthz can swap in without changing its response shape.
 */
export async function upstashHealthCheck(): Promise<{
  ok: boolean
  latencyMs: number
  message: string
}> {
  const client = getUpstash()
  if (!client) {
    return { ok: false, latencyMs: 0, message: 'Upstash not configured' }
  }

  const start = Date.now()
  try {
    const res = await client.ping()
    return {
      ok: res === 'PONG',
      latencyMs: Date.now() - start,
      message: res === 'PONG' ? 'ok' : `unexpected response: ${String(res)}`,
    }
  } catch (err) {
    return {
      ok: false,
      latencyMs: Date.now() - start,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}

/**
 * Test-only: reset the cached client. Used by unit tests that mutate
 * process.env between assertions to force a fresh read.
 */
export function __resetUpstashForTests(): void {
  _client = null
  _checked = false
}
