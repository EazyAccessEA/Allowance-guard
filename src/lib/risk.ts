// lib/risk.ts
import { pool } from './db'
import { clientFor } from './chains'
import { blocksForDuration, SUPPORTED_CHAIN_IDS } from '@/config/chains'
import {
  evaluateSyncFactors,
  evaluateAllFactors,
  aggregateScore,
  type RiskInput,
  type RiskFactor,
} from './risk-factors'

/**
 * Refresh risk scores for all allowances belonging to a wallet.
 *
 * Uses the modular risk-factor system: sync factors are always applied,
 * async factors (on-chain checks) are applied in batches to avoid
 * excessive RPC calls.
 */
export async function refreshRiskForWallet(wallet: string, deep = false) {
  wallet = wallet.toLowerCase()
  const { rows } = await pool.query(
    `SELECT chain_id, token_address, spender_address, allowance_type,
            is_unlimited, last_seen_block, amount
     FROM allowances WHERE wallet_address = $1`, [wallet]
  )

  // group by chain to fetch block tips once
  const chains = [...new Set(rows.map(r => Number(r.chain_id)))] as (1|42161|8453|10|137|43114|56)[]
  const tips: Record<number, bigint> = {}
  for (const id of chains) tips[id] = await clientFor(id).getBlockNumber()

  for (const r of rows) {
    const tip = tips[Number(r.chain_id)]

    const input: RiskInput = {
      chainId: Number(r.chain_id),
      tokenAddress: r.token_address as string,
      spenderAddress: r.spender_address as string,
      amount: r.amount as string,
      isUnlimited: r.is_unlimited as boolean,
      lastSeenBlock: r.last_seen_block as string,
      currentBlock: tip,
    }

    // Use full evaluation for deep scans, sync-only for quick refreshes
    let factors: RiskFactor[]
    if (deep) {
      factors = await evaluateAllFactors(input)
    } else {
      factors = evaluateSyncFactors(input)
    }

    const flags = factors.map(f => f.id.toUpperCase())
    const score = aggregateScore(factors)

    await pool.query(
      `UPDATE allowances
         SET risk_flags = $6, risk_score = $7, updated_at = NOW()
       WHERE wallet_address = $1 AND chain_id = $2
         AND token_address = $3 AND spender_address = $4 AND allowance_type = $5`,
      [wallet, r.chain_id, r.token_address, r.spender_address, r.allowance_type, flags, score]
    )
  }
}
