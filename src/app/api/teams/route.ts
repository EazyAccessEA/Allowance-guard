import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const s = await requireUser()
  const { rows } = await pool.query(
    `SELECT t.id, t.name, m.role
       FROM team_members m JOIN teams t ON t.id=m.team_id
      WHERE m.user_id=$1 ORDER BY t.created_at DESC`, [s.user_id]
  )
  return NextResponse.json({ teams: rows })
}

export async function POST(req: Request) {
  const s = await requireUser()
  const { name } = await req.json().catch(() => ({}))
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const t = await client.query(
      `INSERT INTO teams (name, owner_id) VALUES ($1,$2) RETURNING id, name`,
      [name, s.user_id]
    )
    await client.query(
      `INSERT INTO team_members (team_id, user_id, role) VALUES ($1,$2,'owner')`,
      [t.rows[0].id, s.user_id]
    )
    await client.query('COMMIT')
    return NextResponse.json({ ok: true, team: t.rows[0] })
  } catch (e) {
    await client.query('ROLLBACK'); throw e
  } finally {
    client.release()
  }
}
