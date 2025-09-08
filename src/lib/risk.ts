// lib/risk.ts
import { pool } from './db'
import { clientFor } from './chains'

const STALE_BLOCKS: Record<number, bigint> = {
  1: BigInt(650_000),     // ~90 days on mainnet (~12s blocks)
  42161: BigInt(900_000), // approx for Arbitrum
  8453: BigInt(900_000)   // approx for Base
}

export async function refreshRiskForWallet(wallet: string) {
  wallet = wallet.toLowerCase()
  const { rows } = await pool.query(
    `SELECT chain_id, token_address, spender_address, allowance_type,
            is_unlimited, last_seen_block, amount
     FROM allowances WHERE wallet_address = $1`, [wallet]
  )

  // group by chain to fetch tips once
  const chains = [...new Set(rows.map(r => Number(r.chain_id)))] as (1|42161|8453)[]
  const tips: Record<number, bigint> = {}
  for (const id of chains) tips[id] = await clientFor(id).getBlockNumber()

  for (const r of rows) {
    const tip = tips[Number(r.chain_id)]
    const stale = tip - BigInt(r.last_seen_block) > (STALE_BLOCKS[Number(r.chain_id)] ?? BigInt(650_000))
    const flags: string[] = []
    let score = 0
    if (r.is_unlimited) { flags.push('UNLIMITED'); score += 50 }
    if (stale && BigInt(r.amount) > BigInt(0)) { flags.push('STALE'); score += 10 }
    await pool.query(
      `UPDATE allowances
         SET risk_flags = $7, risk_score = $8, updated_at = NOW()
       WHERE wallet_address = $1 AND chain_id = $2
         AND token_address = $3 AND spender_address = $4 AND allowance_type = $5`,
      [wallet, r.chain_id, r.token_address, r.spender_address, r.allowance_type, r.amount, flags, score]
    )
  }
}
