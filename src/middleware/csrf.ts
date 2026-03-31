/**
 * CSRF protection for cookie-based session auth.
 *
 * Generates a per-session CSRF token and validates it on state-changing
 * requests (POST, PUT, DELETE, PATCH) from the browser.
 *
 * Exempt:
 * - API key-authenticated routes (B2B API under /api/v1/)
 * - Webhook receivers (Stripe, Coinbase)
 * - CRON routes (/api/jobs/process, /api/monitor/cron)
 * - Requests without a session cookie (they'll fail auth anyway)
 */
import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const CSRF_COOKIE = 'ag_csrf'
const CSRF_HEADER = 'x-csrf-token'

/** Routes exempt from CSRF validation */
const EXEMPT_PREFIXES = [
  '/api/v1/',           // B2B API (API key auth)
  '/api/stripe/',       // Stripe webhooks
  '/api/coinbase/',     // Coinbase webhooks
  '/api/jobs/process',  // CRON route
  '/api/monitor/cron',  // CRON route
  '/api/healthz',       // Health check
  '/api/alerts/daily',  // Cron-triggered
]

const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH'])

function isExempt(pathname: string): boolean {
  return EXEMPT_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

/**
 * Generate a CSRF token and set it as a cookie.
 * The token is also returned so it can be included in page meta tags.
 */
export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString('hex')
  const c = await cookies()
  c.set(CSRF_COOKIE, token, {
    httpOnly: false, // JS needs to read this to send in headers
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days, matches session
  })
  return token
}

/**
 * Get the existing CSRF token from the cookie, or generate a new one.
 */
export async function getCsrfToken(): Promise<string> {
  const c = await cookies()
  const existing = c.get(CSRF_COOKIE)?.value
  if (existing) return existing
  return generateCsrfToken()
}

/**
 * Validate CSRF token on a state-changing request.
 * Returns null if valid, or a 403 NextResponse if invalid.
 */
export async function validateCsrf(
  method: string,
  pathname: string,
  headers: Headers,
): Promise<NextResponse | null> {
  // Only check state-changing methods
  if (!STATE_CHANGING_METHODS.has(method)) return null

  // Skip exempt routes
  if (isExempt(pathname)) return null

  // Skip if no session cookie (request will fail auth anyway)
  const c = await cookies()
  const sessionCookie = c.get('ag_sess')?.value
  if (!sessionCookie) return null

  const csrfCookie = c.get(CSRF_COOKIE)?.value
  const csrfHeader = headers.get(CSRF_HEADER)

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
  }

  return null
}
