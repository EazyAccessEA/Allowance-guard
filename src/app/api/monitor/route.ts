import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })

  // Scope query to authenticated user's monitors
  const { rows } = await pool.query(
    `SELECT * FROM wallet_monitors WHERE wallet_address=$1 AND user_id=$2`,
    [wallet, session.user_id]
  )
  return NextResponse.json({ monitor: rows[0] ?? null })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { wallet, enabled = true, freq_minutes = 720 } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  await pool.query(`
    INSERT INTO wallet_monitors (wallet_address, user_id, enabled, freq_minutes, last_scan_at, updated_at)
    VALUES ($1,$2,$3,$4,NULL,NOW())
    ON CONFLICT (wallet_address) DO UPDATE
      SET enabled=$3, freq_minutes=$4, updated_at=NOW()
      WHERE wallet_monitors.user_id=$2
  `, [wallet.toLowerCase(), session.user_id, !!enabled, Number(freq_minutes)])
  return NextResponse.json({ ok: true })
}
