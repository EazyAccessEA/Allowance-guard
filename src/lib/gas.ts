// src/lib/gas.ts — Chain-aware gas estimation
//
// L2 chains have different gas models than Ethereum mainnet:
// - Arbitrum: L1+L2 fee via ArbGasInfo precompile
// - OP Stack (Optimism, Base): L1 data fee via GasPriceOracle precompile
// - Polygon, Avalanche: Standard eth_gasPrice
//
// All estimates are cached in Redis (60s TTL) when available.

import { clientFor } from './chains'
import { getChainMeta, type ChainMeta } from '@/config/chains'
import { parseAbi, formatGwei } from 'viem'
import { secureLogger } from './secure-logger'

/** ABI for Arbitrum's ArbGasInfo precompile */
const ARB_GAS_INFO_ABI = parseAbi([
  'function getPricesInWei() view returns (uint256, uint256, uint256, uint256, uint256, uint256)',
])
const ARB_GAS_INFO_ADDRESS = '0x000000000000000000000000000000000000006C' as const

/** ABI for OP Stack's GasPriceOracle precompile */
const OP_GAS_ORACLE_ABI = parseAbi([
  'function l1BaseFee() view returns (uint256)',
  'function baseFeeScalar() view returns (uint32)',
  'function blobBaseFeeScalar() view returns (uint32)',
])
const OP_GAS_ORACLE_ADDRESS = '0x420000000000000000000000000000000000000F' as const

export type GasEstimate = {
  chainId: number
  chainName: string
  /** L2 execution gas price in gwei */
  gasPriceGwei: number
  /** Native token price in USD */
  nativeTokenPriceUsd: number
  /** Native token symbol */
  symbol: string
  /** L1 data fee component (for L2s) in gwei — 0 for L1s */
  l1DataFeeGwei: number
  /** Total cost estimate for a standard approve(0) tx in USD */
  estimatedRevokeCostUsd: number
  fetchedAt: number
}

/** In-memory fallback cache (Redis preferred, in-memory as secondary) */
const memCache = new Map<number, GasEstimate>()
const CACHE_TTL_MS = 60_000

/**
 * Estimated gas for an ERC20 approve(spender, 0) call.
 */
const REVOKE_GAS = 48_000
const TX_BASE_GAS = 21_000
const TOTAL_REVOKE_GAS = REVOKE_GAS + TX_BASE_GAS

/**
 * Fetch native token price from CoinGecko.
 */
async function fetchNativePrice(coingeckoId: string): Promise<number> {
  const fallbackPrices: Record<string, number> = {
    'ethereum': 3200,
    'matic-network': 0.70,
    'avalanche-2': 35,
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
      { signal: AbortSignal.timeout(5000) },
    )
    const json = await res.json()
    return json[coingeckoId]?.usd ?? fallbackPrices[coingeckoId] ?? 3200
  } catch {
    return fallbackPrices[coingeckoId] ?? 3200
  }
}

/**
 * Get gas price for a standard (non-L2) chain via eth_gasPrice RPC.
 */
async function getStandardGasPrice(chainId: number): Promise<{ gasPriceGwei: number; l1DataFeeGwei: number }> {
  const client = clientFor(chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56)
  const gasPrice = await client.getGasPrice()
  return {
    gasPriceGwei: Number(formatGwei(gasPrice)),
    l1DataFeeGwei: 0,
  }
}

/**
 * Get gas price for Arbitrum (includes L1 data posting costs).
 */
async function getArbitrumGasPrice(chainId: number): Promise<{ gasPriceGwei: number; l1DataFeeGwei: number }> {
  const client = clientFor(chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56)

  try {
    const [gasPrice, arbPrices] = await Promise.all([
      client.getGasPrice(),
      client.readContract({
        address: ARB_GAS_INFO_ADDRESS,
        abi: ARB_GAS_INFO_ABI,
        functionName: 'getPricesInWei',
      }),
    ])

    const l2GasPriceGwei = Number(formatGwei(gasPrice))
    // arbPrices[0] is perL2Tx, [1] is perL1CalldataUnit (in wei)
    const l1DataFeeWei = (arbPrices as bigint[])[1] ?? BigInt(0)
    const l1DataFeeGwei = Number(formatGwei(l1DataFeeWei))

    return { gasPriceGwei: l2GasPriceGwei, l1DataFeeGwei }
  } catch (err) {
    secureLogger.warn('Arbitrum gas info precompile failed, falling back to standard', { err })
    return getStandardGasPrice(chainId)
  }
}

