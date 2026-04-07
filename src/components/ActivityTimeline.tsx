'use client'
import { useEffect, useState, useCallback } from 'react'
import { explorerTx } from '@/lib/networks'
import { Loader2 } from 'lucide-react'

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

function truncateAddress(addr: string) {
  if (addr.length <= 14) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export default function ActivityTimeline({ wallet }: { wallet: string }) {
  const [items, setItems] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await fetch(`/api/receipts?wallet=${wallet}`)
      if (!r.ok) throw new Error('Failed to load activity')
      const j = await r.json()
      setItems(j.receipts || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load activity')
    } finally {
      setLoading(false)
    }
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
      <h2 className="text-base font-semibold text-text-primary dark:text-secondary-100">Activity</h2>

      {loading && (
        <div className="flex items-center gap-2 mt-3 text-sm text-text-tertiary dark:text-secondary-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading activity...
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
          <button onClick={load} className="ml-2 underline">Retry</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm mt-3 text-text-tertiary dark:text-secondary-400">
          No recent revocations yet.
        </div>
      )}

      <div className="mt-3 space-y-3">
        {items.map((r) => {
          const url = explorerTx(r.chain_id, r.tx_hash)
          const badge =
            r.status === 'verified' ? 'bg-semantic-success-50 dark:bg-semantic-success-900/20 text-semantic-success-700 dark:text-semantic-success-300 border border-semantic-success-200 dark:border-semantic-success-800' :
            r.status === 'pending'  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800' :
            r.status === 'mismatch' ? 'bg-semantic-warning-50 dark:bg-semantic-warning-900/20 text-semantic-warning-700 dark:text-semantic-warning-300 border border-semantic-warning-200 dark:border-semantic-warning-800' :
            'bg-semantic-error-50 dark:bg-semantic-error-900/20 text-semantic-error-700 dark:text-semantic-error-300 border border-semantic-error-200 dark:border-semantic-error-800'
          return (
            <div key={r.id} className="rounded-lg border border-secondary-700 bg-background-secondary dark:bg-secondary-800 px-4 py-3 text-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="font-medium text-text-primary dark:text-secondary-100">Revoke &middot; chain {r.chain_id} &middot; {r.standard}</div>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${badge}`}>{r.status.toUpperCase()}</span>
              </div>
              <div className="mt-2 text-xs text-text-tertiary dark:text-secondary-400 space-y-0.5">
                <div>Token: <span className="font-mono text-text-primary dark:text-secondary-200 break-all sm:break-normal">{truncateAddress(r.token_address)}</span></div>
                <div>Spender: <span className="font-mono text-text-primary dark:text-secondary-200 break-all sm:break-normal">{truncateAddress(r.spender_address)}</span></div>
                <div>Pre: <span className="font-mono text-text-primary dark:text-secondary-200">{r.pre_amount}</span>{r.post_amount!=null && <> &middot; Post: <span className="font-mono text-text-primary dark:text-secondary-200">{r.post_amount}</span></>}</div>
              </div>
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-xs text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">View on explorer</a>
                {r.status !== 'verified' && (
                  <button onClick={() => verify(r.id)} className="rounded border border-secondary-700 dark:border-secondary-600 bg-secondary-900 dark:bg-secondary-100 text-white dark:text-secondary-900 px-3 py-1.5 min-h-[32px] text-xs hover:bg-secondary-800 dark:hover:bg-secondary-200 transition-colors">Verify now</button>
                )}
                {r.error && <span className="text-xs text-semantic-error-600 dark:text-semantic-error-400">Error: {r.error}</span>}
              </div>
              <div className="mt-2 text-[11px] text-text-tertiary dark:text-secondary-500">At {new Date(r.created_at).toLocaleString()}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
