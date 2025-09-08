'use client'
import { useState, useMemo } from 'react'
import { useBulkRevoke } from '@/hooks/useBulkRevoke'

type Row = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
  risk_score: number
  risk_flags: string[]
}

export default function AllowanceTable({
  data,
  onRefresh,
  selectedWallet,
  connectedAddress
}: {
  data: Row[]
  onRefresh: () => Promise<void>
  selectedWallet: string | null
  connectedAddress: string | undefined
}) {
  const [sel, setSel] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const { revokeMany } = useBulkRevoke(selectedWallet)
  
  const revokeAllowed =
    !!selectedWallet &&
    !!connectedAddress &&
    selectedWallet.toLowerCase() === connectedAddress.toLowerCase()

  function keyOf(r: Row) {
    return `${r.chain_id}:${r.token_address}:${r.spender_address}:${r.allowance_type}`
  }
  function toggle(r: Row) {
    const k = keyOf(r); setSel(s => ({ ...s, [k]: !s[k] }))
  }
  const selectedRows = useMemo(() => data.filter(r => sel[keyOf(r)]), [sel, data])
  const risky = useMemo(() => data.filter(r => r.is_unlimited || (r.risk_flags||[]).includes('STALE')), [data])

  async function selectRisky() {
    const next: Record<string, boolean> = {}
    for (const r of risky) next[keyOf(r)] = true
    setSel(next)
  }

  async function handleBulk() {
    if (!selectedRows.length) return
    setBusy(true)
    setProgress(`0 / ${selectedRows.length}`)
    await revokeMany(selectedRows, (i, total) => setProgress(`${i} / ${total}`))
    setBusy(false)
    setProgress(null)
    await onRefresh()
  }

  if (!data?.length) return <div className="text-sm text-gray-600">No allowances found.</div>

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <button onClick={selectRisky} className="btn-secondary text-xs">Select risky</button>
        <button onClick={handleBulk} disabled={busy || !selectedRows.length || !revokeAllowed}
                className="btn-primary text-xs">
          {busy ? `Revoking… ${progress ?? ''}` : `Revoke Selected (${selectedRows.length})`}
        </button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-reown-gray-200 dark:border-reown-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-reown-gray-50 dark:bg-reown-gray-800">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300"></th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Chain</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Token</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Spender</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Std</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Type</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Amount</th>
              <th className="px-4 py-3 text-left font-medium text-reown-gray-700 dark:text-reown-gray-300">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-reown-gray-200 dark:divide-reown-gray-700">
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-reown-gray-50 dark:hover:bg-reown-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={!!sel[keyOf(r)]} 
                    onChange={() => toggle(r)}
                    className="rounded border-reown-gray-300 text-reown-blue-600 focus:ring-reown-blue-500"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-reown-gray-900 dark:text-white">{r.chain_id}</td>
                <td className="px-4 py-3 font-mono text-reown-gray-600 dark:text-reown-gray-300">{r.token_address}</td>
                <td className="px-4 py-3 font-mono text-reown-gray-600 dark:text-reown-gray-300">{r.spender_address}</td>
                <td className="px-4 py-3 text-reown-gray-600 dark:text-reown-gray-300">{r.standard}</td>
                <td className="px-4 py-3 text-reown-gray-600 dark:text-reown-gray-300">{r.allowance_type}</td>
                <td className="px-4 py-3 font-mono text-reown-gray-900 dark:text-white">{r.amount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.is_unlimited && <span className="badge badge-error">UNLIMITED</span>}
                    {r.risk_flags?.includes('STALE') && <span className="badge badge-warning">STALE</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
