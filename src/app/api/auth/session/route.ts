import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
} as const

/**
 * GET /api/auth/session
 *
 * Lightweight probe used by the header / account page to decide
 * whether to render the Sign Out button. Returns the minimum the
 * UI needs (authenticated flag, optional email) and never the
 * session token, user id, or any wallet / subscription detail.
 */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ authenticated: false }, { headers: NO_STORE })
  }
  return NextResponse.json(
    {
      authenticated: true,
      email: (session.email as string | null) ?? null,
    },
    { headers: NO_STORE },
  )
}
