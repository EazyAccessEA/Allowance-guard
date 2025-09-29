'use client'
import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

type Chain = { id: number; name: string; symbol: string }
type Category = { id: number; name: string }

type Props = {
  initial: {
    q?: string
    chainId?: number
    category?: string
    verified?: boolean
    fuzzy?: boolean
    minScore?: number
    sort?: 'relevance' | 'name' | 'symbol' | 'recent'
  }
  onChange: (state: Props['initial']) => void
}

export default function TokenSearchControls({ initial, onChange }: Props) {
  const [q, setQ] = useState(initial.q ?? '')
  const [chainId, setChainId] = useState<number|undefined>(initial.chainId)
  const [category, setCategory] = useState<string|undefined>(initial.category)
  const [verified, setVerified] = useState<boolean>(!!initial.verified)
  const [fuzzy, setFuzzy] = useState<boolean>(true) // Always enabled for better UX
  const [minScore, setMinScore] = useState<number>(initial.minScore ?? 0)
  const [sort, setSort] = useState<Props['initial']['sort']>(initial.sort ?? (q ? 'relevance' : 'recent'))

  const dq = useDebounce(q, 300)

  const [chains, setChains] = useState<Chain[]>([])
  const [cats, setCats] = useState<Category[]>([])

  useEffect(() => { 
    (async () => {
      const c = await fetch('/api/chains', { cache: 'no-store' })
        .then(r => r.json())
        .catch(() => null)
      setChains(c?.chains?.map((x: { id: number; name: string; symbol: string }) => ({ id: x.id, name: x.name, symbol: x.symbol })) ?? [])
      
      const k = await fetch('/api/tokens/categories', { cache: 'no-store' })
        .then(r => r.json())
        .catch(() => null)
      setCats(k?.data?.map((x: { id: number; name: string }) => ({ id: x.id, name: x.name })) ?? [])
    })()
  }, [])

  useEffect(() => {
    onChange({ q: dq || undefined, chainId, category, verified, fuzzy, minScore, sort })
  }, [dq, chainId, category, verified, fuzzy, minScore, sort, onChange])

  // Show score slider when there's a search query
  const canScore = useMemo(() => (dq?.length ?? 0) >= 3, [dq])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Advanced Token Discovery</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Search and analyze tokens with enterprise-grade precision. Filter by verification status, 
          category, and blockchain to find exactly what you need.
        </p>
      </div>

      {/* Main Search Interface */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-900/5 p-8">
        {/* Search Input - Prominent */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Search Query
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search by name, symbol, or contract address..."
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chain Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Blockchain Network
            </label>
            <select
              value={chainId ?? ''}
              onChange={e => setChainId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Networks</option>
              {chains.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Token Category
            </label>
            <select
              value={category ?? ''}
              onChange={e => setCategory(e.target.value || undefined)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {cats.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Sort Results
            </label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'relevance' | 'name' | 'symbol' | 'recent')}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
            >
              <option value="relevance">Relevance</option>
              <option value="name">Name (A-Z)</option>
              <option value="symbol">Symbol</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Advanced Options */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center gap-8">
            {/* Verified Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="verified"
                checked={verified}
                onChange={e => setVerified(e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-slate-100 border-2 border-slate-300 rounded focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-0"
              />
              <label htmlFor="verified" className="text-sm font-semibold text-slate-700">
                Verified tokens only
              </label>
            </div>

            {/* Match Quality Slider */}
            {canScore && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-slate-700">
                  Match Quality:
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <span className="text-sm font-medium text-slate-600 min-w-[60px]">
                    {minScore === 0 ? 'All matches' : `${minScore.toFixed(1)}+`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}