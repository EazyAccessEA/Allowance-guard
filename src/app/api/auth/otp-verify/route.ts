import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyOtp } from '@/lib/otp'
import { getOrCreateUserByEmail } from '@/lib/magic-link'
import { createSession, setSessionCookie } from '@/lib/auth'
import { limitHit } from '@/lib/ratelimit'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
} as const

const schema = z.object({
  email: z.string().email().max(254),
  code: z.string().regex(/^\d{6}$/),
})

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * POST /api/auth/otp-verify
 * Body: { email, code }
 *
 * Verifies a 6-digit code. On success: find-or-create user by email,
 * issue a session cookie. All failure shapes return the same generic
 * error so the response isn't an oracle for "which code was right".
 */
export async function POST(req: Request) {
  const ip = getIp(req)

  // 30 per 15 min per IP. Generous for typo-retries; brute force is
  // already blocked by the per-code 5-attempt lock inside verifyOtp.
  const rl = await limitHit(`otp-verify:${ip}`, 900, 30)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: NO_STORE },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400, headers: NO_STORE },
    )
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400, headers: NO_STORE },
    )
  }

  const { email, code } = parsed.data

  const result = await verifyOtp(email, code)
  if (!result.ok) {
    apiLogger.info('otp.verify.failed', { email, reason: result.error })
    return NextResponse.json(
      { error: 'The code is incorrect or has expired. Request a new one.' },
      { status: 401, headers: NO_STORE },
    )
  }

  const userId = await getOrCreateUserByEmail(result.email)
  const sessionToken = await createSession(userId)
  await setSessionCookie(sessionToken)

  apiLogger.info('otp.verify.ok', { userId })
  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}
