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
 const [fuzzy, setFuzzy] = useState<boolean>(initial.fuzzy ?? true)
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

 // Disable minScore when fuzzy is off
 const canScore = useMemo(() => fuzzy && (dq?.length ?? 0) >= 3, [fuzzy, dq])

 return (
 <div className="bg-paper-sub rounded-2xl border border-ink-rule p-6 mb-8">
 <div className="flex items-center gap-2 mb-6">
 <div className="w-8 h-8 bg-amber-deep/10 rounded-lg flex items-center justify-center">
 <Search className="w-4 h-4 text-amber-deep" />
 </div>
 <h2 className="text-xl font-semibold text-ink">Search Tokens</h2>
 </div>
 
 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
 {/* Search Input */}
 <div className="lg:col-span-2">
 <label className="block text-sm font-medium text-ink mb-2">
 Search Query
 </label>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-muted" />
 <input
 value={q}
 onChange={e => setQ(e.target.value)}
 placeholder="Search by name, symbol, or address"
 className="w-full pl-10 pr-4 py-3 rounded-lg border border-ink-rule bg-paper-sub text-ink placeholder:text-ink-whisper focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep"
 />
 </div>
 </div>

 {/* Chain Filter */}
 <div>
 <label className="block text-sm font-medium text-ink mb-2">
 Blockchain
 </label>
 <select
 value={chainId ?? ''}
 onChange={e => setChainId(e.target.value ? Number(e.target.value) : undefined)}
 className="w-full px-3 py-3 rounded-lg border border-ink-rule bg-paper-sub text-ink focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep"
 >
 <option value="">All Networks</option>
 {chains.map(c => (
 <option key={c.id} value={c.id}>{c.name}</option>
 ))}
 </select>
 </div>

 {/* Category Filter */}
 <div>
 <label className="block text-sm font-medium text-ink mb-2">
 Category
 </label>
 <select
 value={category ?? ''}
 onChange={e => setCategory(e.target.value || undefined)}
 className="w-full px-3 py-3 rounded-lg border border-ink-rule bg-paper-sub text-ink focus:outline-none focus:ring-2 focus:ring-amber-deep focus:border-amber-deep"
 >
 <option value="">All Categories</option>
 {cats.map(c => (
 <option key={c.id} value={c.name}>{c.name}</option>
 ))}
 </select>
 </div>
 </div>

 {/* Advanced Options */}
 <div className="mt-6 pt-6 border-t border-ink-rule">
 <div className="flex flex-wrap items-center gap-6">
 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 id="verified"
 checked={verified}
 onChange={e => setVerified(e.target.checked)}
 className="w-4 h-4 text-amber-deep bg-paper-sub border-ink-rule rounded focus:ring-amber-deep"
 />
 <label htmlFor="verified" className="text-sm font-medium text-ink">
 Verified tokens only
 </label>
 </div>

 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 id="fuzzy"
 checked={fuzzy}
 onChange={e => setFuzzy(e.target.checked)}
 className="w-4 h-4 text-amber-deep bg-paper-sub border-ink-rule rounded focus:ring-amber-deep"
 />
 <label htmlFor="fuzzy" className="text-sm font-medium text-ink">
 Fuzzy search
 </label>
 </div>

 {canScore && (
 <div className="flex items-center gap-3">
 <label className="text-sm font-medium text-ink">
 Min Score:
 </label>
 <input
 type="range"
 min="0"
 max="3"
 step="0.1"
 value={minScore}
 onChange={e => setMinScore(Number(e.target.value))}
 className="w-24"
 />
 <span className="text-sm text-ink-muted">{minScore.toFixed(1)}</span>
 </div>
 )}

 <div className="flex items-center gap-3">
 <label className="text-sm font-medium text-ink">
 Sort by:
 </label>
 <select
 value={sort}
 onChange={e => setSort(e.target.value as 'relevance' | 'name' | 'symbol' | 'recent')}
 className="px-3 py-1.5 rounded border border-ink-rule bg-paper-sub text-ink focus:outline-none focus:ring-2 focus:ring-amber-deep"
 >
 <option value="relevance">Relevance</option>
 <option value="name">Name</option>
 <option value="symbol">Symbol</option>
 <option value="recent">Recent</option>
 </select>
 </div>
 </div>
 </div>
 </div>
 )
}