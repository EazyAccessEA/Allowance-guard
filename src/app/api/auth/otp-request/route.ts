import { NextResponse } from 'next/server'
import { z } from 'zod'
import { issueOtp } from '@/lib/otp'
import { sendMail } from '@/lib/mailer'
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
})

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * POST /api/auth/otp-request
 * Body: { email }
 *
 * Issues a 6-digit OTP and emails it. Always returns 200 when the
 * per-email bucket is exhausted so an attacker can't use the response
 * shape to discover valid mailboxes.
 */
export async function POST(req: Request) {
  const ip = getIp(req)

  // Per-IP cap: 20 per 10 min. Generous enough for legit multi-user NATs
  // and for operator smoke testing; the per-email bucket below is the
  // real anti-abuse defence. Upstash failures fail closed (see
  // lib/ratelimit.ts) — if every request 429s, suspect Upstash before
  // blaming the cap.
  const ipRl = await limitHit(`otp-request:ip:${ip}`, 600, 20)
  if (!ipRl.allowed) {
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
      { error: 'Invalid email' },
      { status: 400, headers: NO_STORE },
    )
  }

  const email = parsed.data.email.toLowerCase()

  // Per-email cap: 5 per 15 min. Primary anti-abuse defence (stops
  // attacker spamming one inbox) with headroom for legit typo-retries.
  // Response shape mirrors success so this isn't an enumeration oracle.
  const emailRl = await limitHit(`otp-request:email:${email}`, 900, 5)
  if (!emailRl.allowed) {
    apiLogger.warn('otp.request.email_rate_limited', { email })
    return NextResponse.json({ ok: true }, { headers: NO_STORE })
  }

  try {
    const code = await issueOtp(email)

    if (process.env.E2E_FAKE_EMAIL === 'true' || process.env.E2E_FAKE_EMAIL === '1') {
      apiLogger.info('otp.request.fake_email', { email, code })
    } else {
      const html = `
        <h1 style="font-family:IBM Plex Sans,system-ui,sans-serif;margin:0 0 16px;color:#0f1115;font-size:20px">Your Allowance Guard sign-in code</h1>
        <p style="font-family:IBM Plex Sans,system-ui,sans-serif;color:#0f1115;margin:0 0 24px;font-size:15px">Enter this 6-digit code to finish signing in. It expires in 10 minutes and can only be used once.</p>
        <div style="font-family:JetBrains Mono,Menlo,monospace;font-size:32px;letter-spacing:8px;font-weight:700;background:#EFECE3;color:#0f1115;padding:20px 24px;border-radius:8px;text-align:center;margin:0 0 24px">${code}</div>
        <p style="font-family:IBM Plex Sans,system-ui,sans-serif;color:#555;font-size:13px;margin:0">If you didn't request this, you can safely ignore this email — no one can use the code without it.</p>
      `
      await sendMail(
        email,
        `Your Allowance Guard code is ${code}`,
        html,
        `Your Allowance Guard sign-in code: ${code}\n\nIt expires in 10 minutes.`,
        { kind: 'operational' },
      )
    }
  } catch (e) {
    apiLogger.error('otp.request.failed', {
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json(
      { error: 'Could not send code. Please try again in a moment.' },
      { status: 500, headers: NO_STORE },
    )
  }

  return NextResponse.json({ ok: true }, { headers: NO_STORE })
}
