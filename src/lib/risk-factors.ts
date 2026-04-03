// src/lib/risk-factors.ts — Modular risk factor evaluators
//
// Each factor is independently evaluated and contributes to the aggregate
// risk score for a given allowance. Factors are displayed to users in the
// UI as a breakdown (tooltip / expandable section).

import { type Address, getAddress } from 'viem'
import { clientFor } from './chains'
import { pool } from './db'
import { blocksForDuration } from '@/config/chains'

/** Individual risk factor result */
export type RiskFactor = {
  id: string
  label: string
  description: string
  score: number
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical'
}

/** Input for risk evaluation */
export type RiskInput = {
  chainId: number
  tokenAddress: string
  spenderAddress: string
  amount: string
  isUnlimited: boolean
  lastSeenBlock: string
  currentBlock: bigint
  /** Optional: Permit2-related fields */
  permit2Expiration?: number
  permit2Amount?: bigint
}

// ---------------------------------------------------------------------------
// Factor 1: Unlimited Approval (existing)
// ---------------------------------------------------------------------------
export function factorUnlimited(input: RiskInput): RiskFactor | null {
  if (!input.isUnlimited) return null
  return {
    id: 'unlimited',
    label: 'Unlimited Approval',
    description: 'This approval allows the spender to transfer an unlimited amount of tokens.',
    score: 50,
    severity: 'high',
  }
}

// ---------------------------------------------------------------------------
// Factor 2: Stale Approval (existing, improved)
// ---------------------------------------------------------------------------
const NINETY_DAYS_SEC = 90 * 24 * 60 * 60

export function factorStale(input: RiskInput): RiskFactor | null {
  const staleThreshold = blocksForDuration(input.chainId, NINETY_DAYS_SEC)
  if (staleThreshold === BigInt(0)) return null

  const blockAge = input.currentBlock - BigInt(input.lastSeenBlock)
  if (blockAge <= staleThreshold) return null
  if (BigInt(input.amount) === BigInt(0)) return null

  return {
    id: 'stale',
    label: 'Stale Approval',
    description: 'This approval has not been used in over 90 days but still grants access.',
    score: 10,
    severity: 'low',
  }
}

// ---------------------------------------------------------------------------
// Factor 3: Spender is EOA (not a contract)
// ---------------------------------------------------------------------------
export async function factorSpenderIsEOA(input: RiskInput): Promise<RiskFactor | null> {
  try {
    const client = clientFor(input.chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56 | 250 | 324 | 1101)
    const code = await client.getCode({ address: getAddress(input.spenderAddress) as Address })
    if (code && code !== '0x') return null // has code = is contract

    return {
      id: 'eoa_spender',
      label: 'Spender is EOA',
      description: 'The spender is an externally-owned account (not a smart contract). This is unusual and potentially dangerous.',
      score: 40,
      severity: 'high',
    }
  } catch {
    return null // can't determine, skip
  }
}

// ---------------------------------------------------------------------------
// Factor 4: Proxy / Upgradeable Contract
// ---------------------------------------------------------------------------
const EIP1967_IMPL_SLOT = '0x360894a13ba1a3210667c828492db2b21e54ebd381cf6ba6ec6f6e88c14a68d9' as `0x${string}`

