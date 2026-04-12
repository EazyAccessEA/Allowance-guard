// src/lib/networks.ts

/** ---------- Types ---------- */
export type RpcEndpoint = { url: string; weight?: number; timeoutMs?: number }

export type ChainCfg = {
  id: number
  name: string
  symbol: string
  rpcs: RpcEndpoint[]
  explorer: string
  enabled: boolean
}

/** ---------- Helpers ---------- */
const envList = (envName: string, fallback: string[] = []): RpcEndpoint[] => {
  const raw = process.env[envName]
  if (!raw) return fallback.map(url => ({ url }))
  const items = raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return (items.length ? items : fallback).map(url => ({ url }))
}

// Optional: allow disabling chains at runtime: DISABLED_CHAINS="137,56"
const disabledSet = new Set<string>(
  (process.env.DISABLED_CHAINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
)

/** ---------- CHAINS (runtime source of truth) ----------
 * All 27 supported EVM chains with RPC endpoint configuration.
 */
export const CHAINS: Record<number, ChainCfg> = {
  1: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcs: envList('ETHEREUM_RPC_URLS', [
      'https://eth.llamarpc.com',
      'https://eth.drpc.org'
    ]),
    explorer: 'https://etherscan.io',
    enabled: !disabledSet.has('1')
  },
  42161: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpcs: envList('ARBITRUM_RPC_URLS', [
      'https://arb1.arbitrum.io/rpc',
      'https://arbitrum.drpc.org'
    ]),
    explorer: 'https://arbiscan.io',
    enabled: !disabledSet.has('42161')
  },
  8453: {
    id: 8453,
    name: 'Base',
    symbol: 'ETH',
    rpcs: envList('BASE_RPC_URLS', [
      'https://mainnet.base.org',
      'https://base.drpc.org'
    ]),
    explorer: 'https://basescan.org',
    enabled: !disabledSet.has('8453')
  },

  // --- new in Task 1.2 ---
  10: {
    id: 10,
    name: 'Optimism',
    symbol: 'ETH',
    rpcs: envList('OPTIMISM_RPC_URLS', [
      'https://mainnet.optimism.io',
      'https://optimism.drpc.org'
    ]),
    explorer: 'https://optimistic.etherscan.io',
    enabled: !disabledSet.has('10')
  },
  137: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpcs: envList('POLYGON_RPC_URLS', [
      'https://polygon-rpc.com',
      'https://polygon.drpc.org'
    ]),
    explorer: 'https://polygonscan.com',
    enabled: !disabledSet.has('137')
  },
  43114: {
    id: 43114,
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcs: envList('AVALANCHE_RPC_URLS', [
      'https://api.avax.network/ext/bc/C/rpc',
      'https://avalanche.drpc.org'
    ]),
    explorer: 'https://snowtrace.io',
    enabled: !disabledSet.has('43114')
  },
  56: {
    id: 56,
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    rpcs: envList('BSC_RPC_URLS', [
      'https://bsc-dataseed.binance.org',
      'https://bsc.drpc.org'
    ]),
    explorer: 'https://bscscan.com',
    enabled: !disabledSet.has('56')
  },

  // --- Phase 9.5: New chains ---
  250: {
    id: 250,
    name: 'Fantom',
    symbol: 'FTM',
    rpcs: envList('FANTOM_RPC_URLS', [
      'https://fantom.drpc.org',
      'https://fantom-rpc.publicnode.com',
      'https://rpc.ftm.tools'
    ]),
    explorer: 'https://ftmscan.com',
    enabled: !disabledSet.has('250')
  },
  324: {
    id: 324,
    name: 'zkSync Era',
    symbol: 'ETH',
    rpcs: envList('ZKSYNC_RPC_URLS', [
      'https://mainnet.era.zksync.io',
      'https://zksync.drpc.org'
    ]),
    explorer: 'https://explorer.zksync.io',
    enabled: !disabledSet.has('324')
  },
  1101: {
    id: 1101,
    name: 'Polygon zkEVM',
    symbol: 'ETH',
    rpcs: envList('POLYGON_ZKEVM_RPC_URLS', [
      'https://zkevm-rpc.com',
      'https://polygon-zkevm.drpc.org'
    ]),
    explorer: 'https://zkevm.polygonscan.com',
    enabled: !disabledSet.has('1101')
  },

  // --- Phase 9.5b: Expansion to 15 chains ---
  5000: {
    id: 5000,
    name: 'Mantle',
    symbol: 'MNT',
    rpcs: envList('MANTLE_RPC_URLS', [
      'https://rpc.mantle.xyz',
      'https://mantle.drpc.org'
    ]),
    explorer: 'https://mantlescan.xyz',
    enabled: !disabledSet.has('5000')
  },
  100: {
    id: 100,
    name: 'Gnosis',
    symbol: 'xDAI',
    rpcs: envList('GNOSIS_RPC_URLS', [
      'https://rpc.gnosischain.com',
      'https://gnosis.drpc.org'
    ]),
    explorer: 'https://gnosisscan.io',
    enabled: !disabledSet.has('100')
  },
  59144: {
    id: 59144,
    name: 'Linea',
    symbol: 'ETH',
    rpcs: envList('LINEA_RPC_URLS', [
      'https://rpc.linea.build',
      'https://linea.drpc.org'
    ]),
    explorer: 'https://lineascan.build',
    enabled: !disabledSet.has('59144')
  },
  534352: {
    id: 534352,
    name: 'Scroll',
    symbol: 'ETH',
    rpcs: envList('SCROLL_RPC_URLS', [
      'https://rpc.scroll.io',
      'https://scroll.drpc.org'
    ]),
    explorer: 'https://scroll.blockscout.com',
    enabled: !disabledSet.has('534352')
  },
  42220: {
    id: 42220,
    name: 'Celo',
    symbol: 'CELO',
    rpcs: envList('CELO_RPC_URLS', [
      'https://forno.celo.org',
      'https://celo.drpc.org'
    ]),
    explorer: 'https://celoscan.io',
    enabled: !disabledSet.has('42220')
  },
  // --- Phase 9.6: Tier 1 ---
  81457: {
    id: 81457,
    name: 'Blast',
    symbol: 'ETH',
    rpcs: envList('BLAST_RPC_URLS', [
      'https://rpc.blast.io',
      'https://blast.drpc.org'
    ]),
    explorer: 'https://blastscan.io',
    enabled: !disabledSet.has('81457')
  },
  25: {
    id: 25,
    name: 'Cronos',
    symbol: 'CRO',
    rpcs: envList('CRONOS_RPC_URLS', [
      'https://evm.cronos.org',
      'https://cronos.drpc.org'
    ]),
    explorer: 'https://cronoscan.com',
    enabled: !disabledSet.has('25')
  },
  1284: {
    id: 1284,
    name: 'Moonbeam',
    symbol: 'GLMR',
    rpcs: envList('MOONBEAM_RPC_URLS', [
      'https://rpc.api.moonbeam.network',
      'https://moonbeam.drpc.org'
    ]),
    explorer: 'https://moonscan.io',
    enabled: !disabledSet.has('1284')
  },
  1313161554: {
    id: 1313161554,
    name: 'Aurora',
    symbol: 'ETH',
    rpcs: envList('AURORA_RPC_URLS', [
      'https://mainnet.aurora.dev',
      'https://aurora.drpc.org'
    ]),
    explorer: 'https://explorer.aurora.dev',
    enabled: !disabledSet.has('1313161554')
  },
  204: {
    id: 204,
    name: 'opBNB',
    symbol: 'BNB',
    rpcs: envList('OPBNB_RPC_URLS', [
      'https://opbnb-mainnet-rpc.bnbchain.org',
      'https://opbnb.drpc.org'
    ]),
    explorer: 'https://opbnb.bscscan.com',
    enabled: !disabledSet.has('204')
  },
  169: {
    id: 169,
    name: 'Manta Pacific',
    symbol: 'ETH',
    rpcs: envList('MANTA_RPC_URLS', [
      'https://pacific-rpc.manta.network/http',
      'https://manta-pacific.drpc.org'
    ]),
    explorer: 'https://pacific-explorer.manta.network',
    enabled: !disabledSet.has('169')
  },
  // --- Phase 9.6: Tier 2 ---
  34443: {
    id: 34443,
    name: 'Mode',
    symbol: 'ETH',
    rpcs: envList('MODE_RPC_URLS', [
      'https://mainnet.mode.network',
      'https://mode.drpc.org'
    ]),
    explorer: 'https://modescan.io',
    enabled: !disabledSet.has('34443')
  },
  167000: {
    id: 167000,
    name: 'Taiko',
    symbol: 'ETH',
    rpcs: envList('TAIKO_RPC_URLS', [
      'https://rpc.mainnet.taiko.xyz',
      'https://taiko.drpc.org'
    ]),
    explorer: 'https://taikoscan.io',
    enabled: !disabledSet.has('167000')
  },
  1088: {
    id: 1088,
    name: 'Metis',
    symbol: 'METIS',
    rpcs: envList('METIS_RPC_URLS', [
      'https://andromeda.metis.io/?owner=1088',
      'https://metis.drpc.org'
    ]),
    explorer: 'https://andromeda-explorer.metis.io',
    enabled: !disabledSet.has('1088')
  },
  2222: {
    id: 2222,
    name: 'Kava',
    symbol: 'KAVA',
    rpcs: envList('KAVA_RPC_URLS', [
      'https://evm.kava.io',
      'https://kava.drpc.org'
    ]),
    explorer: 'https://kavascan.com',
    enabled: !disabledSet.has('2222')
  },
  7000: {
    id: 7000,
    name: 'ZetaChain',
    symbol: 'ZETA',
    rpcs: envList('ZETACHAIN_RPC_URLS', [
      'https://zetachain-evm.blockpi.network/v1/rpc/public',
      'https://zetachain.drpc.org'
    ]),
    explorer: 'https://zetachain.blockscout.com',
    enabled: !disabledSet.has('7000')
  },
  480: {
    id: 480,
    name: 'Worldchain',
    symbol: 'ETH',
    rpcs: envList('WORLDCHAIN_RPC_URLS', [
      'https://worldchain-mainnet.g.alchemy.com/public',
      'https://worldchain.drpc.org'
    ]),
    explorer: 'https://worldscan.org',
    enabled: !disabledSet.has('480')
  },
} as const

/** ---------- Derived helpers (no hardcoded unions) ---------- */
export type SupportedChainId = keyof typeof CHAINS & number

export const getSupportedChainIds = (onlyEnabled = true): number[] => {
  const ids = Object.keys(CHAINS).map(n => Number(n))
  return onlyEnabled ? ids.filter(id => CHAINS[id]?.enabled) : ids
}

export const isSupportedChainId = (id: number): id is SupportedChainId =>
  Object.prototype.hasOwnProperty.call(CHAINS, id)

/** ---------- Backward compatibility ---------- */
export const NETWORKS = CHAINS

/** ---------- Re-exports from centralized chain config ---------- */
export { CHAIN_NAMES, CHAIN_BY_ID, SUPPORTED_CHAINS as CHAIN_META_LIST } from '@/config/chains'

/** ---------- Legacy functions (maintained for compatibility) ---------- */
export function enabledChainIds(): import('@/lib/chains').SupportedChainId[] {
  return Object.values(CHAINS).filter(c => c.enabled).map(c => c.id) as import('@/lib/chains').SupportedChainId[]
}

export function explorerTx(chainId: number, tx: string) {
  const e = CHAINS[chainId]?.explorer || ''
  return e ? `${e}/tx/${tx}` : '#'
}
