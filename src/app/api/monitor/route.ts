import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  const { rows } = await pool.query(`SELECT * FROM wallet_monitors WHERE wallet_address=$1`, [wallet])
  return NextResponse.json({ monitor: rows[0] ?? null })
}

export async function POST(req: Request) {
  const { wallet, enabled = true, freq_minutes = 720 } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  await pool.query(`
    INSERT INTO wallet_monitors (wallet_address, enabled, freq_minutes, last_scan_at, updated_at)
    VALUES ($1,$2,$3,NULL,NOW())
    ON CONFLICT (wallet_address) DO UPDATE
      SET enabled=$2, freq_minutes=$3, updated_at=NOW()
  `, [wallet.toLowerCase(), !!enabled, Number(freq_minutes)])
  return NextResponse.json({ ok: true })
}
