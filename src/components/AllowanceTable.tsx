'use client'
import { useState, useMemo } from 'react'
import { useBulkRevoke } from '@/hooks/useBulkRevoke'
import { HexButton } from './HexButton'
import { HexBadge } from './HexBadge'
import dynamic from 'next/dynamic'

const SupportNudge = dynamic(() => import('@/components/SupportNudge'), { ssr: false })

type Row = {
  chain_id: number
  token_address: string
  spender_address: string
  token_name?: string | null
  token_symbol?: string | null
  token_decimals?: number | null
  spender_label?: string | null
  spender_trust?: 'official'|'curated'|'community'|null
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
  connectedAddress,
  canRevoke = true
}: {
  data: Row[]
  onRefresh: () => Promise<void>
  selectedWallet: string | null
  connectedAddress: string | undefined
  canRevoke?: boolean
}) {
  const [sel, setSel] = useState<Record<string, boolean>>({})
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [showNudge, setShowNudge] = useState(false)
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
    setShowNudge(true)
  }

  if (!data?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-base text-stone mb-4">No allowances found for this wallet.</p>
        <p className="text-sm text-stone mb-6">Run a scan to check for token approvals across supported chains.</p>
        <HexButton 
          onClick={onRefresh}
          variant="primary"
          size="md"
        >
          Run Scan
        </HexButton>
      </div>
    )
  }

  // Add empty state with guidance for filtered results
  const hasFilteredResults = data.length === 0 && selectedRows.length === 0
  if (hasFilteredResults) {
    return (
      <div className="mt-6 rounded border border-line p-4 text-sm text-stone">
        No approvals found matching this filter. Try disabling &quot;Risky only&quot; or scan another wallet.
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center gap-3">
        <HexButton onClick={selectRisky} size="sm" variant="ghost">Select risky</HexButton>
        <HexButton 
          onClick={handleBulk} 
          disabled={busy || !selectedRows.length || !revokeAllowed || !canRevoke} 
          size="sm"
          title={!canRevoke ? 'View-only access' : !revokeAllowed ? 'Connect the selected wallet to revoke' : ''}
          aria-label={`Revoke ${selectedRows.length} selected token approvals`}
        >
          {busy ? `Revoking… ${progress ?? ''}` : `Revoke Selected (${selectedRows.length})`}
        </HexButton>
      </div>
      <div className="overflow-x-auto border-2 border-ag-line">
        <table className="w-full text-sm" role="table" aria-label="Token allowances">
          <thead className="bg-ag-panel">
            <tr>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Chain</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Token</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Spender</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Std</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Type</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Amount</th>
              <th scope="col" className="px-4 py-3 text-left font-medium text-ag-text">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ag-line">
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-ag-panel-hover transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    checked={!!sel[keyOf(r)]} 
                    onChange={() => toggle(r)}
                    className="border-ag-line text-ag-brand focus:ring-ag-brand"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-ag-text">{r.chain_id}</td>
                <td className="px-4 py-3 font-mono text-ag-muted">
                  {r.token_symbol ? (
                    <span className="font-sans">{r.token_symbol}</span>
                  ) : r.token_name ? (
                    <span className="font-sans">{r.token_name}</span>
                  ) : (
                    r.token_address
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-ag-muted">
                  {r.spender_label ? (
                    <span className="font-sans">
                      {r.spender_label}
                      {r.spender_trust && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] uppercase tracking-wide text-gray-600">{r.spender_trust}</span>}
                    </span>
                  ) : (
                    r.spender_address
                  )}
                </td>
                <td className="px-4 py-3 text-ag-muted">{r.standard}</td>
                <td className="px-4 py-3 text-ag-muted">{r.allowance_type}</td>
                <td className="px-4 py-3 font-mono text-ag-text">
                  {(() => {
                    if (r.is_unlimited) return '∞'
                    if (r.token_decimals != null) {
                      const amountBigInt = BigInt(r.amount)
                      const zeroBigInt = BigInt(0)
                      const displayAmount = amountBigInt === zeroBigInt ? '0' :
                        Number((amountBigInt / BigInt(10 ** r.token_decimals)).toString())
                      return displayAmount
                    }
                    return r.amount
                  })()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.is_unlimited && <HexBadge variant="danger" size="sm">UNLIMITED</HexBadge>}
                    {r.risk_flags?.includes('STALE') && <HexBadge variant="warn" size="sm">STALE</HexBadge>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showNudge && <SupportNudge when="after-revoke" />}
    </div>
  )
}
