import { NextResponse, type NextRequest } from 'next/server'
import { validateApiKey, checkApiKeyRateLimit, recordApiUsage, type ValidatedKey } from '@/lib/api-keys'
import { apiLogger } from '@/lib/logger'

/**
 * Extract and validate an API key from the Authorization header.
 * Used by all /api/v1/* routes.
 *
 * Usage:
 * ```ts
 * export async function GET(req: NextRequest) {
 *   const auth = await authenticateApiKey(req)
 *   if (auth.error) return auth.error
 *   const { apiKey } = auth
 *   // ... handler logic
 * }
 * ```
 */
export async function authenticateApiKey(
  req: NextRequest,
): Promise<{ apiKey: ValidatedKey; error?: never } | { error: NextResponse; apiKey?: never }> {
  const authHeader = req.headers.get('authorization')

  if (!authHeader) {
    return {
      error: NextResponse.json(
        { error: 'Missing Authorization header', code: 'MISSING_AUTH' },
        { status: 401 },
      ),
    }
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return {
      error: NextResponse.json(
        { error: 'Invalid Authorization format. Use: Bearer <api_key>', code: 'INVALID_AUTH_FORMAT' },
        { status: 401 },
      ),
    }
  }

  const key = parts[1]
  const apiKey = await validateApiKey(key)

  if (!apiKey) {
    apiLogger.warn('api_auth.invalid_key', { prefix: key.slice(0, 16) })
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired API key', code: 'INVALID_API_KEY' },
        { status: 401 },
      ),
    }
  }

  // Check rate limit
  const rateCheck = await checkApiKeyRateLimit(apiKey.id, apiKey.rateLimit)
  if (!rateCheck.allowed) {
    return {
      error: NextResponse.json(
        {
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          limit: apiKey.rateLimit,
          used: rateCheck.used,
          resetsIn: '24h',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(apiKey.rateLimit),
            'X-RateLimit-Remaining': '0',
            'Retry-After': '3600',
          },
        },
      ),
    }
  }

  // Set rate limit headers on eventual response (caller should forward)
  const remaining = apiKey.rateLimit === -1 ? 'unlimited' : String(apiKey.rateLimit - rateCheck.used - 1)

  // Attach rate limit info to the key for the handler to use
  ;(apiKey as ValidatedKey & { _rateRemaining?: string })._rateRemaining = remaining

  return { apiKey }
}

/**
 * Helper to build consistent rate-limit headers for API v1 responses.
 */
export function rateLimitHeaders(apiKey: ValidatedKey): Record<string, string> {
  const remaining = (apiKey as ValidatedKey & { _rateRemaining?: string })._rateRemaining ?? ''
  return {
    'X-RateLimit-Limit': apiKey.rateLimit === -1 ? 'unlimited' : String(apiKey.rateLimit),
    'X-RateLimit-Remaining': remaining,
  }
}

/**
 * Wrap a v1 API handler to record usage after the response.
 */
export function withUsageTracking(
  apiKey: ValidatedKey,
  req: NextRequest,
  response: NextResponse,
  startTime: number,
): void {
  const duration = Date.now() - startTime
  const endpoint = new URL(req.url).pathname
  const method = req.method

  // Fire and forget
  recordApiUsage(apiKey.id, apiKey.userId, endpoint, method, response.status, duration)
}
