import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

/**
 * GET /api/teams/members?teamId=123
 * List team members with role info. Requires membership.
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

  const { rows } = await pool.query(
    `SELECT tm.user_id, u.email, u.name, tm.role, tm.created_at
     FROM team_members tm
     JOIN users u ON u.id = tm.user_id
     WHERE tm.team_id = $1
     ORDER BY
       CASE tm.role
         WHEN 'owner' THEN 1
         WHEN 'admin' THEN 2
         WHEN 'editor' THEN 3
         WHEN 'viewer' THEN 4
         ELSE 5
       END,
       tm.created_at`,
    [teamId],
  )

  return NextResponse.json({ members: rows })
}
