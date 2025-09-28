'use client'

type Props = {
  name: string
  symbol: string
  tokenAddress: string
  chainName: string
  verified: boolean
  categories: string[]
  score?: number
}

export default function TokenResultCard(p: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 md:p-5 hover:bg-white/10 transition">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">
            {p.name} <span className="text-white/70">({p.symbol})</span>
          </div>
          <div className="text-xs text-white/60 break-all">{p.tokenAddress}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-2 py-0.5 text-xs rounded bg-black/40 text-white/80 border border-white/10">
              {p.chainName}
            </span>
            {p.verified && (
              <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            )}
            {p.categories?.map(c => (
              <span 
                key={c} 
                className="px-2 py-0.5 text-xs rounded bg-white/10 text-white/80 border border-white/15"
              >
                {c}
              </span>
            ))}
            {typeof p.score === 'number' && (
              <span className="px-2 py-0.5 text-xs rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                Score {p.score.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
