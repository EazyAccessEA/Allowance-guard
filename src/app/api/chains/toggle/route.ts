import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { chainId, enabled } = await req.json().catch(()=>({}))
  if (![1,42161,8453].includes(chainId)) return NextResponse.json({ error:'bad chainId' }, { status:400 })
  await pool.query(
    `INSERT INTO chain_settings (chain_id, enabled) VALUES ($1,$2)
     ON CONFLICT (chain_id) DO UPDATE SET enabled=$2, updated_at=NOW()`,
    [chainId, !!enabled]
  )
  return NextResponse.json({ ok:true })
}
