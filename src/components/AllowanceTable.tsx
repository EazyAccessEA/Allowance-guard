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
      <div className="mb-3 flex items-center gap-2">
        <button onClick={selectRisky} className="rounded border px-3 py-1 text-xs">Select risky</button>
        <button onClick={handleBulk} disabled={busy || !selectedRows.length || !revokeAllowed}
                className="rounded border px-3 py-1 text-xs">
          {busy ? `Revoking… ${progress ?? ''}` : `Revoke Selected (${selectedRows.length})`}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left">
            <tr>
              <th></th><th>Chain</th><th>Token</th><th>Spender</th><th>Std</th><th>Type</th>
              <th>Amount</th><th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-t">
                <td>
                  <input type="checkbox" checked={!!sel[keyOf(r)]} onChange={() => toggle(r)} />
                </td>
                <td>{r.chain_id}</td>
                <td className="font-mono">{r.token_address}</td>
                <td className="font-mono">{r.spender_address}</td>
                <td>{r.standard}</td>
                <td>{r.allowance_type}</td>
                <td className="font-mono">{r.amount}</td>
                <td className="space-x-1">
                  {r.is_unlimited && <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">UNLIMITED</span>}
                  {r.risk_flags?.includes('STALE') && <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">STALE</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
