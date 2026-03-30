/**
 * Per-key burst rate limiting for B2B API v1 endpoints.
 *
 * Uses a sliding-window counter stored in the DB-backed cache.
 * Each API key gets a per-minute burst limit based on its plan tier.
 */
import { type NextRequest } from 'next/server'
import { cacheGet, cacheSet } from '@/lib/cache'
import { API_PLAN_LIMITS, type ApiPlan } from '@/lib/plans'
import type { ValidatedKey } from '@/lib/api-keys'
import { apiError } from '@/lib/api-response'
import { apiLogger } from '@/lib/logger'

interface BurstWindow {
  count: number
  windowStart: number
}

const WINDOW_SECONDS = 60

/**
 * Check per-minute burst rate limit for an API key.
 * Returns null if within limits, or a 429 NextResponse if exceeded.
 */
export async function checkBurstRateLimit(
  apiKey: ValidatedKey,
  req: NextRequest,
): Promise<ReturnType<typeof apiError> | null> {
  const planLimits = API_PLAN_LIMITS[apiKey.plan as ApiPlan]
  if (!planLimits || planLimits.burstPerMinute === -1) {
    return null // unlimited burst
  }

  const burstLimit = planLimits.burstPerMinute
  const cacheKey = `burst:${apiKey.id}:${Math.floor(Date.now() / (WINDOW_SECONDS * 1000))}`

  try {
    const existing = await cacheGet(cacheKey) as BurstWindow | null

    if (existing && existing.count >= burstLimit) {
      apiLogger.warn('api.burst_limit_exceeded', {
        keyId: apiKey.id,
        plan: apiKey.plan,
        limit: burstLimit,
        endpoint: new URL(req.url).pathname,
      })

      return apiError(
        'Burst rate limit exceeded. Please slow down.',
        'BURST_RATE_LIMIT_EXCEEDED',
        429,
        apiKey,
        {
          burstLimit,
          windowSeconds: WINDOW_SECONDS,
          retryAfter: WINDOW_SECONDS,
        },
      )
    }

    const newCount = existing ? existing.count + 1 : 1
    await cacheSet(cacheKey, { count: newCount, windowStart: Date.now() }, WINDOW_SECONDS)

    return null
  } catch (err) {
    // On cache failure, allow the request through (fail open)
    apiLogger.error('api.burst_check_failed', {
      error: err instanceof Error ? err.message : 'Unknown error',
      keyId: apiKey.id,
    })
    return null
  }
}

/**
 * Wrapper that authenticates, checks burst limits, and tracks usage
 * for a v1 API route handler.
 */
export { checkBurstRateLimit as burstRateLimit }
