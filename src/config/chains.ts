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
 * The 15 officially supported chains.
 * Phase 9.5: expanded from 6 to 10 chains (added BSC, Fantom, zkSync Era, Polygon zkEVM).
 * Phase 9.5b: expanded from 10 to 15 chains (added Mantle, Gnosis, Linea, Scroll, Celo).
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
  // --- Phase 9.5: New chains ---
  {
    id: 56,
    name: 'BNB Smart Chain',
    slug: 'bsc',
    symbol: 'BNB',
    nativeDecimals: 18,
    explorer: 'https://bscscan.com',
    explorerApi: 'https://api.bscscan.com/api',
    logo: '/chains/bsc.svg',
    gasModel: 'standard',
    blockTimeSec: 3,
    coingeckoId: 'binancecoin',
  },
  {
    id: 250,
    name: 'Fantom',
    slug: 'fantom',
    symbol: 'FTM',
    nativeDecimals: 18,
    explorer: 'https://ftmscan.com',
    explorerApi: 'https://api.ftmscan.com/api',
    logo: '/chains/fantom.svg',
    gasModel: 'standard',
    blockTimeSec: 1,
    coingeckoId: 'fantom',
  },
  {
    id: 324,
    name: 'zkSync Era',
    slug: 'zksync',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://explorer.zksync.io',
    explorerApi: 'https://block-explorer-api.mainnet.zksync.io/api',
    logo: '/chains/zksync.svg',
    gasModel: 'standard',
    blockTimeSec: 1,
    coingeckoId: 'ethereum',
  },
  {
    id: 1101,
    name: 'Polygon zkEVM',
    slug: 'polygon-zkevm',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://zkevm.polygonscan.com',
    explorerApi: 'https://api-zkevm.polygonscan.com/api',
    logo: '/chains/polygon-zkevm.svg',
    gasModel: 'standard',
    blockTimeSec: 5,
    coingeckoId: 'ethereum',
  },
  // --- Phase 9.5b: Expansion to 15 chains ---
  {
    id: 5000,
    name: 'Mantle',
    slug: 'mantle',
    symbol: 'MNT',
    nativeDecimals: 18,
    explorer: 'https://mantlescan.xyz',
    explorerApi: 'https://api.mantlescan.xyz/api',
    logo: '/chains/mantle.svg',
    gasModel: 'standard',
    blockTimeSec: 2,
    coingeckoId: 'mantle',
  },
  {
    id: 100,
    name: 'Gnosis',
    slug: 'gnosis',
    symbol: 'xDAI',
    nativeDecimals: 18,
    explorer: 'https://gnosisscan.io',
    explorerApi: 'https://api.gnosisscan.io/api',
    logo: '/chains/gnosis.svg',
    gasModel: 'standard',
    blockTimeSec: 5,
    coingeckoId: 'xdai',
  },
  {
    id: 59144,
    name: 'Linea',
    slug: 'linea',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://lineascan.build',
    explorerApi: 'https://api.lineascan.build/api',
    logo: '/chains/linea.svg',
    gasModel: 'standard',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  {
    id: 534352,
    name: 'Scroll',
    slug: 'scroll',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://scroll.blockscout.com',
    explorerApi: 'https://scroll.blockscout.com/api',
    logo: '/chains/scroll.svg',
    gasModel: 'standard',
    blockTimeSec: 3,
    coingeckoId: 'ethereum',
  },
  {
    id: 42220,
    name: 'Celo',
    slug: 'celo',
    symbol: 'CELO',
    nativeDecimals: 18,
    explorer: 'https://celoscan.io',
    explorerApi: 'https://api.celoscan.io/api',
    logo: '/chains/celo.svg',
    gasModel: 'standard',
    blockTimeSec: 5,
    coingeckoId: 'celo',
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
