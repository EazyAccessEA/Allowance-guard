import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'

/**
 * GET /api/teams
 * List user's teams with role, member count, wallet count, and summary stats.
 */
export async function GET() {
  const s = await requireUser()
  const { rows } = await pool.query(
    `SELECT t.id, t.name, t.description, t.settings, m.role,
            (SELECT COUNT(*)::int FROM team_members tm WHERE tm.team_id = t.id) AS member_count,
            (SELECT COUNT(*)::int FROM team_wallets tw WHERE tw.team_id = t.id) AS wallet_count,
            t.created_at, t.updated_at
     FROM team_members m JOIN teams t ON t.id = m.team_id
     WHERE m.user_id = $1
     ORDER BY t.created_at DESC`,
    [s.user_id],
  )
  return NextResponse.json({ teams: rows })
}

/**
 * POST /api/teams
 * Create a new team (Sentinel-gated).
 */
export async function POST(req: NextRequest) {
  const s = await requireUser()

  const access = await checkFeature(s.user_id as number, 'teams')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Team features require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const { name, description } = await req.json().catch(() => ({}))
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
  }

  const t = await pool.query(
    `INSERT INTO teams (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id, name, description`,
    [name.trim(), description?.trim() || null, s.user_id],
  )
  await pool.query(
    `INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, 'owner')`,
    [t.rows[0].id, s.user_id],
  )
  // Log team creation activity
  await pool.query(
    `INSERT INTO team_activity (team_id, user_id, action, subject, details)
     VALUES ($1, $2, 'team_created', $3, $4)`,
    [t.rows[0].id, s.user_id, name.trim(), JSON.stringify({ description: description?.trim() || null })],
  )
  return NextResponse.json({ ok: true, team: t.rows[0] }, { status: 201 })
}

/**
 * PUT /api/teams
 * Update team settings (owner/admin only).
 */
export async function PUT(req: NextRequest) {
  const s = await requireUser()

  const body = await req.json().catch(() => ({}))
  const { teamId, name, description, settings } = body

  if (!teamId) {
    return NextResponse.json({ error: 'teamId is required' }, { status: 400 })
  }

  // Check role
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  const role = mem.rows[0]?.role as string | undefined
  if (!role || !['owner', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Only owner or admin can update team settings' }, { status: 403 })
  }

  const updates: string[] = []
  const params: unknown[] = []
  let paramIdx = 1

  if (name !== undefined) {
    updates.push(`name = $${paramIdx}`)
    params.push(name.trim())
    paramIdx++
  }
  if (description !== undefined) {
    updates.push(`description = $${paramIdx}`)
    params.push(description?.trim() || null)
    paramIdx++
  }
  if (settings !== undefined) {
    updates.push(`settings = $${paramIdx}`)
    params.push(JSON.stringify(settings))
    paramIdx++
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  updates.push(`updated_at = NOW()`)
  params.push(teamId)

  await pool.query(
    `UPDATE teams SET ${updates.join(', ')} WHERE id = $${paramIdx}`,
    params,
  )

  // Log activity
  await pool.query(
    `INSERT INTO team_activity (team_id, user_id, action, subject, details)
     VALUES ($1, $2, 'team_updated', $3, $4)`,
    [teamId, s.user_id, name ?? 'settings', JSON.stringify({ name, description, settings })],
  )

  return NextResponse.json({ ok: true })
}
