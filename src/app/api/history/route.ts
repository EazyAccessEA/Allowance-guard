import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

/**
 * GET /api/history?wallet=0x...&type=all&limit=50&offset=0&from=&to=
 *
 * Returns historical wallet events for the Time Machine timeline.
 * Requires Pro or Sentinel plan (gated at the UI level + middleware).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') ?? '').toLowerCase()
  const eventType = searchParams.get('type') ?? 'all'
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50')))
  const offset = Math.max(0, parseInt(searchParams.get('offset') ?? '0'))
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  // Build query
  const conditions: string[] = ['wallet_address = $1']
  const params: unknown[] = [wallet]
  let paramIdx = 2

  if (eventType !== 'all') {
    conditions.push(`event_type = $${paramIdx}`)
    params.push(eventType)
    paramIdx++
  }

  if (from) {
    conditions.push(`created_at >= $${paramIdx}`)
    params.push(from)
    paramIdx++
  }

  if (to) {
    conditions.push(`created_at <= $${paramIdx}`)
    params.push(to)
    paramIdx++
  }

  const where = conditions.join(' AND ')

  const [{ rows: events }, { rows: countRows }] = await Promise.all([
    pool.query(
      `SELECT * FROM wallet_events
       WHERE ${where}
       ORDER BY created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS count FROM wallet_events WHERE ${where}`,
      params,
    ),
  ])

  return NextResponse.json({
    events,
    total: (countRows[0]?.count as number) ?? 0,
    page: Math.floor(offset / limit) + 1,
    pageSize: limit,
  })
}

// Risk snapshots are served at /api/history/risk/route.ts
