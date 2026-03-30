import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST() {
  if (process.env.NEXT_PUBLIC_E2E !== '1') {
    return NextResponse.json({ error: 'disabled' }, { status: 403 })
  }
  const wallet = '0x1111111111111111111111111111111111111111'
  await pool.query(`DELETE FROM allowances WHERE wallet_address=$1`, [wallet])
  await pool.query(`
    INSERT INTO allowances (wallet_address, chain_id, token_address, spender_address, standard, allowance_type, amount, is_unlimited, risk_score, risk_flags, last_seen_block)
    VALUES
    ($1,1,'0xTokenA','0xSpenderA','erc20','per-token','0',true,10,ARRAY['STALE'], 12345678),
    ($1,1,'0xTokenB','0xSpenderB','erc20','per-token','500000000000000000',false,0,ARRAY[]::text[], 12345679),
    ($1,8453,'0xTokenC','0xSpenderC','erc20','per-token','1000000000000000000',false,1,ARRAY[]::text[], 12345680)
  `, [wallet])
  return NextResponse.json({ ok: true, wallet })
}
