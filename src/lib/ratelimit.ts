// src/lib/ratelimit.ts — Fixed-window rate limiting on Upstash Serverless Redis.
//
// Public API is preserved from the previous self-hosted Redis implementation:
//   limitHit(key, windowSec, max)        → { allowed, remaining, ttl }
//   limitOrThrow(ip, endpoint)           → throws 'Rate limit exceeded' if over
//
// Failure policy:
//   - Upstash NOT configured (env vars absent) → fail OPEN. Rate limiter is
//     intentionally disabled for this environment. No network calls, no logs.
//   - Upstash configured but unreachable or quota-exhausted → fail OPEN with
//     a loud error log. Previous behaviour was fail-closed; this was reverted
//     after an Upstash free-tier 500K/month quota hit (Apr 2026) turned every
//     rate-limit check into a 429 and locked out 100% of paying users on the
//     OTP + checkout funnels. The security trade-off: an attacker who times
//     their abuse to a provider outage now has a few minutes of unrestricted
//     traffic. That is a vanishingly small window compared to the revenue
//     cost of blocking every legit request every time a vendor hiccups.
//     Matches Vercel / Cloudflare rate-limit defaults.
//
// Operator signal: every fail-open is logged at error level with a stable
// prefix so it surfaces in Rollbar / log search without code changes.
import { getUpstash, isUpstashConfigured } from './upstash'

const FAIL_OPEN_LOG = '[ratelimit] failing OPEN due to Upstash error —'

export async function limitHit(key: string, windowSec: number, max: number) {
  // Not configured — rate limiter intentionally disabled for this environment.
  if (!isUpstashConfigured()) {
    return { allowed: true, remaining: max, ttl: windowSec }
  }

  const client = getUpstash()
  if (!client) {
    // isUpstashConfigured was true but the factory still returned null.
    // Fail open, log loudly so the operator notices the mismatch.
    console.error(
      `${FAIL_OPEN_LOG} client unavailable (key=${key})`,
    )
    return { allowed: true, remaining: max, ttl: windowSec }
  }

  const now = Math.floor(Date.now() / 1000)
  const bucket = `rl:${key}:${Math.floor(now / windowSec)}`

  try {
    // INCR is atomic on Upstash; the first writer gets count=1 and sets TTL.
    const count = await client.incr(bucket)
    if (count === 1) {
      // Fire-and-forget the EXPIRE; a failure here just leaves the key with
      // default no-TTL behaviour, which is worse but not catastrophic — next
      // window flip will overwrite the bucket key.
      await client.expire(bucket, windowSec)
    }
    const ttl = await client.ttl(bucket)
    const allowed = count <= max
    return {
      allowed,
      remaining: Math.max(0, max - count),
      // Upstash returns -1 when no TTL; normalise to the window size so
      // callers always get a positive number for retry-after headers.
      ttl: ttl > 0 ? ttl : windowSec,
    }
  } catch (err) {
    console.error(
      `${FAIL_OPEN_LOG} ${err instanceof Error ? err.message : 'Unknown error'} (key=${key})`,
    )
    return { allowed: true, remaining: max, ttl: windowSec }
  }
}

/** Centralized rate limits for all public endpoints. */
const RATE_LIMITS: Record<string, { windowSec: number; max: number }> = {
  'coinbase-charge':   { windowSec: 60,  max: 10 },
  'stripe-checkout':   { windowSec: 60,  max: 10 },
  'scan':              { windowSec: 60,  max: 12 },
  'share-create':      { windowSec: 60,  max: 20 },
  'bulk-revoke':       { windowSec: 60,  max: 5  },
  'preferences':       { windowSec: 60,  max: 20 },
  'monitor':           { windowSec: 60,  max: 20 },
  'audit-logs':        { windowSec: 60,  max: 30 },
  'billing-invoices':  { windowSec: 60,  max: 20 },
  'contact':           { windowSec: 600, max: 5  },
  'subscribe':         { windowSec: 600, max: 5  },
}

export async function limitOrThrow(ip: string, endpoint: string) {
  const config = RATE_LIMITS[endpoint]
  if (!config) return // no limit configured

  const result = await limitHit(`${endpoint}:${ip}`, config.windowSec, config.max)
  if (!result.allowed) {
    throw new Error('Rate limit exceeded')
  }
  return result
}