/**
 * Get gas price for OP Stack chains (Optimism, Base) — includes L1 data fee.
 */
async function getOpStackGasPrice(chainId: number): Promise<{ gasPriceGwei: number; l1DataFeeGwei: number }> {
  const client = clientFor(chainId as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56)

  try {
    const [gasPrice, l1BaseFee] = await Promise.all([
      client.getGasPrice(),
      client.readContract({
        address: OP_GAS_ORACLE_ADDRESS,
        abi: OP_GAS_ORACLE_ABI,
        functionName: 'l1BaseFee',
      }),
    ])

    const l2GasPriceGwei = Number(formatGwei(gasPrice))
    const l1DataFeeGwei = Number(formatGwei(l1BaseFee as bigint))

    return { gasPriceGwei: l2GasPriceGwei, l1DataFeeGwei }
  } catch (err) {
    secureLogger.warn('OP Stack gas oracle failed, falling back to standard', { err })
    return getStandardGasPrice(chainId)
  }
}

/**
 * Get gas estimate for a specific chain.
 */
export async function getGasEstimate(chainId: number): Promise<GasEstimate> {
  // Check cache
  const cached = memCache.get(chainId)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached
  }

  const meta = getChainMeta(chainId)
  if (!meta) {
    throw new Error(`Unsupported chain: ${chainId}`)
  }

  // Get chain-specific gas price
  let gasResult: { gasPriceGwei: number; l1DataFeeGwei: number }

  switch (meta.gasModel) {
    case 'arbitrum':
      gasResult = await getArbitrumGasPrice(chainId)
      break
    case 'op-stack':
      gasResult = await getOpStackGasPrice(chainId)
      break
    case 'avalanche':
    case 'standard':
    default:
      gasResult = await getStandardGasPrice(chainId)
      break
  }

  // Fetch native token price
  const nativeTokenPriceUsd = await fetchNativePrice(meta.coingeckoId)

  // Calculate estimated revoke cost
  // For L2s, total cost ≈ (L2 gas × L2 gas price) + (L1 data fee component)
  const l2CostEth = (TOTAL_REVOKE_GAS * gasResult.gasPriceGwei) / 1e9
  // L1 data fee: ~128 bytes of calldata for an approve tx
  const l1DataCostEth = meta.gasModel !== 'standard'
    ? (128 * gasResult.l1DataFeeGwei) / 1e9
    : 0
  const totalCostEth = l2CostEth + l1DataCostEth
  const estimatedRevokeCostUsd = totalCostEth * nativeTokenPriceUsd

  const estimate: GasEstimate = {
    chainId,
    chainName: meta.name,
    gasPriceGwei: gasResult.gasPriceGwei,
    nativeTokenPriceUsd,
    symbol: meta.symbol,
    l1DataFeeGwei: gasResult.l1DataFeeGwei,
    estimatedRevokeCostUsd,
    fetchedAt: Date.now(),
  }

  memCache.set(chainId, estimate)
  return estimate
}

/**
 * Get gas estimates for all supported chains.
 */
export async function getAllGasEstimates(): Promise<GasEstimate[]> {
  const { SUPPORTED_CHAIN_IDS } = await import('@/config/chains')
  const results = await Promise.allSettled(
    SUPPORTED_CHAIN_IDS.map(id => getGasEstimate(id))
  )
  return results
    .filter((r): r is PromiseFulfilledResult<GasEstimate> => r.status === 'fulfilled')
    .map(r => r.value)
}
