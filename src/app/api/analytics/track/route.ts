import { NextRequest, NextResponse } from 'next/server'
import { trackEvent, type AnalyticsEvent } from '@/lib/analytics'
import { getSession } from '@/lib/auth'

const VALID_EVENTS: AnalyticsEvent[] = [
  'wallet_connected',
  'scan_started',
  'scan_completed',
  'revoke_initiated',
  'revoke_completed',
  'upgrade_clicked',
  'checkout_started',
  'checkout_completed',
  'trial_started',
  'trial_converted',
]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, metadata } = body

    if (!event || !VALID_EVENTS.includes(event)) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    const session = await getSession()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
    const ua = req.headers.get('user-agent') ?? null

    await trackEvent(event, {
      userId: session?.user_id ?? null,
      sessionId: session?.session_id?.toString() ?? null,
      metadata,
      ipAddress: ip,
      userAgent: ua,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}
