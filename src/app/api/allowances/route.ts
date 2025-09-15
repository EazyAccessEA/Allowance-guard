// app/api/allowances/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { withReq } from '@/lib/logger'
import { cacheGet, cacheSet } from '@/lib/cache'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const L = withReq(req)
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  const riskOnly = (searchParams.get('riskOnly') || 'false') === 'true'
  const page = Math.max(1, Number(searchParams.get('page') || 1))
  const pageSize = Math.min(100, Math.max(10, Number(searchParams.get('pageSize') || 25)))
  
  L.info('allowances.fetch.start', { wallet, riskOnly, page, pageSize })
  
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    L.warn('allowances.fetch.invalid_wallet', { wallet })
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  // Check cache first
  const cacheKey = `allow:${wallet}:${riskOnly}:${page}:${pageSize}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(cached, { headers: { 'cache-control': 'private, max-age=15' } })
  }

  const offset = (page - 1) * pageSize
  const q = `
    SELECT a.chain_id, a.token_address, a.spender_address, a.standard, a.allowance_type,
           a.amount, a.is_unlimited, a.last_seen_block, a.risk_score, a.risk_flags,
           tm.name AS token_name, tm.symbol AS token_symbol, tm.decimals AS token_decimals,
           sl.label AS spender_label, sl.trust AS spender_trust
    FROM allowances a
    LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
    LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
    WHERE a.wallet_address=$1 ${riskOnly ? 'AND (a.is_unlimited=true OR a.risk_score>0)' : ''}
    ORDER BY a.is_unlimited DESC, a.amount DESC, a.chain_id, a.token_address, a.spender_address
    LIMIT $2 OFFSET $3
  `
  
  try {
    const [{ rows }, countRes] = await Promise.all([
      pool.query(q, [wallet, pageSize, offset]),
      pool.query(`SELECT COUNT(*)::int AS total FROM allowances WHERE wallet_address=$1 ${riskOnly ? 'AND (is_unlimited=true OR risk_score>0)' : ''}`, [wallet])
    ])

    L.info('allowances.fetch.success', { wallet, count: rows.length, total: countRes.rows[0].total })

    const payload = { 
      allowances: rows, 
      page, 
      pageSize, 
      total: countRes.rows[0].total 
    }
    
    // Cache the result for 15 seconds
    await cacheSet(cacheKey, payload, 15)
    
    return NextResponse.json(payload, { headers: { 'cache-control': 'private, max-age=15' } })
  } catch (error) {
    L.error('allowances.fetch.error', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet 
    })
    return NextResponse.json({ error: 'Failed to fetch allowances' }, { status: 500 })
  }
}
