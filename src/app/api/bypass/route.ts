import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

/**
 * GET /api/bypass?key=<MAINTENANCE_BYPASS_SECRET>
 *
 * Sets the `ag_bypass` cookie so the visitor can access gated pages.
 * Redirects to `/` after setting the cookie.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  const secret = process.env.MAINTENANCE_BYPASS_SECRET

  if (!secret || key !== secret) {
    return NextResponse.json({ error: 'Invalid key.' }, { status: 403 })
  }

  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set('ag_bypass', secret, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 90, // 90 days
    path: '/',
  })

  return res
}
