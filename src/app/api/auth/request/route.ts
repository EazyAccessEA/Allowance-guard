/**
 * @deprecated Magic-link login flow replaced by SIWE.
 * New clients should POST /api/auth/siwe after signing an EIP-4361
 * message. This endpoint remains so existing magic-link URLs in
 * transit don't 404, but new logins from /login use the SIWE flow.
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createMagicLink } from '@/lib/magic-link'
import { sendMail } from '@/lib/mailer'
import { limitHit } from '@/lib/ratelimit'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  email: z.string().email(),
  redirect: z.string().optional(),
})

function getIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const ip = getIp(req)
  const rl = await limitHit(`auth-request:${ip}`, 300, 5)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { email, redirect } = parsed.data
  const token = await createMagicLink(email)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'
  const qs = new URLSearchParams({ token })
  if (redirect) qs.set('redirect', redirect)
  const link = `${appUrl}/api/auth/verify?${qs.toString()}`

  const html = `
    <p>Click the link below to sign in to AllowanceGuard. This link expires in 15 minutes and can only be used once.</p>
    <p><a href="${link}" style="display:inline-block;background:#0f172a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Sign in to AllowanceGuard</a></p>
    <p style="color:#64748b;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
    <p style="color:#64748b;font-size:12px">Or copy this URL: ${link}</p>
  `

  try {
    if (process.env.E2E_FAKE_EMAIL === 'true') {
      apiLogger.info('auth.magic_link.fake_email', { email, link })
    } else {
      await sendMail(email, 'Sign in to AllowanceGuard', html, undefined, {
        kind: 'operational',
      })
    }
  } catch (e) {
    apiLogger.error('auth.magic_link.send_failed', {
      error: e instanceof Error ? e.message : 'unknown',
    })
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
