import { NextResponse } from 'next/server'
import { getCsrfToken } from '@/middleware/csrf'

/**
 * GET /api/csrf — returns a CSRF token for the current session.
 * The token is also set as a cookie (`ag_csrf`) so the client
 * can read it and include it in the `X-CSRF-Token` header.
 */
export async function GET() {
  const token = await getCsrfToken()
  return NextResponse.json({ csrfToken: token })
}
