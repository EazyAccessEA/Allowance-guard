// lib/chains.ts
import { createPublicClient, http, fallback, type Transport, type PublicClient } from 'viem'
import { mainnet, arbitrum, base } from 'viem/chains'
import { CHAINS, type RpcEndpoint } from './networks'

// simple in-memory circuit breaker (prod: use Redis if you want cross-instance sharing)
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

function makeTransport(endpoints: RpcEndpoint[]): Transport {
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
        batch: true,
        retryCount: 0,     // we'll own retry policy outside
        onFetchResponse: () => { /* success clears ban */ if (!notBanned(ep.url)) ban.delete(ep.url) },
        onFetchError: () => { punish(ep.url) },  // mark as bad
      })
    )
  return fallback(sorted, { rank: true, retryCount: 0 })
}

const MAP: Record<number, unknown> = { 1: mainnet, 42161: arbitrum, 8453: base }

const cache = new Map<number, PublicClient>()
export function clientFor(id: 1|42161|8453): PublicClient {
  const hit = cache.get(id); if (hit) return hit
  const cfg = CHAINS[id]
  const chain = MAP[id]
  const t = makeTransport(cfg.rpcs)
  const c = createPublicClient({ chain, transport: t })
  cache.set(id, c)
  return c
}