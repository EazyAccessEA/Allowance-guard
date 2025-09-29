'use client'
import { useState, useEffect, useMemo } from 'react'
import qs from 'qs'
import TokenResultCard from './TokenResultCard'

type Token = {
  chainId: number
  tokenAddress: string
  name: string
  symbol: string
  decimals: number | null
  standard: 'ERC20' | 'ERC721' | 'ERC1155'
  description: string | null
  website: string | null
  logoUrl: string | null
  verified: boolean
  categories: string[]
  score?: number
}

type ChainLite = { id: number; name: string; symbol: string }

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
    fetch(`/api/tokens/search?${qs.stringify(params)}`, { signal: controller.signal, cache: 'no-store' })
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
    const url = `/tokens?${qs.stringify({ ...params, offset: state.offset ?? 0 })}`
    window.history.replaceState(null, '', url)
  }, [params, state.offset])

  if (loading && !data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-background-light rounded-xl border border-border-default p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-text-secondary/20 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-text-secondary/20 rounded w-1/3"></div>
                <div className="h-4 bg-text-secondary/10 rounded w-1/4"></div>
                <div className="h-3 bg-text-secondary/10 rounded w-full"></div>
                <div className="flex gap-2 mt-3">
                  <div className="h-5 bg-text-secondary/10 rounded w-16"></div>
                  <div className="h-5 bg-text-secondary/10 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-semantic-danger/5 border border-semantic-danger/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-semantic-danger/10 rounded-lg flex items-center justify-center">
            <span className="text-semantic-danger">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-semantic-danger">Search Failed</h3>
        </div>
        <p className="text-text-secondary">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-semantic-danger text-white rounded-lg text-sm font-medium hover:bg-semantic-danger/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-text-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No tokens found</h3>
        <p className="text-text-secondary mb-6">Try adjusting your search criteria or filters</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-primary-accent text-white rounded-lg font-medium hover:bg-primary-accent/90"
        >
          Clear Filters
        </button>
      </div>
    )
  }

  const total = data.pagination.total
  const limit = data.pagination.limit
  const offset = data.pagination.offset
  const page = Math.floor(offset / limit) + 1
  const pages = Math.ceil(total / limit)

  const setOffset = (n: number) => state.setOffset?.(n)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Search Results
          </h3>
          <p className="text-sm text-text-secondary">
            {total} token{total !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* Token Cards */}
      <div className="grid gap-4">
        {data.data.map(t => (
          <TokenResultCard
            key={`${t.chainId}:${t.tokenAddress}`}
            name={t.name} 
            symbol={t.symbol} 
            tokenAddress={t.tokenAddress}
            chainName={chains[t.chainId]?.name ?? `Chain ${t.chainId}`}
            verified={t.verified} 
            categories={t.categories} 
            description={t.description}
            website={t.website}
            logoUrl={t.logoUrl}
            score={t.score}
          />
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-border-default">
          <div className="text-sm text-text-secondary">
            Showing {Math.min(total, offset + 1)}–{Math.min(total, offset + limit)} of {total} results
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={page <= 1}
              onClick={() => setOffset((page - 2) * limit)}
              className="px-4 py-2 rounded-lg border border-border-default bg-background-light text-text-primary hover:bg-text-secondary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-text-secondary">
              Page {page} of {pages}
            </span>
            <button 
              disabled={page >= pages}
              onClick={() => setOffset(page * limit)}
              className="px-4 py-2 rounded-lg border border-border-default bg-background-light text-text-primary hover:bg-text-secondary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}