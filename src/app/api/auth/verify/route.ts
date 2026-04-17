import { NextResponse } from 'next/server'
import { consumeMagicLink, getOrCreateUserByEmail } from '@/lib/magic-link'
import { createSession, setSessionCookie } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token')
  const redirectParam = url.searchParams.get('redirect') ?? '/account'

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin

  // Open-redirect defence. The previous check was redirectParam.startsWith('/')
  // which is true for `//evil.com` and `/\evil.com` — both of which the
  // browser interprets as protocol-relative URLs and resolves to
  // https://evil.com. A magic-link landing on /api/auth/verify with such
  // a redirect would phish the user into an attacker-controlled session.
  // Strict: must start with a single forward slash, must not start with
  // // or /\, must not contain a protocol or @ (which can be used to
  // construct https://evil.com@trusted.com).
  const isSafeRedirect =
    typeof redirectParam === 'string' &&
    redirectParam.startsWith('/') &&
    !redirectParam.startsWith('//') &&
    !redirectParam.startsWith('/\\') &&
    !redirectParam.includes('@') &&
    !/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(redirectParam)
  const safeRedirect = isSafeRedirect ? redirectParam : '/account'

  if (!token) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_token`)
  }

  const consumed = await consumeMagicLink(token)
  if (!consumed) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_or_expired`)
  }

  const userId = await getOrCreateUserByEmail(consumed.email)
  const sessionToken = await createSession(userId)
  await setSessionCookie(sessionToken)

  return NextResponse.redirect(`${appUrl}${safeRedirect}`)
}
