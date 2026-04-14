// lib/chains.ts
import { createPublicClient, http, fallback, type Transport, type PublicClient, type Chain } from 'viem'
import {
  mainnet, arbitrum, base, optimism, polygon, avalanche, bsc, fantom,
  zkSync, polygonZkEvm, mantle, gnosis, linea, scroll, celo,
  blast, cronos, moonbeam, aurora, opBNB, manta, mode, taiko,
  metis, kava, zetachain, worldchain,
} from 'viem/chains'
import { CHAINS, type RpcEndpoint } from './networks'
import { incrRpc } from '@/lib/metrics'

// In-memory RPC circuit breaker. Resets on every serverless cold start,
// so on Vercel it's effectively per-request. viem's fallback() transport
// already handles per-request RPC failover — this adds a warmup optimisation.
// TODO (Council #34): move to Redis for cross-instance persistence.
const ban: Map<string, number> = new Map() // key: url -> unix ms expiry

function notBanned(url: string) {
  const until = ban.get(url) || 0
  return Date.now() > until
}
function punish(url: string, ms = 60_000) {
  const now = Date.now()
  const prev = ban.get(url) || 0
  // extend ban window on repeated failures
  const add = Math.min(ms * 4, prev > now ? (prev - now) * 2 : ms)
  ban.set(url, now + add)
}

function makeTransport(endpoints: RpcEndpoint[], chainId: number): Transport {
  // order by (not banned first) then by weight desc
  const sorted = endpoints
    .slice()
    .sort((a, b) => {
      const nb = Number(notBanned(b.url)) - Number(notBanned(a.url))
      if (nb !== 0) return nb
      return (b.weight || 1) - (a.weight || 1)
    })
    .map(ep =>
      http(ep.url, {
        timeout: ep.timeoutMs ?? 12_000,
        batch: false,
        retryCount: 0,     // we'll own retry policy outside
        onFetchResponse: async () => { 
          if (!notBanned(ep.url)) ban.delete(ep.url); 
          await incrRpc(chainId) 
        },
      })
    )
  return fallback(sorted, { rank: true, retryCount: 0 })
}

const MAP: Record<number, Chain> = {
  // Phase 9.5 (original 15)
  1: mainnet,
  42161: arbitrum,
  8453: base,
  10: optimism,
  137: polygon,
  43114: avalanche,
  56: bsc,
  250: fantom,
  324: zkSync,
  1101: polygonZkEvm,
  5000: mantle,
  100: gnosis,
  59144: linea,
  534352: scroll,
  42220: celo,
  // Phase 9.6 expansion (+12 — Council #32 P0 fix)
  81457: blast,
  25: cronos,
  1284: moonbeam,
  1313161554: aurora,
  204: opBNB,
  169: manta,
  34443: mode,
  167000: taiko,
  1088: metis,
  2222: kava,
  7000: zetachain,
  480: worldchain,
}

export type SupportedChainId =
  | 1 | 42161 | 8453 | 10 | 137 | 43114 | 56 | 250 | 324 | 1101
  | 5000 | 100 | 59144 | 534352 | 42220
  | 81457 | 25 | 1284 | 1313161554 | 204 | 169 | 34443 | 167000
  | 1088 | 2222 | 7000 | 480

const cache = new Map<number, PublicClient>()
export function clientFor(id: SupportedChainId): PublicClient {
  const hit = cache.get(id); if (hit) return hit
  const cfg = CHAINS[id]
  const chain = MAP[id]
  const t = makeTransport(cfg.rpcs, id)
  const c = createPublicClient({ chain, transport: t })
  cache.set(id, c)
  return c
}

// Circuit breaker helper - call this when RPC calls fail
export async function markRpcFailed(url: string, chainId: number) {
  punish(url)
  await incrRpc(chainId)
}

// Circuit breaker helper - call this when RPC calls succeed
export function markRpcSuccess(url: string) {
  if (!notBanned(url)) ban.delete(url)
}