'use client'
import { useState, useEffect, useMemo } from 'react'
import { Search, AlertTriangle } from 'lucide-react'
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
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 border border-blue-200 rounded-full text-blue-700 font-medium">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span>Searching tokens...</span>
          </div>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-8 animate-pulse">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-100 rounded w-1/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="flex gap-3 mt-4">
                    <div className="h-6 bg-slate-100 rounded-full w-20"></div>
                    <div className="h-6 bg-slate-100 rounded-full w-24"></div>
                    <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800">Search Failed</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!data?.data?.length) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">No tokens found</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find what you&apos;re looking for.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
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
    <div className="space-y-8">
      {/* Results Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Search Results
            </h3>
            <p className="text-slate-600">
              {total} token{total !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 mb-1">Showing</div>
            <div className="text-lg font-semibold text-slate-700">
              {Math.min(total, offset + 1)}–{Math.min(total, offset + limit)} of {total}
            </div>
          </div>
        </div>
      </div>

      {/* Token Cards */}
      <div className="grid gap-6">
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-600">
              Page {page} of {pages}
            </div>
            <div className="flex items-center gap-3">
              <button 
                disabled={page <= 1}
                onClick={() => setOffset((page - 2) * limit)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                Previous
              </button>
              <button 
                disabled={page >= pages}
                onClick={() => setOffset(page * limit)}
                className="px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}