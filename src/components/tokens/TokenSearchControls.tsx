'use client'
import { useEffect, useMemo, useState } from 'react'
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
    sort?: 'relevance'|'name'|'symbol'|'recent'
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
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <label className="text-xs text-white/60">Search</label>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, symbol, or address"
            className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>

        <div>
          <label className="text-xs text-white/60">Chain</label>
          <select
            value={chainId ?? ''}
            onChange={e => setChainId(e.target.value ? Number(e.target.value) : undefined)}
            className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none"
          >
            <option value="">All</option>
            {chains.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/60">Category</label>
          <select
            value={category ?? ''}
            onChange={e => setCategory(e.target.value || undefined)}
            className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none"
          >
            <option value="">All</option>
            {cats.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-white/60">Sort</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as 'relevance' | 'name' | 'symbol' | 'recent')}
            className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="recent">Recent</option>
            <option value="name">Name</option>
            <option value="symbol">Symbol</option>
          </select>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-white/80">
          <input 
            type="checkbox" 
            className="accent-white" 
            checked={verified} 
            onChange={e => setVerified(e.target.checked)} 
          />
          Verified only
        </label>
        <label className="inline-flex items-center gap-2 text-white/80">
          <input 
            type="checkbox" 
            className="accent-white" 
            checked={fuzzy} 
            onChange={e => setFuzzy(e.target.checked)} 
          />
          Fuzzy matching
        </label>

        <div className={`flex items-center gap-2 ${canScore ? '' : 'opacity-50 pointer-events-none'}`}>
          <span className="text-xs text-white/60">minScore</span>
          <input
            type="range" 
            min={0} 
            max={3} 
            step={0.05}
            value={minScore} 
            onChange={e => setMinScore(Number(e.target.value))}
          />
          <span className="text-xs text-white/70">{minScore.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
