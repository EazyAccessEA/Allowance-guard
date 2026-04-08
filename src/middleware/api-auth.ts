import { NextResponse, type NextRequest } from 'next/server'
import { validateApiKey, checkApiKeyRateLimit, recordApiUsage, type ValidatedKey } from '@/lib/api-keys'
import { apiLogger } from '@/lib/logger'

/**
 * Extract and validate an API key from the Authorization header.
 * Used by all /api/v1/* routes.
 *
 * Behaviour differs by `keyType`:
 *   - `secret` (ag_live_*): unchanged — full access, no origin checks.
 *   - `public` (ag_pub_*):  read-only (GET only), CORS headers attached
 *     to every response, optional origin allow-list enforced against the
 *     `Origin` header, and an `OPTIONS` preflight short-circuits before
 *     authentication runs.
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
  // Handle CORS preflight. Preflight requests never carry an Authorization
  // header, so we must intercept them BEFORE the missing-header branch.
  if (req.method === 'OPTIONS') {
    return { error: buildPreflightResponse(req) }
  }

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

  // --- Public key restrictions ------------------------------------------------
  if (apiKey.keyType === 'public') {
    // Read-only: only GET is ever safe for a browser-embeddable key.
    if (req.method !== 'GET') {
      return {
        error: withCors(
          req,
          apiKey,
          NextResponse.json(
            {
              error: 'Public API keys are read-only. Use a secret key (ag_live_*) ' +
                'from a trusted server for mutations.',
              code: 'PUBLIC_KEY_METHOD_NOT_ALLOWED',
            },
            { status: 405, headers: { allow: 'GET, OPTIONS' } },
          ),
        ),
      }
    }

    // Optional origin allow-list.
    if (apiKey.allowedOrigins && apiKey.allowedOrigins.length > 0) {
      const origin = req.headers.get('origin')
      if (!origin || !apiKey.allowedOrigins.includes(origin)) {
        apiLogger.warn('api_auth.origin_rejected', {
          keyId: apiKey.id,
          origin,
          allowed: apiKey.allowedOrigins,
        })
        return {
          error: withCors(
            req,
            apiKey,
            NextResponse.json(
              { error: 'Origin not allowed for this public API key', code: 'ORIGIN_NOT_ALLOWED' },
              { status: 403 },
            ),
          ),
        }
      }
    }
  }

  // Check rate limit
  const rateCheck = await checkApiKeyRateLimit(apiKey.id, apiKey.rateLimit)
  if (!rateCheck.allowed) {
    return {
      error: withCors(
        req,
        apiKey,
        NextResponse.json(
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
  // Attach CORS headers for public keys so browsers can read the response.
  if (apiKey.keyType === 'public') {
    applyCorsHeaders(req, apiKey, response)
  }

  const duration = Date.now() - startTime
  const endpoint = new URL(req.url).pathname
  const method = req.method

  // Fire and forget
  recordApiUsage(apiKey.id, apiKey.userId, endpoint, method, response.status, duration)
}

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------

const CORS_ALLOWED_HEADERS = 'authorization, content-type, accept, user-agent'
const CORS_ALLOWED_METHODS = 'GET, OPTIONS'
const CORS_MAX_AGE_SECONDS = '600'

/**
 * Build a preflight response. Without a validated key we cannot enforce
 * per-key origin rules, so we echo the Origin header back (standard CORS
 * pattern) and let the subsequent real request run the full origin check.
 */
function buildPreflightResponse(req: NextRequest): NextResponse {
  const origin = req.headers.get('origin') ?? '*'
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': CORS_ALLOWED_METHODS,
      'Access-Control-Allow-Headers': CORS_ALLOWED_HEADERS,
      'Access-Control-Max-Age': CORS_MAX_AGE_SECONDS,
      'Vary': 'Origin',
    },
  })
}

function applyCorsHeaders(req: NextRequest, apiKey: ValidatedKey, response: NextResponse): void {
  const origin = req.headers.get('origin')
  const allowedOrigin = resolveAllowedOrigin(apiKey, origin)
  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin)
    response.headers.append('Vary', 'Origin')
  }
}

function resolveAllowedOrigin(apiKey: ValidatedKey, origin: string | null): string | null {
  if (!apiKey.allowedOrigins || apiKey.allowedOrigins.length === 0) {
    return origin ?? '*'
  }
  if (origin && apiKey.allowedOrigins.includes(origin)) {
    return origin
  }
  return null
}

function withCors(req: NextRequest, apiKey: ValidatedKey, response: NextResponse): NextResponse {
  if (apiKey.keyType === 'public') {
    applyCorsHeaders(req, apiKey, response)
  }
  return response
}
