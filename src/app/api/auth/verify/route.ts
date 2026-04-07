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
  const safeRedirect = redirectParam.startsWith('/') ? redirectParam : '/account'

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
