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
    SELECT a.chain_id, a.token_address, a.spender_address, a.standard, a.allowance_type,
           a.amount, a.is_unlimited, a.last_seen_block, a.risk_score, a.risk_flags,
           tm.name AS token_name, tm.symbol AS token_symbol, tm.decimals AS token_decimals,
           sl.label AS spender_label, sl.trust AS spender_trust
    FROM allowances a
    LEFT JOIN token_metadata tm
      ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
    LEFT JOIN spender_labels sl
      ON sl.chain_id = a.chain_id AND sl.address = a.spender_address
    WHERE a.wallet_address = $1 ${riskOnly ? 'AND (a.is_unlimited = true OR a.risk_score > 0)' : ''}
    ORDER BY a.is_unlimited DESC, a.amount DESC
    LIMIT 200
  `
  const { rows } = await pool.query(q, [wallet.toLowerCase()])
  return rows
}