export async function factorProxy(input: RiskInput): Promise<RiskFactor | null> {
  try {
    const client = clientFor(input.chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56 | 250 | 324 | 1101)
    const slot = await client.getStorageAt({
      address: getAddress(input.spenderAddress) as Address,
      slot: EIP1967_IMPL_SLOT,
    })
    // Non-zero means it's an EIP-1967 proxy
    if (!slot || slot === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null
    }
    return {
      id: 'proxy_contract',
      label: 'Upgradeable Contract',
      description: 'The spender is a proxy contract that can be upgraded. The implementation could change without your knowledge.',
      score: 30,
      severity: 'medium',
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Factor 5: Known Exploit Address
// ---------------------------------------------------------------------------

/** Top known exploited/malicious contract addresses */
const KNOWN_EXPLOIT_ADDRESSES: Set<string> = new Set([
  // Multichain/Anyswap exploit (Jul 2023) - ~$126M
  '0x1111111254fb6c44bac0bed2854e76f90643097d',
  '0x2a7813412b8da8d18ce56fe763b9eb4d14c7e657',
  // Ronin Bridge exploit (Mar 2022) - $624M
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
  // Wormhole exploit (Feb 2022) - $320M
  '0x629e7da20197a5429d30da36e77d06cdf796b71a',
  // Nomad Bridge exploit (Aug 2022) - $190M
  '0x56d8b635a7c88fd1104d23d632af40c1c3aac4e3',
  // Wintermute exploit (Sep 2022) - $160M
  '0x0248f752802b2cfb4373cc0c3bc3964429385c26',
  // Euler Finance exploit (Mar 2023) - $197M
  '0xb66cd966670d962c227b3eaba30a872dbfb995db',
  // Curve Finance exploit (Jul 2023) - $62M
  '0xdce5d6b41c32f578f875efffc0d422c57a75d7d8',
  // Atomic Wallet exploit (Jun 2023) - $100M
  '0x4bed6cb142b7677079df7e411772c9982dcbb40e',
  // Harmony Horizon Bridge (Jun 2022) - $100M
  '0x0d043128146654c7683fbf30ac98d7b2285ded00',
  // Badger DAO exploit (Dec 2021) - $120M
  '0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107',
  // Poly Network (Aug 2021) - $611M
  '0xc8a65fadf0e0ddaf421f28feab69bf6e2e589963',
  // bZx exploit (Nov 2021) - $55M
  '0xf6a78083ca3e2a662d6dd1703c939c8ace2e268d',
  // Cream Finance (Oct 2021) - $130M
  '0x24354d31bc9d90f62fe5f2454709c32049cf866b',
  // Parity multisig (Nov 2017) - $280M
  '0x863df6bfa4469f3ead0be8f9f2aae51c91a907b4',
  // KyberSwap exploit (Nov 2023) - $48M
  '0x50275e0b7261559ce1644014d4b78d4aa63be836',
  // Socket bridge exploit (Jan 2024)
  '0x3a23f943181408eac424116af7b7790c94cb97a5',
  // Orbit Chain exploit (Dec 2023) - $80M
  '0x27e920b3ebd9a91fb24e3aa5b0e930f0eabed15f',
  // Mixin Network (Sep 2023) - $200M
  '0x52380000c14b9b8e5fb3ac05db7e5f51ff015e53',
  // Heco Bridge exploit (Nov 2023)
  '0x7958514e29b36ab8e5090eb77e3526d5792dc21b',
])

export function factorKnownExploit(input: RiskInput): RiskFactor | null {
  if (KNOWN_EXPLOIT_ADDRESSES.has(input.spenderAddress.toLowerCase())) {
    return {
      id: 'known_exploit',
      label: 'Known Exploit Address',
      description: 'This spender address is associated with a known exploit or hack. Revoke immediately.',
      score: 100,
      severity: 'critical',
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Factor 6: Permit2 Unlimited + No Expiry
// ---------------------------------------------------------------------------
const MAX_UINT160 = (BigInt(1) << BigInt(160)) - BigInt(1)
const MAX_UINT48 = (BigInt(1) << BigInt(48)) - BigInt(1)

export function factorPermit2Unlimited(input: RiskInput): RiskFactor | null {
  if (input.permit2Amount === undefined) return null
  const isUnlimited = input.permit2Amount >= MAX_UINT160
  const noExpiry = !input.permit2Expiration || BigInt(input.permit2Expiration) >= MAX_UINT48

  if (isUnlimited && noExpiry) {
    return {
      id: 'permit2_unlimited_no_expiry',
      label: 'Permit2: Unlimited + No Expiry',
      description: 'This Permit2 approval is unlimited and has no expiration date.',
      score: 35,
      severity: 'high',
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Factor 7: Unverified Contract Source (check via explorer API)
// ---------------------------------------------------------------------------
export async function factorUnverifiedContract(input: RiskInput): Promise<RiskFactor | null> {
  // This requires block explorer API calls. For performance, we check a
  // local cache in the DB first.
  try {
    const result = await pool.query(
      `SELECT verified FROM contract_verification_cache
       WHERE chain_id = $1 AND address = $2
       AND checked_at > NOW() - INTERVAL '7 days'`,
      [input.chainId, input.spenderAddress.toLowerCase()],
    )

    if (result.rows.length > 0) {
      if (result.rows[0].verified) return null
      return {
        id: 'unverified_source',
        label: 'Unverified Contract',
        description: 'The spender contract source code is not verified on the block explorer.',
        score: 20,
        severity: 'medium',
      }
    }

    // No cache hit — skip for now (background job can populate this)
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Factor 8: High-Value Token Approval
// ---------------------------------------------------------------------------
export async function factorHighValue(input: RiskInput): Promise<RiskFactor | null> {
  if (input.isUnlimited) return null // already scored by unlimited factor

  try {
    // Check token price from our metadata
    const result = await pool.query(
      `SELECT price_usd FROM token_metadata
       WHERE chain_id = $1 AND token_address = $2`,
      [input.chainId, input.tokenAddress.toLowerCase()],
    )

    if (result.rows.length === 0 || !result.rows[0].price_usd) return null

    const priceUsd = Number(result.rows[0].price_usd)
    // Rough approximation: amount as a number (this is imprecise for huge values
    // but sufficient for threshold checking)
    const approvedAmount = Number(BigInt(input.amount))
    const valueUsd = approvedAmount * priceUsd

    if (valueUsd > 10_000) {
      return {
        id: 'high_value',
        label: 'High-Value Approval',
        description: `This approval covers tokens worth over $10,000 (est. $${Math.round(valueUsd).toLocaleString()}).`,
        score: 15,
        severity: 'medium',
      }
    }
    return null
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Aggregate evaluator
// ---------------------------------------------------------------------------

/**
 * Evaluate all synchronous risk factors (fast, no RPC calls).
 */
export function evaluateSyncFactors(input: RiskInput): RiskFactor[] {
  const factors: RiskFactor[] = []
  const f1 = factorUnlimited(input); if (f1) factors.push(f1)
  const f2 = factorStale(input); if (f2) factors.push(f2)
  const f3 = factorKnownExploit(input); if (f3) factors.push(f3)
  const f4 = factorPermit2Unlimited(input); if (f4) factors.push(f4)
  return factors
}

/**
 * Evaluate all risk factors (sync + async). Use for detailed scans.
 */
export async function evaluateAllFactors(input: RiskInput): Promise<RiskFactor[]> {
  const sync = evaluateSyncFactors(input)
  const async_ = await Promise.allSettled([
    factorSpenderIsEOA(input),
    factorProxy(input),
    factorUnverifiedContract(input),
    factorHighValue(input),
  ])

  for (const result of async_) {
    if (result.status === 'fulfilled' && result.value) {
      sync.push(result.value)
    }
  }

  return sync
}

/**
 * Compute aggregate risk score from factors.
 */
export function aggregateScore(factors: RiskFactor[]): number {
  return factors.reduce((sum, f) => sum + f.score, 0)
}

/**
 * Determine overall severity from factors.
 */
export function overallSeverity(factors: RiskFactor[]): RiskFactor['severity'] {
  const severityOrder: RiskFactor['severity'][] = ['info', 'low', 'medium', 'high', 'critical']
  let max = 0
  for (const f of factors) {
    const idx = severityOrder.indexOf(f.severity)
    if (idx > max) max = idx
  }
  return severityOrder[max]
}
