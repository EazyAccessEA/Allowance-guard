// lib/chains.ts
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const CHAIN_CONFIG = {
  1:  { id: 1,     name: 'eth',  rpc: process.env.ETHEREUM_RPC_URL },
  42161: { id: 42161, name: 'arb',  rpc: process.env.ARBITRUM_RPC_URL },
  8453:  { id: 8453,  name: 'base', rpc: process.env.BASE_RPC_URL }
} as const

export function clientFor(chainId: 1|42161|8453) {
  const cfg = CHAIN_CONFIG[chainId]
  if (!cfg?.rpc) throw new Error(`RPC URL missing for chain ${chainId}`)
  return createPublicClient({ chain: { ...mainnet, id: cfg.id, name: cfg.name }, transport: http(cfg.rpc) })
}
