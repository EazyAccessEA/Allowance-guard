import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  const riskOnly = (searchParams.get('riskOnly') || 'false') === 'true'
  
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const q = `
    SELECT a.chain_id, a.token_address, a.spender_address, a.standard, a.allowance_type,
           a.amount, a.is_unlimited, a.last_seen_block, a.risk_score, a.risk_flags,
           tm.name AS token_name, tm.symbol AS token_symbol, tm.decimals AS token_decimals,
           sl.label AS spender_label, sl.trust AS spender_trust
    FROM allowances a
    LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
    LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
    WHERE a.wallet_address=$1 ${riskOnly ? 'AND (a.is_unlimited=true OR a.risk_score>0 OR \'STALE\' = ANY(a.risk_flags))' : ''}
    ORDER BY a.is_unlimited DESC, a.amount DESC, a.chain_id, a.token_address, a.spender_address
    LIMIT 5000
  `
  
  const { rows } = await pool.query(q, [wallet])

  const header = [
    'wallet','chain_id','token_address','token_symbol','token_name','spender_address','spender_label',
    'standard','allowance_type','amount_raw','is_unlimited','risk_score','risk_flags','last_seen_block'
  ]
  
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  
  const csv = [
    header.join(','),
    ...rows.map((r: Record<string, unknown>) =>
      [
        wallet, r.chain_id, r.token_address, r.token_symbol || '', r.token_name || '',
        r.spender_address, r.spender_label || '',
        r.standard, r.allowance_type, r.amount, r.is_unlimited ? 'true' : 'false',
        r.risk_score ?? 0, (r.risk_flags || []).join('|'), r.last_seen_block
      ].map(esc).join(',')
    )
  ].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="allowances_${wallet}.csv"`
    }
  })
}
