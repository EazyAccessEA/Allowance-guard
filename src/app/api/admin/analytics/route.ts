import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { pool } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check admin role
  const { rows: userRows } = await pool.query(
    `SELECT role FROM users WHERE id = $1`,
    [session.user_id],
  )
  if (!userRows[0] || userRows[0].role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    // Funnel data (last 30 days)
    const { rows: funnel } = await pool.query(`
      SELECT
        event_name,
        DATE_TRUNC('day', created_at)::text AS event_day,
        COUNT(*)::int AS event_count,
        COUNT(DISTINCT user_id)::int AS unique_users
      FROM analytics_events
      WHERE created_at > NOW() - INTERVAL '30 days'
      GROUP BY event_name, DATE_TRUNC('day', created_at)
      ORDER BY event_day DESC, event_name
    `)

    // Revenue summary
    const { rows: revenue } = await pool.query(`
      SELECT
        plan,
        status,
        COUNT(*)::int AS subscriber_count,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active_count,
        COUNT(*) FILTER (WHERE status = 'canceled')::int AS cancelled_count,
        COUNT(*) FILTER (WHERE status = 'trialing')::int AS trialing_count,
        COUNT(*) FILTER (WHERE cancelled_at IS NOT NULL
          AND cancelled_at > NOW() - INTERVAL '30 days')::int AS recent_cancellations
      FROM subscriptions
      GROUP BY plan, status
    `)

    return NextResponse.json({ funnel, revenue })
  } catch (err) {
    console.error('[admin/analytics] Error:', err)
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
