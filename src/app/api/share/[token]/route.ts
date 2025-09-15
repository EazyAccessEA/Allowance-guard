import { NextResponse } from 'next/server'
import { getShareByToken, transformRowsForShare, bumpView } from '@/lib/share'
import { pool } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const share = await getShareByToken(token)
  if (!share) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (share.expires_at && new Date(share.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Link expired' }, { status: 410 })
  }

  // pull latest allowances
  const baseSql = `
    SELECT chain_id, token_address, spender_address, standard, allowance_type,
           amount, is_unlimited, risk_flags
    FROM allowances WHERE wallet_address=$1
  `
  const sql = share.risk_only
    ? baseSql + ` AND (is_unlimited = true OR risk_score > 0 OR ARRAY['STALE']::text[] && risk_flags)
                  ORDER BY is_unlimited DESC, amount::numeric DESC LIMIT 500`
    : baseSql + ` ORDER BY is_unlimited DESC, amount::numeric DESC LIMIT 500`

  const { rows } = await pool.query(sql, [share.wallet_address.toLowerCase()])
  const data = transformRowsForShare(rows, {
    maskAddrs: !!share.censor_addresses,
    hideAmounts: !!share.censor_amounts
  })

  await bumpView(token)

  return NextResponse.json({
    ok: true,
    wallet: share.censor_addresses ? share.wallet_address.slice(0, 10) + '…' : share.wallet_address,
    risk_only: share.risk_only,
    expires_at: share.expires_at,
    items: data
  }, { headers: { 'cache-control': 'public, max-age=60' } })
}
