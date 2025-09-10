// lib/db.ts
import { Pool } from 'pg'

export const pool = new Pool({ connectionString: process.env.DATABASE_URL })

// Export db as an alias for pool for compatibility
export const db = pool

export async function upsertAllowance(a: {
  wallet: string, chainId: number, token: string, spender: string,
  standard: 'ERC20'|'ERC721'|'ERC1155',
  allowanceType: 'per-token'|'all-assets',
  amount: bigint, isUnlimited: boolean, lastSeenBlock: bigint
}) {
  const q = `
    INSERT INTO allowances (
      wallet_address, chain_id, token_address, spender_address,
      standard, allowance_type, amount, is_unlimited, last_seen_block, updated_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
    ON CONFLICT (wallet_address, chain_id, token_address, spender_address, allowance_type)
    DO UPDATE SET amount=EXCLUDED.amount, is_unlimited=EXCLUDED.is_unlimited,
                  last_seen_block=EXCLUDED.last_seen_block, updated_at=NOW()
  `
  const vals = [
    a.wallet, a.chainId, a.token, a.spender, a.standard, a.allowanceType,
    a.amount.toString(), a.isUnlimited, a.lastSeenBlock.toString()
  ]
  await pool.query(q, vals)
}

export async function listAllowances(wallet: string, riskOnly = false) {
  const q = `
    SELECT chain_id, token_address, spender_address, standard, allowance_type,
           amount, is_unlimited, last_seen_block, risk_score, risk_flags
    FROM allowances
    WHERE wallet_address = $1 ${riskOnly ? 'AND (is_unlimited = true OR risk_score > 0)' : ''}
    ORDER BY is_unlimited DESC, amount DESC
    LIMIT 200
  `
  const { rows } = await pool.query(q, [wallet.toLowerCase()])
  return rows
}
