/**
 * Standardized API v1 response helpers.
 *
 * Every public B2B endpoint returns:
 * {
 *   data: T | null,
 *   error: { message, code, details? } | null,
 *   meta: { requestId, timestamp, rateLimit? }
 * }
 */
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import type { ValidatedKey } from '@/lib/api-keys'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiMeta {
  requestId: string
  timestamp: string
  rateLimit?: {
    limit: number | 'unlimited'
    remaining: number | 'unlimited'
    resetsAt: string
  }
}

export interface ApiSuccessResponse<T> {
  data: T
  error: null
  meta: ApiMeta
}

export interface ApiErrorResponse {
  data: null
  error: {
    message: string
    code: string
    details?: unknown
  }
  meta: ApiMeta
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ---------------------------------------------------------------------------
// Meta builder
// ---------------------------------------------------------------------------

function buildMeta(apiKey?: ValidatedKey | null): ApiMeta {
  const meta: ApiMeta = {
    requestId: randomUUID(),
    timestamp: new Date().toISOString(),
  }

  if (apiKey) {
    const remaining = (apiKey as ValidatedKey & { _rateRemaining?: string })._rateRemaining
    meta.rateLimit = {
      limit: apiKey.rateLimit === -1 ? 'unlimited' : apiKey.rateLimit,
      remaining: remaining === 'unlimited' ? 'unlimited' : Number(remaining ?? 0),
      resetsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    }
  }

  return meta
}

// ---------------------------------------------------------------------------
// Rate limit headers
// ---------------------------------------------------------------------------

function rateLimitHeaders(apiKey?: ValidatedKey | null): Record<string, string> {
  if (!apiKey) return {}
  const remaining = (apiKey as ValidatedKey & { _rateRemaining?: string })._rateRemaining ?? '0'
  return {
    'X-RateLimit-Limit': apiKey.rateLimit === -1 ? 'unlimited' : String(apiKey.rateLimit),
    'X-RateLimit-Remaining': remaining,
    'X-Request-Id': randomUUID(),
  }
}

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------

export function apiSuccess<T>(
  data: T,
  status = 200,
  apiKey?: ValidatedKey | null,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { data, error: null, meta: buildMeta(apiKey) },
    { status, headers: { ...rateLimitHeaders(apiKey), 'Content-Type': 'application/json' } },
  )
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export function apiError(
  message: string,
  code: string,
  status: number,
  apiKey?: ValidatedKey | null,
  details?: unknown,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      data: null,
      error: { message, code, details: details ?? undefined },
      meta: buildMeta(apiKey),
    },
    { status, headers: { ...rateLimitHeaders(apiKey), 'Content-Type': 'application/json' } },
  )
}

// Convenience error factories
export const apiBadRequest = (msg: string, apiKey?: ValidatedKey | null, details?: unknown) =>
  apiError(msg, 'BAD_REQUEST', 400, apiKey, details)

export const apiUnauthorized = (msg = 'Authentication required', code = 'UNAUTHORIZED') =>
  apiError(msg, code, 401)

export const apiForbidden = (msg: string, apiKey?: ValidatedKey | null) =>
  apiError(msg, 'FORBIDDEN', 403, apiKey)

export const apiNotFound = (msg = 'Resource not found', apiKey?: ValidatedKey | null) =>
  apiError(msg, 'NOT_FOUND', 404, apiKey)

export const apiRateLimited = (apiKey: ValidatedKey, used: number) =>
  apiError(
    'Rate limit exceeded',
    'RATE_LIMIT_EXCEEDED',
    429,
    apiKey,
    { limit: apiKey.rateLimit, used, resetsIn: '24h' },
  )

export const apiServerError = (msg = 'Internal server error', apiKey?: ValidatedKey | null) =>
  apiError(msg, 'INTERNAL_ERROR', 500, apiKey)
