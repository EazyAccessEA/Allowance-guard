import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function POST(req: Request) {
  const s = await requireUser()
  const { token } = await req.json().catch(() => ({}))
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { rows } = await pool.query(
    `SELECT * FROM team_invites WHERE token=$1 AND accepted_at IS NULL AND expires_at > NOW()`,
    [token]
  )
  const inv = rows[0]
  if (!inv) return NextResponse.json({ error: 'Invalid or expired' }, { status: 400 })

  // add membership (idempotent)
  await pool.query(
    `INSERT INTO team_members (team_id, user_id, role)
     VALUES ($1,$2,$3)
     ON CONFLICT (team_id, user_id) DO UPDATE SET role=LEAST(team_members.role, EXCLUDED.role)`,
    [inv.team_id, s.user_id, inv.role]
  )
  await pool.query(`UPDATE team_invites SET accepted_at=NOW() WHERE id=$1`, [inv.id])
  return NextResponse.json({ ok: true, teamId: inv.team_id, role: inv.role })
}
