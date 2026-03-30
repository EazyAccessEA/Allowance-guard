import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

/**
 * GET /api/teams/details?teamId=123
 * Get team details with summary stats. Requires membership.
 */
export async function GET(req: NextRequest) {
  const s = await requireUser()
  const teamId = Number(req.nextUrl.searchParams.get('teamId') || 0)
  if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

  // Verify membership and get role
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  if (!mem.rows[0]) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
  }

  const { rows } = await pool.query(
    `SELECT t.id, t.name, t.description, t.settings, t.created_at, t.updated_at,
            $2::text AS role,
            (SELECT COUNT(*)::int FROM team_members tm WHERE tm.team_id = t.id) AS member_count,
            (SELECT COUNT(*)::int FROM team_wallets tw WHERE tw.team_id = t.id) AS wallet_count
     FROM teams t
     WHERE t.id = $1`,
    [teamId, mem.rows[0].role],
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 })
  }

  return NextResponse.json({ team: rows[0] })
}
