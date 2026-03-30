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
 * NOTE: For Task 1.1 we keep your current 3 chains only.
 * Task 1.2 will append Optimism/Polygon/Avalanche/BSC.
 */
export const CHAINS: Record<number, ChainCfg> = {
  1: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpcs: envList('ETHEREUM_RPC_URLS', [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth'
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
      'https://rpc.ankr.com/arbitrum'
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
      'https://rpc.ankr.com/base'
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
      'https://rpc.ankr.com/optimism'
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
      'https://rpc.ankr.com/polygon'
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
      'https://rpc.ankr.com/avalanche'
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
      'https://rpc.ankr.com/bsc'
    ]),
    explorer: 'https://bscscan.com',
    enabled: !disabledSet.has('56')
  }
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

/** ---------- Legacy functions (maintained for compatibility) ---------- */
export function enabledChainIds(): Array<1|42161|8453|10|137|43114|56> {
  return (Object.values(CHAINS).filter(c => c.enabled).map(c => c.id) as Array<1|42161|8453|10|137|43114|56>)
}

export function explorerTx(chainId: number, tx: string) {
  const e = CHAINS[chainId]?.explorer || ''
  return e ? `${e}/tx/${tx}` : '#'
}
