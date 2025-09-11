import { randomBytes } from 'crypto'
import { pool } from '@/lib/db'
import { maskAddress } from './mask'

export type ShareRow = {
  token: string
  wallet_address: string
  censor_addresses: boolean
  censor_amounts: boolean
  risk_only: boolean
  expires_at: string | null
}

export function genToken(len = 32) {
  return randomBytes(len).toString('hex') // 64 chars
}

export async function createOrRotateShare(opts: {
  wallet: string
  censor_addresses?: boolean
  censor_amounts?: boolean
  risk_only?: boolean
  expires_in_days?: number | null
}) {
  const token = genToken()
  const expires_at = opts.expires_in_days
    ? new Date(Date.now() + opts.expires_in_days * 24 * 60 * 60 * 1000)
    : null

  const q = `
    INSERT INTO shared_reports (token, wallet_address, censor_addresses, censor_amounts, risk_only, expires_at)
    VALUES ($1,$2,COALESCE($3,TRUE),COALESCE($4,FALSE),COALESCE($5,TRUE),$6)
    ON CONFLICT (wallet_address) DO UPDATE SET
      token = EXCLUDED.token,
      censor_addresses = EXCLUDED.censor_addresses,
      censor_amounts   = EXCLUDED.censor_amounts,
      risk_only        = EXCLUDED.risk_only,
      expires_at       = EXCLUDED.expires_at,
      last_view_at     = NULL,
      view_count       = 0
    RETURNING token
  `
  const vals = [token, opts.wallet.toLowerCase(), opts.censor_addresses, opts.censor_amounts, opts.risk_only, expires_at]
  const { rows } = await pool.query(q, vals)
  return rows[0].token as string
}

export async function expireShare(wallet: string) {
  await pool.query(`DELETE FROM shared_reports WHERE wallet_address=$1`, [wallet.toLowerCase()])
}

export async function getShareByToken(token: string): Promise<ShareRow | null> {
  const { rows } = await pool.query(
    `SELECT token, wallet_address, censor_addresses, censor_amounts, risk_only, expires_at
       FROM shared_reports WHERE token=$1`,
    [token]
  )
  return rows[0] || null
}

export function transformRowsForShare(rows: any[], opts: { maskAddrs: boolean; hideAmounts: boolean }) {
  return rows.map(r => ({
    chain_id: r.chain_id,
    token_address: opts.maskAddrs ? maskAddress(r.token_address) : r.token_address,
    spender_address: opts.maskAddrs ? maskAddress(r.spender_address) : r.spender_address,
    standard: r.standard,
    allowance_type: r.allowance_type,
    amount: opts.hideAmounts ? 'hidden' : r.amount,
    is_unlimited: r.is_unlimited,
    badges: [
      r.is_unlimited ? 'UNLIMITED' : null,
      (r.risk_flags || []).includes('STALE') ? 'STALE' : null
    ].filter(Boolean)
  }))
}

export async function bumpView(token: string) {
  await pool.query(
    `UPDATE shared_reports SET view_count=view_count+1, last_view_at=NOW() WHERE token=$1`,
    [token]
  )
}
