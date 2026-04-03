/**
 * Safe (Gnosis Safe) Integration Library
 *
 * Provides helpers for interacting with Safe multi-sig wallets:
 * - Detect if a wallet is a Safe
 * - Fetch Safe info (owners, threshold)
 * - Build multi-sig revocation transactions
 * - Build governance proposal templates
 */

import { getAddress, type Address, encodeFunctionData, parseAbi } from 'viem'
import { clientFor } from './chains'
import { pool } from './db'

// Safe contract detection — proxy storage slot for Safe v1.3+
const SAFE_SINGLETON_SLOT = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`

// Known Safe singleton addresses (deployed at the same address on all EVM chains)
const SAFE_SINGLETONS = new Set([
  '0xd9db270c1b5e3bd161e8c8503c55ceabee709552', // Safe v1.3.0
  '0x3e5c63644e683549055b9be8653de26e0b4cd36e', // Safe v1.3.0 L2
  '0x41675c099f32341bf84bfc5382af534df5c7461a', // Safe v1.4.1
  '0x29fcb43b46531bca003ddc8fcb67ffe91900c762', // Safe v1.4.1 L2
])

// ERC-20 approve ABI for building revoke transactions
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
])

// Safe transaction service API URLs by chain
const SAFE_TX_SERVICE: Record<number, string> = {
  1: 'https://safe-transaction-mainnet.safe.global',
  42161: 'https://safe-transaction-arbitrum.safe.global',
  8453: 'https://safe-transaction-base.safe.global',
  10: 'https://safe-transaction-optimism.safe.global',
  137: 'https://safe-transaction-polygon.safe.global',
  43114: 'https://safe-transaction-avalanche.safe.global',
  56: 'https://safe-transaction-bsc.safe.global',
  324: 'https://safe-transaction-zksync.safe.global',
  1101: 'https://safe-transaction-polygon-zkevm.safe.global',
}

export interface SafeInfo {
  address: string
  isSafe: boolean
  chainId: number
  owners: string[]
  threshold: number
  nonce: number
  version: string | null
}

export interface SafeRevokeTx {
  to: string
  value: string
  data: string
  operation: number
  description: string
}

export interface GovernanceProposal {
  title: string
  description: string
  transactions: SafeRevokeTx[]
  chainId: number
  safeAddress: string
}

/**
 * Detect whether a given address is a Safe multi-sig wallet.
 */
export async function isSafeWallet(
  address: string,
  chainId: number,
): Promise<boolean> {
  try {
    const client = clientFor(chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56)
    const code = await client.getCode({ address: getAddress(address) as Address })
    if (!code || code === '0x') return false

    // Check if the singleton address in storage matches a known Safe singleton
    const slot = await client.getStorageAt({
      address: getAddress(address) as Address,
      slot: SAFE_SINGLETON_SLOT,
    })
    if (!slot) return false

    const singleton = '0x' + slot.slice(26).toLowerCase()
    return SAFE_SINGLETONS.has(singleton)
  } catch {
    return false
  }
}

/**
 * Fetch Safe info from the Safe Transaction Service.
 */
export async function getSafeInfo(
  address: string,
  chainId: number,
): Promise<SafeInfo | null> {
  const baseUrl = SAFE_TX_SERVICE[chainId]
  if (!baseUrl) return null

  try {
    const res = await fetch(`${baseUrl}/api/v1/safes/${getAddress(address)}/`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) return null

    const data = await res.json()
    return {
      address: data.address,
      isSafe: true,
      chainId,
      owners: data.owners || [],
      threshold: data.threshold || 1,
      nonce: data.nonce || 0,
      version: data.version || null,
    }
  } catch {
    return null
  }
}

/**
 * Build a batch of revoke transactions for a Safe multi-sig.
 * Each revoke sets the allowance to 0 for the given token/spender pair.
 */
export function buildBatchRevokeTxs(
  allowances: Array<{
    tokenAddress: string
    spenderAddress: string
    tokenSymbol?: string
  }>,
): SafeRevokeTx[] {
  return allowances.map((a) => {
    const data = encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [getAddress(a.spenderAddress) as Address, BigInt(0)],
    })

    return {
      to: a.tokenAddress,
      value: '0',
      data,
      operation: 0, // CALL
      description: `Revoke ${a.tokenSymbol || 'token'} approval for ${a.spenderAddress.slice(0, 6)}...${a.spenderAddress.slice(-4)}`,
    }
  })
}

/**
 * Generate a governance proposal template for approval management.
 */
export function buildGovernanceProposal(
  safeAddress: string,
  chainId: number,
  allowances: Array<{
    tokenAddress: string
    spenderAddress: string
    tokenSymbol?: string
    spenderLabel?: string
  }>,
  action: 'revoke' | 'reduce',
): GovernanceProposal {
  const transactions = buildBatchRevokeTxs(allowances)

  const revokeList = allowances
    .map(
      (a) =>
        `- ${a.tokenSymbol || a.tokenAddress.slice(0, 10)} → ${a.spenderLabel || a.spenderAddress.slice(0, 10)}`,
    )
    .join('\n')

  return {
    title:
      action === 'revoke'
        ? `Revoke ${allowances.length} Token Approval(s)`
        : `Reduce ${allowances.length} Token Approval(s)`,
    description: `## Proposal: ${action === 'revoke' ? 'Revoke' : 'Reduce'} Token Approvals

This proposal ${action === 'revoke' ? 'revokes' : 'reduces'} the following token approvals identified as risky by AllowanceGuard:

${revokeList}

### Rationale
These approvals were flagged during a security review. ${action === 'revoke' ? 'Revoking' : 'Reducing'} them minimizes the attack surface for this treasury wallet.

### Impact
- **Transactions**: ${transactions.length} approval ${action === 'revoke' ? 'revocation' : 'modification'}(s)
- **Gas**: Each revoke costs ~46,000 gas
- **Risk reduction**: Eliminates unnecessary token exposure

Generated by AllowanceGuard — https://www.allowanceguard.com`,
    transactions,
    chainId,
    safeAddress,
  }
}

/**
 * Fetch allowances for a Safe wallet from the database.
 */
export async function getSafeAllowances(
  safeAddress: string,
  chainId?: number,
): Promise<
  Array<{
    chainId: number
    tokenAddress: string
    spenderAddress: string
    tokenSymbol: string | null
    spenderLabel: string | null
    amount: string
    isUnlimited: boolean
    riskScore: number
  }>
> {
  const chainFilter = chainId ? 'AND a.chain_id = $2' : ''
  const params: (string | number)[] = [safeAddress.toLowerCase()]
  if (chainId) params.push(chainId)

  const { rows } = await pool.query(
    `SELECT a.chain_id, a.token_address, a.spender_address, a.amount,
            a.is_unlimited, a.risk_score,
            tm.symbol AS token_symbol,
            sl.label AS spender_label
     FROM allowances a
     LEFT JOIN token_metadata tm ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
     LEFT JOIN spender_labels sl ON sl.chain_id = a.chain_id AND sl.address = a.spender_address
     WHERE a.wallet_address = $1 ${chainFilter}
     ORDER BY a.risk_score DESC`,
    params,
  )

  return rows.map((r) => ({
    chainId: Number(r.chain_id),
    tokenAddress: r.token_address,
    spenderAddress: r.spender_address,
    tokenSymbol: r.token_symbol,
    spenderLabel: r.spender_label,
    amount: r.amount,
    isUnlimited: r.is_unlimited,
    riskScore: Number(r.risk_score),
  }))
}
