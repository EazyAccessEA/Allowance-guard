import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { createPortalSession } from '@/lib/billing'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * POST /api/billing/portal
 *
 * Creates a Stripe Customer Portal session and returns the URL.
 * User must have an active paid subscription.
 */
export async function POST(req: Request) {
  const L = withReq(req)

  try {
    const session = await requireUser()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.allowanceguard.com'

    const portalUrl = await createPortalSession(
      session.user_id as number,
      `${appUrl}/account`,
    )

    L.info('billing.portal.created', { userId: session.user_id })

    return NextResponse.json({ ok: true, url: portalUrl })
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHENTICATED') {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    if (error instanceof Error && error.message === 'NO_ACTIVE_SUBSCRIPTION') {
      return NextResponse.json(
        { error: 'No active subscription. Subscribe first at /pricing.', code: 'NO_SUBSCRIPTION' },
        { status: 404 },
      )
    }
    L.error('billing.portal.failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    })
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
