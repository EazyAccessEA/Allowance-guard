import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  const riskOnly = (searchParams.get('riskOnly') || 'false') === 'true'
  const limit = Math.min(200, Math.max(25, Number(searchParams.get('limit') || 50)))

  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  // cursor is a tuple of the last row's sort keys
  // format: isUnlimited,amount,chain,token,spender → "1,9999999999,1,0x...,0x..."
  const cursor = searchParams.get('cursor')
  let cond = ''
  let vals: any[] = [wallet, limit]

  if (cursor) {
    const [isU, amt, chain, tok, sp] = cursor.split(',')
    vals = [wallet, isU === '1', amt, Number(chain), tok, sp, limit]
    cond = `
      AND (is_unlimited, amount, chain_id, token_address, spender_address)
          < ($2, $3::numeric, $4::int, $5::text, $6::text)
    `
  }

  const risky = riskOnly ? `AND (is_unlimited = TRUE OR risk_score > 0 OR 'STALE' = ANY(risk_flags))` : ''
  const q = `
    SELECT chain_id, token_address, spender_address, standard, allowance_type,
           amount, is_unlimited, last_seen_block, risk_score, risk_flags
    FROM allowances
    WHERE wallet_address=$1 ${risky} ${cond}
    ORDER BY is_unlimited DESC, amount DESC, chain_id, token_address, spender_address
    LIMIT ${cursor ? '$7' : '$2'}
  `
  
  try {
    const { rows } = await pool.query(q, vals)

    const nextCursor = rows.length
      ? [
          rows[rows.length - 1].is_unlimited ? '1' : '0',
          rows[rows.length - 1].amount,
          rows[rows.length - 1].chain_id,
          rows[rows.length - 1].token_address,
          rows[rows.length - 1].spender_address,
        ].join(',')
      : null

    return NextResponse.json({ items: rows, nextCursor })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch allowances' }, { status: 500 })
  }
}
