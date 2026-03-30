import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

/**
 * GET /api/teams/portfolio?teamId=123
 * Get multi-wallet portfolio overview for a team.
 * Returns summary stats per wallet across all chains.
 */
export async function GET(req: NextRequest) {
  const s = await requireUser()
  const teamId = Number(req.nextUrl.searchParams.get('teamId') || 0)
  if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

  // Verify membership
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  if (!mem.rows[0]) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
  }

  // Get all team wallets with aggregated stats
  const { rows } = await pool.query(
    `SELECT
       tw.wallet_address,
       COALESCE(stats.total_allowances, 0) AS total_allowances,
       COALESCE(stats.unlimited_count, 0) AS unlimited_count,
       COALESCE(stats.high_risk_count, 0) AS high_risk_count,
       COALESCE(stats.avg_risk, 0) AS risk_score,
       COALESCE(stats.chains, '[]'::jsonb) AS chains,
       stats.last_scan
     FROM team_wallets tw
     LEFT JOIN LATERAL (
       SELECT
         COUNT(*)::int AS total_allowances,
         COUNT(*) FILTER (WHERE a.is_unlimited = true)::int AS unlimited_count,
         COUNT(*) FILTER (WHERE a.risk_score > 50)::int AS high_risk_count,
         COALESCE(AVG(a.risk_score), 0)::int AS avg_risk,
         jsonb_agg(DISTINCT a.chain_id) AS chains,
         MAX(a.updated_at) AS last_scan
       FROM allowances a
       WHERE a.wallet_address = tw.wallet_address
     ) stats ON true
     WHERE tw.team_id = $1
     ORDER BY stats.avg_risk DESC NULLS LAST`,
    [teamId],
  )

  return NextResponse.json({ wallets: rows })
}
