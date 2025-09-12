'use client'
import { useEffect, useState, useCallback } from 'react'

type Receipt = {
  id: number
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  pre_amount: string
  post_amount?: string | null
  tx_hash: string
  status: 'pending'|'verified'|'mismatch'|'failed'
  error?: string | null
  created_at: string
  verified_at?: string | null
}

function explorerFor(chainId: number) {
  if (chainId === 1) return 'https://etherscan.io'
  if (chainId === 42161) return 'https://arbiscan.io'
  if (chainId === 8453) return 'https://basescan.org'
  return ''
}

export default function ActivityTimeline({ wallet }: { wallet: string }) {
  const [items, setItems] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const r = await fetch(`/api/receipts?wallet=${wallet}`)
    const j = await r.json()
    setItems(j.receipts || [])
    setLoading(false)
  }, [wallet])

  async function verify(id: number) {
    await fetch('/api/receipts/verify', {
      method: 'POST',
      headers: { 'content-type':'application/json' },
      body: JSON.stringify({ id })
    })
    await load()
  }

  useEffect(() => { load() }, [load])

  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-ink">Activity</h2>
      {loading && <div className="text-sm mt-2 text-stone">Loading…</div>}
      {!loading && items.length === 0 && <div className="text-sm mt-2 text-stone">No recent revocations yet.</div>}
      <div className="mt-3 space-y-3">
        {items.map((r) => {
          const ex = explorerFor(r.chain_id)
          const url = ex ? `${ex}/tx/${r.tx_hash}` : '#'
          const badge =
            r.status === 'verified' ? 'bg-emerald/10 text-emerald border border-emerald/20' :
            r.status === 'pending'  ? 'bg-cobalt/10 text-cobalt border border-cobalt/20' :
            r.status === 'mismatch' ? 'bg-amber/10 text-amber border border-amber/20' : 'bg-crimson/10 text-crimson border border-crimson/20'
          return (
            <div key={r.id} className="rounded-md border border-line bg-mist px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium text-ink">Revoke • chain {r.chain_id} • {r.standard}</div>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge}`}>{r.status.toUpperCase()}</span>
              </div>
              <div className="mt-2 text-xs text-stone">
                <div>Token: <span className="font-mono text-ink">{r.token_address}</span></div>
                <div>Spender: <span className="font-mono text-ink">{r.spender_address}</span></div>
                <div>Pre: <span className="font-mono text-ink">{r.pre_amount}</span>{r.post_amount!=null && <> • Post: <span className="font-mono text-ink">{r.post_amount}</span></>}</div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-xs text-cobalt hover:text-cobalt-hover">View on explorer</a>
                {r.status !== 'verified' && (
                  <button onClick={() => verify(r.id)} className="rounded border border-line bg-white px-2 py-1 text-xs text-ink hover:bg-mist transition-colors">Verify now</button>
                )}
                {r.error && <span className="text-xs text-crimson">Error: {r.error}</span>}
              </div>
              <div className="mt-2 text-[11px] text-stone">At {new Date(r.created_at).toLocaleString()}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
