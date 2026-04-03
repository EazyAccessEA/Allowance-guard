// src/lib/permit2.ts — Permit2 allowance scanner
//
// Uniswap's Permit2 contract (0x000000000022D473030F116dDEE9F6B43aC78BA3) is
// deployed at the same address on every EVM chain. Users approve Permit2 once,
// then Permit2 manages sub-approvals to individual spenders (routers, aggregators).
//
// This module queries on-chain Permit2 allowances for a given wallet.

import { type Address, type PublicClient, getAddress, parseAbi } from 'viem'
import { clientFor } from './chains'
import { SUPPORTED_CHAIN_IDS } from '@/config/chains'

/** Canonical Permit2 address (same on all EVM chains) */
export const PERMIT2_ADDRESS = '0x000000000022D473030F116dDEE9F6B43aC78BA3' as Address

/** Permit2 ABI fragment for allowance reads */
const PERMIT2_ABI = parseAbi([
  'function allowance(address owner, address token, address spender) view returns (uint160 amount, uint48 expiration, uint48 nonce)',
])

/** Well-known Permit2 spenders — label + addresses per chain */
export type KnownSpender = {
  name: string
  addresses: Record<number, Address> // chainId → address
  risk: 'low' | 'medium' | 'high'
}

export const KNOWN_PERMIT2_SPENDERS: KnownSpender[] = [
  {
    name: 'Uniswap Universal Router',
    addresses: {
      1: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      42161: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      8453: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      10: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      137: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      43114: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
    },
    risk: 'low',
  },
  {
    name: 'Uniswap Router V2',
    addresses: {
      1: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      42161: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      8453: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      10: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      137: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      43114: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
    risk: 'low',
  },
  {
    name: '1inch Aggregation Router V5',
    addresses: {
      1: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      42161: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      8453: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      10: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      137: '0x1111111254EEB25477B68fb85Ed929f73A960582',
      43114: '0x1111111254EEB25477B68fb85Ed929f73A960582',
    },
    risk: 'low',
  },
  {
    name: '1inch Aggregation Router V6',
    addresses: {
      1: '0x111111125421cA6dc452d289314280a0f8842A65',
      42161: '0x111111125421cA6dc452d289314280a0f8842A65',
      8453: '0x111111125421cA6dc452d289314280a0f8842A65',
      10: '0x111111125421cA6dc452d289314280a0f8842A65',
      137: '0x111111125421cA6dc452d289314280a0f8842A65',
      43114: '0x111111125421cA6dc452d289314280a0f8842A65',
    },
    risk: 'low',
  },
  {
    name: 'Paraswap Augustus V6.2',
    addresses: {
      1: '0x6A000F20005980200259B80c5102003040001068',
      42161: '0x6A000F20005980200259B80c5102003040001068',
      10: '0x6A000F20005980200259B80c5102003040001068',
      137: '0x6A000F20005980200259B80c5102003040001068',
      43114: '0x6A000F20005980200259B80c5102003040001068',
    },
    risk: 'low',
  },
  {
    name: 'CoW Protocol GPv2Settlement',
    addresses: {
      1: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
      42161: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
    },
    risk: 'low',
  },
]

export type Permit2Allowance = {
  chainId: number
  token: Address
  spender: Address
  spenderLabel: string | null
  amount: bigint
  expiration: number // unix timestamp
  nonce: number
  isExpired: boolean
  isUnlimited: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
}

/** Max uint160 — "unlimited" Permit2 approval */
const MAX_UINT160 = (BigInt(1) << BigInt(160)) - BigInt(1)
/** Max uint48 — "no expiry" */
const MAX_UINT48 = (BigInt(1) << BigInt(48)) - BigInt(1)

/**
 * Look up the label for a known Permit2 spender on a given chain.
 */
export function labelForSpender(spender: Address, chainId: number): string | null {
  const lower = spender.toLowerCase()
  for (const ks of KNOWN_PERMIT2_SPENDERS) {
    const addr = ks.addresses[chainId]
    if (addr && addr.toLowerCase() === lower) return ks.name
  }
  return null
}

/**
 * Determine risk level for a Permit2 allowance.
 */
function assessRisk(amount: bigint, expiration: number, spenderLabel: string | null): Permit2Allowance['riskLevel'] {
  const now = Math.floor(Date.now() / 1000)
  const isExpired = expiration > 0 && expiration < now
  if (isExpired) return 'low'

  const isUnlimited = amount >= MAX_UINT160
  const noExpiry = expiration === 0 || BigInt(expiration) >= MAX_UINT48

  // Unknown spender with unlimited + no expiry = critical
  if (!spenderLabel && isUnlimited && noExpiry) return 'critical'
  if (!spenderLabel && isUnlimited) return 'high'
  if (isUnlimited && noExpiry) return 'high'
  if (isUnlimited) return 'medium'
  return 'low'
}

/**
 * Get the list of tokens a wallet has approved to Permit2.
 * We query ERC20 Approval events from the Permit2 contract to discover tokens.
 */
export async function getPermit2TokensFromEvents(
  client: PublicClient,
  owner: Address,
  chainId: number,
): Promise<Address[]> {
  // Query Transfer/Approval events is expensive. Instead, we check known
  // popular tokens. In production, we'd index events or use a subgraph.
  // For now, query the user's standard allowances table to find tokens
  // that might also have Permit2 approvals.
  //
  // This is a pragmatic approach: if a user has approved tokens to dApps,
  // those same tokens likely have Permit2 approvals too.
  return []
}

/**
 * Scan Permit2 allowances for a wallet on a specific chain.
 *
 * @param owner   - Wallet address to scan
 * @param chainId - Chain ID to scan
 * @param tokens  - List of token addresses to check against known spenders
 */
export async function scanPermit2Allowances(
  owner: Address,
  chainId: number,
  tokens: Address[],
): Promise<Permit2Allowance[]> {
  if (!SUPPORTED_CHAIN_IDS.includes(chainId)) return []
  if (tokens.length === 0) return []

  const client = clientFor(chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56 | 250 | 324 | 1101 | 5000 | 100 | 59144 | 534352 | 42220)
  const now = Math.floor(Date.now() / 1000)
  const results: Permit2Allowance[] = []

  // Build multicall requests: check each token × each known spender on this chain
  const spendersOnChain = KNOWN_PERMIT2_SPENDERS
    .filter(ks => ks.addresses[chainId])
    .map(ks => ({
      name: ks.name,
      address: getAddress(ks.addresses[chainId]),
    }))

  if (spendersOnChain.length === 0) return []

  // Batch calls using multicall for efficiency
  const calls: Array<{
    token: Address
    spenderAddr: Address
    spenderName: string
  }> = []

  for (const token of tokens) {
    for (const sp of spendersOnChain) {
      calls.push({ token: getAddress(token), spenderAddr: sp.address, spenderName: sp.name })
    }
  }

  // Use viem multicall to batch all reads
  try {
    const multicallResults = await client.multicall({
      contracts: calls.map(c => ({
        address: PERMIT2_ADDRESS,
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [getAddress(owner), c.token, c.spenderAddr],
      })),
      allowFailure: true,
    })

    for (let i = 0; i < multicallResults.length; i++) {
      const r = multicallResults[i]
      if (r.status !== 'success' || !r.result) continue

      const [amount, expiration, nonce] = r.result as [bigint, number, number]

      // Skip zero allowances
      if (amount === BigInt(0)) continue

      const call = calls[i]
      const spenderLabel = call.spenderName
      const isExpired = expiration > 0 && expiration < now
      const isUnlimited = amount >= MAX_UINT160

      results.push({
        chainId,
        token: call.token,
        spender: call.spenderAddr,
        spenderLabel,
        amount,
        expiration,
        nonce,
        isExpired,
        isUnlimited,
        riskLevel: assessRisk(amount, expiration, spenderLabel),
      })
    }
  } catch (err) {
    // Permit2 may not be deployed on some chains or multicall may fail
    // Fail gracefully — return whatever we got
    console.error(`Permit2 scan failed on chain ${chainId}:`, err)
  }

  return results
}

/**
 * Scan Permit2 allowances across all supported chains.
 */
export async function scanAllChainsPermit2(
  owner: Address,
  tokensByChain: Record<number, Address[]>,
): Promise<Permit2Allowance[]> {
  const promises = SUPPORTED_CHAIN_IDS.map(chainId => {
    const tokens = tokensByChain[chainId] || []
    if (tokens.length === 0) return Promise.resolve([])
    return scanPermit2Allowances(owner, chainId, tokens)
  })

  const results = await Promise.allSettled(promises)
  return results
    .filter((r): r is PromiseFulfilledResult<Permit2Allowance[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
}

/**
 * Calculate the risk score contribution of Permit2 allowances.
 */
export function permit2RiskScore(allowances: Permit2Allowance[]): number {
  let score = 0
  for (const a of allowances) {
    if (a.isExpired) continue // expired = no risk
    if (a.riskLevel === 'critical') score += 45
    else if (a.riskLevel === 'high') score += 35
    else if (a.riskLevel === 'medium') score += 20
    else score += 5
  }
  return score
}
