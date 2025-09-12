import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function GET(req: Request) {
  const s = await requireUser()
  const { searchParams } = new URL(req.url)
  const teamId = Number(searchParams.get('teamId') || 0)
  if (!teamId) return NextResponse.json({ error: 'teamId required' }, { status: 400 })
  // must be member
  const mem = await pool.query(`SELECT role FROM team_members WHERE team_id=$1 AND user_id=$2`, [teamId, s.user_id])
  if (!mem.rows[0]) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { rows } = await pool.query(`SELECT wallet_address FROM team_wallets WHERE team_id=$1 ORDER BY created_at DESC`, [teamId])
  return NextResponse.json({ wallets: rows })
}

export async function POST(req: Request) {
  const s = await requireUser()
  const { teamId, wallet } = await req.json().catch(() => ({}))
  if (!teamId || !wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Bad input' }, { status: 400 })
  // only editor+ can add
  const mem = await pool.query(`SELECT role FROM team_members WHERE team_id=$1 AND user_id=$2`, [teamId, s.user_id])
  const role = mem.rows[0]?.role as string | undefined
  if (!role || !['owner','admin','editor'].includes(role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await pool.query(`INSERT INTO team_wallets (team_id, wallet_address) VALUES ($1,$2) ON CONFLICT DO NOTHING`, [teamId, wallet.toLowerCase()])
  return NextResponse.json({ ok: true })
}
