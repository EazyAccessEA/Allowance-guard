// lib/networks.ts
export type RpcEndpoint = { url: string; weight?: number; timeoutMs?: number }
export type ChainCfg = {
  id: 1 | 42161 | 8453,
  name: 'Ethereum' | 'Arbitrum' | 'Base',
  symbol: 'ETH' | 'ETH' | 'ETH',
  rpcs: RpcEndpoint[],
  explorer: string,                  // base URL
  enabled: boolean
}

function envList(key: string, fallback: string[]): RpcEndpoint[] {
  const raw = (process.env[key] || '').trim()
  const arr = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : fallback
  return arr.map((url, i) => ({ url, weight: Math.max(1, 10 - i), timeoutMs: 12_000 }))
}

const disabledSet = new Set(
  (process.env.DISABLED_CHAINS || '')
    .split(',').map(s=>s.trim()).filter(Boolean).map(Number)
)

export const CHAINS: Record<number, ChainCfg> = {
  1: {
    id: 1, name: 'Ethereum', symbol: 'ETH',
    rpcs: envList('ETHEREUM_RPC_URL', [
      'https://eth.llamarpc.com',
      'https://rpc.ankr.com/eth',
      'https://cloudflare-eth.com'
    ]),
    explorer: 'https://etherscan.io',
    enabled: !disabledSet.has(1)
  },
  42161: {
    id: 42161, name: 'Arbitrum', symbol: 'ETH',
    rpcs: envList('ARBITRUM_RPC_URL', [
      'https://arb1.arbitrum.io/rpc',
      'https://rpc.ankr.com/arbitrum'
    ]),
    explorer: 'https://arbiscan.io',
    enabled: !disabledSet.has(42161)
  },
  8453: {
    id: 8453, name: 'Base', symbol: 'ETH',
    rpcs: envList('BASE_RPC_URL', [
      'https://mainnet.base.org',
      'https://rpc.ankr.com/base'
    ]),
    explorer: 'https://basescan.org',
    enabled: !disabledSet.has(8453)
  }
}

export function enabledChainIds(): Array<1|42161|8453> {
  return (Object.values(CHAINS).filter(c => c.enabled).map(c => c.id) as Array<1|42161|8453>)
}

export function explorerTx(chainId: number, tx: string) {
  const e = CHAINS[chainId]?.explorer || ''
  return e ? `${e}/tx/${tx}` : '#'
}
