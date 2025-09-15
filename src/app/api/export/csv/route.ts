import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import QueryStream from 'pg-query-stream'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  const riskOnly = (searchParams.get('riskOnly') || 'false') === 'true'
  
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    const risky = riskOnly ? `AND (a.is_unlimited=true OR a.risk_score>0 OR 'STALE' = ANY(a.risk_flags))` : ''
    const sql = `
      SELECT
        $1::text AS wallet,
        a.chain_id, a.token_address, COALESCE(tm.symbol,'') as token_symbol,
        COALESCE(tm.name,'') as token_name,
        a.spender_address, COALESCE(sl.label,'') as spender_label,
        a.standard, a.allowance_type, a.amount, a.is_unlimited,
        COALESCE(a.risk_score,0) as risk_score, a.risk_flags, a.last_seen_block
      FROM allowances a
      LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
      LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
      WHERE a.wallet_address=$1 ${risky}
      ORDER BY a.is_unlimited DESC, a.amount DESC, a.chain_id, a.token_address, a.spender_address
    `
    const stream = client.query(new QueryStream(sql, [wallet]))
    const header = 'wallet,chain_id,token_address,token_symbol,token_name,spender_address,spender_label,standard,allowance_type,amount_raw,is_unlimited,risk_score,risk_flags,last_seen_block\n'

    // Convert object rows to CSV on the fly
    const { Readable } = await import('stream')
    
    const combined = Readable.from((async function* () {
      yield header
      for await (const row of stream as any as AsyncIterable<any>) {
        const esc = (v: any) => {
          const s = v == null ? '' : String(v)
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }
        yield [
          wallet, row.chain_id, row.token_address, row.token_symbol || '', row.token_name || '',
          row.spender_address, row.spender_label || '', row.standard, row.allowance_type,
          row.amount, row.is_unlimited ? 'true' : 'false', row.risk_score ?? 0,
          (row.risk_flags || []).join('|'), row.last_seen_block
        ].map(esc).join(',') + '\n'
      }
    })())

    return new NextResponse(combined as any, {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': `attachment; filename="allowances_${wallet}.csv"`,
        'cache-control': 'no-store'
      }
    })
  } finally {
    client.release()
  }
}