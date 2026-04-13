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
 * The 27 officially supported EVM chains.
 * Phase 9.5: expanded from 6 to 10 chains (added BSC, Fantom, zkSync Era, Polygon zkEVM).
 * Phase 9.5b: expanded from 10 to 27 chains (added Mantle, Gnosis, Linea, Scroll, Celo).
 * Phase 9.6: expanded from 15 to 27 chains (added Blast, Cronos, Moonbeam, Aurora, opBNB, Manta Pacific, Mode, Taiko, Metis, Kava, ZetaChain, Worldchain).
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
  // --- Phase 9.5b: Expansion to 27 chains ---
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
  // --- Phase 9.6: Tier 1 — high TVL, etherscan-compatible ---
  {
    id: 81457,
    name: 'Blast',
    slug: 'blast',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://blastscan.io',
    explorerApi: 'https://api.blastscan.io/api',
    logo: '/chains/blast.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  {
    id: 25,
    name: 'Cronos',
    slug: 'cronos',
    symbol: 'CRO',
    nativeDecimals: 18,
    explorer: 'https://cronoscan.com',
    explorerApi: 'https://api.cronoscan.com/api',
    logo: '/chains/cronos.svg',
    gasModel: 'standard',
    blockTimeSec: 6,
    coingeckoId: 'crypto-com-chain',
  },
  {
    id: 1284,
    name: 'Moonbeam',
    slug: 'moonbeam',
    symbol: 'GLMR',
    nativeDecimals: 18,
    explorer: 'https://moonscan.io',
    explorerApi: 'https://api-moonbeam.moonscan.io/api',
    logo: '/chains/moonbeam.svg',
    gasModel: 'standard',
    blockTimeSec: 12,
    coingeckoId: 'moonbeam',
  },
  {
    id: 1313161554,
    name: 'Aurora',
    slug: 'aurora',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://explorer.aurora.dev',
    explorerApi: 'https://explorer.aurora.dev/api',
    logo: '/chains/aurora.svg',
    gasModel: 'standard',
    blockTimeSec: 1,
    coingeckoId: 'ethereum',
  },
  {
    id: 204,
    name: 'opBNB',
    slug: 'opbnb',
    symbol: 'BNB',
    nativeDecimals: 18,
    explorer: 'https://opbnb.bscscan.com',
    explorerApi: 'https://api-opbnb.bscscan.com/api',
    logo: '/chains/opbnb.svg',
    gasModel: 'op-stack',
    blockTimeSec: 1,
    coingeckoId: 'binancecoin',
  },
  {
    id: 169,
    name: 'Manta Pacific',
    slug: 'manta',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://pacific-explorer.manta.network',
    explorerApi: 'https://pacific-explorer.manta.network/api',
    logo: '/chains/manta.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  // --- Phase 9.6: Tier 2 — growing chains ---
  {
    id: 34443,
    name: 'Mode',
    slug: 'mode',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://modescan.io',
    explorerApi: 'https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan/api',
    logo: '/chains/mode.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
  },
  {
    id: 167000,
    name: 'Taiko',
    slug: 'taiko',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://taikoscan.io',
    explorerApi: 'https://api.taikoscan.io/api',
    logo: '/chains/taiko.svg',
    gasModel: 'standard',
    blockTimeSec: 3,
    coingeckoId: 'ethereum',
  },
  {
    id: 1088,
    name: 'Metis',
    slug: 'metis',
    symbol: 'METIS',
    nativeDecimals: 18,
    explorer: 'https://andromeda-explorer.metis.io',
    explorerApi: 'https://andromeda-explorer.metis.io/api',
    logo: '/chains/metis.svg',
    gasModel: 'standard',
    blockTimeSec: 4,
    coingeckoId: 'metis-token',
  },
  {
    id: 2222,
    name: 'Kava',
    slug: 'kava',
    symbol: 'KAVA',
    nativeDecimals: 18,
    explorer: 'https://kavascan.com',
    explorerApi: 'https://kavascan.com/api',
    logo: '/chains/kava.svg',
    gasModel: 'standard',
    blockTimeSec: 6,
    coingeckoId: 'kava',
  },
  {
    id: 7000,
    name: 'ZetaChain',
    slug: 'zetachain',
    symbol: 'ZETA',
    nativeDecimals: 18,
    explorer: 'https://zetachain.blockscout.com',
    explorerApi: 'https://zetachain.blockscout.com/api',
    logo: '/chains/zetachain.svg',
    gasModel: 'standard',
    blockTimeSec: 5,
    coingeckoId: 'zetachain',
  },
  {
    id: 480,
    name: 'Worldchain',
    slug: 'worldchain',
    symbol: 'ETH',
    nativeDecimals: 18,
    explorer: 'https://worldscan.org',
    explorerApi: 'https://api.worldscan.org/api',
    logo: '/chains/worldchain.svg',
    gasModel: 'op-stack',
    blockTimeSec: 2,
    coingeckoId: 'ethereum',
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
