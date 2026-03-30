import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { auditUser } from '@/lib/audit'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  const { rows } = await pool.query(`SELECT * FROM alert_policies WHERE wallet_address=$1`, [wallet])
  return NextResponse.json({ policy: rows[0] || null })
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const wallet = (body.wallet || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })

  const q = `
    INSERT INTO alert_policies (wallet_address, min_risk_score, unlimited_only, include_spenders, ignore_spenders, include_tokens, ignore_tokens, chains, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())
    ON CONFLICT (wallet_address) DO UPDATE
      SET min_risk_score=$2, unlimited_only=$3, include_spenders=$4, ignore_spenders=$5,
          include_tokens=$6, ignore_tokens=$7, chains=$8, updated_at=NOW()
  `
  const vals = [
    wallet,
    Number(body.min_risk_score || 0),
    !!body.unlimited_only,
    (body.include_spenders || []).map((x: string)=>x.toLowerCase()),
    (body.ignore_spenders  || []).map((x: string)=>x.toLowerCase()),
    (body.include_tokens   || []).map((x: string)=>x.toLowerCase()),
    (body.ignore_tokens    || []).map((x: string)=>x.toLowerCase()),
    (body.chains || []).map((n: number)=>Number(n))
  ]
  await pool.query(q, vals)
  
  // Audit the policy update
  await auditUser('policy.update', null, wallet, {
    min_risk_score: body.min_risk_score,
    unlimited_only: body.unlimited_only
  }, req.headers.get('x-forwarded-for') || null, '/api/policy')
  
  return NextResponse.json({ ok: true })
}
