/**
 * Admin Analytics API — Phase 8.3
 *
 * Returns analytics data for the admin dashboard.
 * Requires admin authentication.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getFunnelSummary, getRevenueMetrics, getApiUsageByTier } from '@/lib/analytics'
import { pool } from '@/lib/db'

async function isAdmin(userId: number): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT role FROM users WHERE id = $1`,
    [userId],
  )
  return rows[0]?.role === 'admin'
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!(await isAdmin(Number(session.user_id)))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const url = new URL(req.url)
  const days = Math.min(Number(url.searchParams.get('days') || 30), 365)

  try {
    const [funnel, revenue, apiUsage] = await Promise.all([
      getFunnelSummary(days),
      getRevenueMetrics(),
      getApiUsageByTier(days),
    ])

    // Top features by usage
    const { rows: featureUsage } = await pool.query(
      `SELECT event_name, COUNT(*) AS count
       FROM analytics_events
       WHERE event_category = 'feature'
         AND created_at > NOW() - INTERVAL '1 day' * $1
       GROUP BY event_name
       ORDER BY count DESC
       LIMIT 10`,
      [days],
    )

    return NextResponse.json({
      period: { days },
      funnel,
      revenue,
      apiUsage,
      topFeatures: featureUsage.map((r) => ({
        feature: String(r.event_name),
        count: Number(r.count),
      })),
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }
}
