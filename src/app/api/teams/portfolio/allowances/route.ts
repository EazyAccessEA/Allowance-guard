import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'

/**
 * GET /api/teams/portfolio/allowances?teamId=123&wallet=0x...
 * Get detailed allowances for a specific team wallet.
 */
export async function GET(req: NextRequest) {
  const s = await requireUser()
  const teamId = Number(req.nextUrl.searchParams.get('teamId') || 0)
  const wallet = req.nextUrl.searchParams.get('wallet')

  if (!teamId || !wallet) {
    return NextResponse.json({ error: 'teamId and wallet required' }, { status: 400 })
  }

  // Verify membership
  const mem = await pool.query(
    `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
    [teamId, s.user_id],
  )
  if (!mem.rows[0]) {
    return NextResponse.json({ error: 'Not a member of this team' }, { status: 403 })
  }

  // Verify wallet belongs to team
  const tw = await pool.query(
    `SELECT 1 FROM team_wallets WHERE team_id = $1 AND wallet_address = $2`,
    [teamId, wallet.toLowerCase()],
  )
  if (tw.rows.length === 0) {
    return NextResponse.json({ error: 'Wallet not found in this team' }, { status: 404 })
  }

  const { rows } = await pool.query(
    `SELECT a.chain_id, a.token_address, a.spender_address, a.standard,
            a.allowance_type, a.amount, a.is_unlimited, a.risk_score, a.risk_flags,
            tm.name AS token_name, tm.symbol AS token_symbol,
            sl.label AS spender_label, sl.trust AS spender_trust
     FROM allowances a
     LEFT JOIN token_metadata tm ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
     LEFT JOIN spender_labels sl ON sl.chain_id = a.chain_id AND sl.address = a.spender_address
     WHERE a.wallet_address = $1
     ORDER BY a.is_unlimited DESC, a.risk_score DESC NULLS LAST
     LIMIT 200`,
    [wallet.toLowerCase()],
  )

  return NextResponse.json({ allowances: rows })
}
