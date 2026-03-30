import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

/**
 * GET /api/teams/activity?teamId=123&limit=25&offset=0
 * Get team activity log with pagination.
 */
export async function GET(req: NextRequest) {
  const s = await requireUser()
  const teamId = Number(req.nextUrl.searchParams.get('teamId') || 0)
  const limit = Math.min(Number(req.nextUrl.searchParams.get('limit') || 25), 100)
  const offset = Number(req.nextUrl.searchParams.get('offset') || 0)

  if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })

  // Verify membership
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  if (!mem.rows[0]) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
  }

  const [{ rows: activities }, { rows: countRows }] = await Promise.all([
    pool.query(
      `SELECT ta.id, ta.team_id, ta.user_id, ta.action, ta.subject, ta.details,
              ta.ip_address, ta.created_at,
              u.email AS user_email, u.name AS user_name
       FROM team_activity ta
       LEFT JOIN users u ON u.id = ta.user_id
       WHERE ta.team_id = $1
       ORDER BY ta.created_at DESC
       LIMIT $2 OFFSET $3`,
      [teamId, limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS count FROM team_activity WHERE team_id = $1`,
      [teamId],
    ),
  ])

  return NextResponse.json({
    activities,
    total: (countRows[0]?.count as number) ?? 0,
  })
}

/**
 * POST /api/teams/activity
 * Log a team activity entry (internal use by other API routes).
 */
export async function POST(req: NextRequest) {
  const s = await requireUser()
  const body = await req.json().catch(() => ({}))
  const { teamId, action, subject, details } = body

  if (!teamId || !action) {
    return NextResponse.json({ error: 'teamId and action required' }, { status: 400 })
  }

  // Verify membership
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  if (!mem.rows[0]) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null

  await pool.query(
    `INSERT INTO team_activity (team_id, user_id, action, subject, details, ip_address)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [teamId, s.user_id, action, subject ?? null, JSON.stringify(details ?? {}), ip],
  )

  return NextResponse.json({ ok: true })
}
