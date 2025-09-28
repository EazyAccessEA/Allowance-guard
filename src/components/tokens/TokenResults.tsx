'use client'
import { useEffect, useMemo, useState } from 'react'
import TokenResultCard from './TokenResultCard'

type Token = {
  chainId: number
  tokenAddress: string
  name: string
  symbol: string
  decimals: number | null
  standard: 'ERC20' | 'ERC721' | 'ERC1155'
  verified: boolean
  categories: string[]
  score?: number
}
type ChainLite = { id: number; name: string; symbol: string }

function qs(params: Record<string, string | number | boolean | undefined>) {
  const s = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === '' || v === null) return
    s.set(k, String(v))
  })
  return s.toString()
}

type SearchState = {
  q?: string
  chainId?: number
  category?: string
  verified?: boolean
  fuzzy?: boolean
  minScore?: number
  sort?: 'relevance' | 'name' | 'symbol' | 'recent'
  offset?: number
  setOffset?: (n: number) => void
}

export default function TokenResults({ state }: { state: SearchState }) {
  const [data, setData] = useState<{data: Token[]; pagination: {total: number; limit: number; offset: number}} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [chains, setChains] = useState<Record<number, ChainLite>>({})

  // load chains map (for badges)
  useEffect(() => { 
    (async () => {
      const r = await fetch('/api/chains', { cache: 'no-store' })
        .then(r => r.json())
        .catch(() => null)
      const map: Record<number, ChainLite> = {}
      r?.chains?.forEach((c: ChainLite) => { map[c.id] = c })
      setChains(map)
    })()
  }, [])

  // fetch results
  const params = useMemo(() => ({
    q: state.q, 
    chainId: state.chainId, 
    category: state.category,
    verified: state.verified, 
    sort: state.sort, 
    fuzzy: state.fuzzy,
    minScore: state.minScore, 
    limit: 20, 
    offset: state.offset ?? 0
  }), [state])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    fetch(`/api/tokens/search?${qs(params)}`, { signal: controller.signal, cache: 'no-store' })
      .then(r => r.json())
      .then(j => { 
        if (!j?.success) throw new Error(j?.error || 'Search failed')
        setData(j)
      })
      .catch(e => { 
        if (e.name !== 'AbortError') setError(e.message || 'Error')
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [params])

  // URL sync (so back/forward works)
  useEffect(() => {
    const url = `/tokens?${qs({ ...params, offset: state.offset ?? 0 })}`
    window.history.replaceState(null, '', url)
  }, [params, state.offset])

  if (loading && !data) {
    return (
      <div className="mt-4 grid gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 p-4">
        Error: {error}
      </div>
    )
  }
  
  if (!data || data.data.length === 0) {
    return (
      <div className="mt-6 text-white/70">No tokens match your filters.</div>
    )
  }

  const total = data.pagination.total
  const offset = data.pagination.offset
  const limit = data.pagination.limit
  const page = Math.floor(offset / limit) + 1
  const pages = Math.max(1, Math.ceil(total / limit))

  const setOffset = (n: number) => state.setOffset?.(n)

  return (
    <div className="mt-4">
      <div className="grid gap-3">
        {data.data.map(t => (
          <TokenResultCard
            key={`${t.chainId}:${t.tokenAddress}`}
            name={t.name} 
            symbol={t.symbol} 
            tokenAddress={t.tokenAddress}
            chainName={chains[t.chainId]?.name ?? `Chain ${t.chainId}`}
            verified={t.verified} 
            categories={t.categories} 
            score={t.score}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-white/80">
        <div>
          Showing {Math.min(total, offset + 1)}–{Math.min(total, offset + limit)} of {total}
        </div>
        <div className="flex gap-2">
          <button 
            disabled={page <= 1}
            onClick={() => setOffset((page - 2) * limit)}
            className="px-3 py-1.5 rounded border border-white/15 disabled:opacity-40"
          >
            Prev
          </button>
          <button 
            disabled={page >= pages}
            onClick={() => setOffset(page * limit)}
            className="px-3 py-1.5 rounded border border-white/15 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
