import { NextRequest, NextResponse } from 'next/server'
import { getMonitorEvents, acknowledgeEvent } from '@/lib/monitoring'

/**
 * GET /api/monitor/events?wallet=0x...&limit=20&offset=0
 * Returns monitoring events for a wallet.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') ?? '').toLowerCase()
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0'))

  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const result = await getMonitorEvents(wallet, limit, offset)
  return NextResponse.json(result)
}

/**
 * POST /api/monitor/events
 * Actions: acknowledge an event.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { action, eventId } = body

  if (action === 'acknowledge' && typeof eventId === 'string') {
    await acknowledgeEvent(eventId)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
