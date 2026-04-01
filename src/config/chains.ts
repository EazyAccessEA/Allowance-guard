// src/config/chains.ts — Single source of truth for all chain configuration
//
// ALL chain metadata lives here. Other modules import from this file.
// To add a new chain, add an entry here and update CSP/RPC env vars.

export type ChainMeta = {
  id: number
  name: string
  slug: string
  symbol: string
  nativeDecimals: number
  explorer: string
  explorerApi: string
  logo: string
  /** L2 gas model type for accurate estimation */
  gasModel: 'standard' | 'arbitrum' | 'op-stack' | 'avalanche'
  /** Approximate block time in seconds (used for stale-approval heuristics) */
  blockTimeSec: number
  /** CoinGecko native token ID for price lookups */
  coingeckoId: string
}

/**
 * The 6 officially supported chains.
 * BSC (56) is defined in networks.ts but NOT advertised — exclude from frontend.
 */
export const SUPPORTED_CHAINS: readonly ChainMeta[] = [
  {
    id: 1,
    name: 'Ethereum',
    slug: 'ethereum',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://etherscan.io',
    explorerApi: 'https://api.etherscan.io/api',
    logo: '/chains/ethereum.svg',
    gasModel: 'standard',
    blockTimeSec: 12,
    coingeckoId: 'ethereum',
  },
  {
    id: 42161,
    name: 'Arbitrum',
    slug: 'arbitrum',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://arbiscan.io',
    explorerApi: 'https://api.arbiscan.io/api',
    logo: '/chains/arbitrum.svg',
    gasModel: 'arbitrum',
    blockTimeSec: 0.25,
    coingeckoId: 'ethereum',
  },
  {
    id: 8453,
    name: 'Base',
    slug: 'base',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://basescan.org',
    explorerApi: 'https://api.basescan.org/api',
    logo: '/chains/base.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  {
    id: 10,
    name: 'Optimism',
    slug: 'optimism',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://optimistic.etherscan.io',
    explorerApi: 'https://api-optimistic.etherscan.io/api',
    logo: '/chains/optimism.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  {
    id: 137,
    name: 'Polygon',
    slug: 'polygon',
    symbol: 'MATIC',
    nativeDecimals: 18,
    explorer: 'https://polygonscan.com',
    explorerApi: 'https://api.polygonscan.com/api',
    logo: '/chains/polygon.svg',
    gasModel: 'standard',
    blockTimeSec: 2,
    coingeckoId: 'matic-network',
  },
  {
    id: 43114,
    name: 'Avalanche',
    slug: 'avalanche',
    symbol: 'AVAX',
    nativeDecimals: 18,
    explorer: 'https://snowtrace.io',
    explorerApi: 'https://api.snowtrace.io/api',
    logo: '/chains/avalanche.svg',
    gasModel: 'avalanche',
    blockTimeSec: 2,
    coingeckoId: 'avalanche-2',
  },
] as const

/** Lookup by chain ID */
export const CHAIN_BY_ID: Record<number, ChainMeta> = Object.fromEntries(
  SUPPORTED_CHAINS.map(c => [c.id, c])
)

/** All supported chain IDs */
export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map(c => c.id)

/** Human-readable name lookup (used in UI components) */
export const CHAIN_NAMES: Record<number, string> = Object.fromEntries(
  SUPPORTED_CHAINS.map(c => [c.id, c.name])
)

/** Get chain metadata or undefined */
export function getChainMeta(chainId: number): ChainMeta | undefined {
  return CHAIN_BY_ID[chainId]
}

/** Approximate blocks for a duration in seconds */
export function blocksForDuration(chainId: number, durationSec: number): bigint {
  const meta = CHAIN_BY_ID[chainId]
  if (!meta) return BigInt(0)
  return BigInt(Math.ceil(durationSec / meta.blockTimeSec))
}

/** Explorer link for a transaction */
export function explorerTxUrl(chainId: number, txHash: string): string {
  const meta = CHAIN_BY_ID[chainId]
  return meta ? `${meta.explorer}/tx/${txHash}` : '#'
}

/** Explorer link for an address */
export function explorerAddressUrl(chainId: number, address: string): string {
  const meta = CHAIN_BY_ID[chainId]
  return meta ? `${meta.explorer}/address/${address}` : '#'
}
