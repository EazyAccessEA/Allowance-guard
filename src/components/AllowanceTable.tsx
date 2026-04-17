'use client'
import { useState, useMemo } from 'react'
import { useBulkRevoke } from '@/hooks/useBulkRevoke'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { FireartTableSkeleton } from './SkeletonLoader'
import dynamic from 'next/dynamic'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react'

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

import { CHAIN_NAMES } from '@/config/chains'

export default function AllowanceTable({
  data,
  onRefresh,
  selectedWallet,
  connectedAddress,
  canRevoke = true,
  loading = false
}: {
  data: Row[]
  onRefresh: () => Promise<void>
  selectedWallet: string | null
  connectedAddress: string | undefined
  canRevoke?: boolean
  loading?: boolean
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
      <div className="text-center py-12" role="region" aria-label="No allowances found">
        <div className="w-16 h-16 bg-paper-sub border border-semantic-success-600/40 rounded-2xl flex items-center justify-center mx-auto mb-4" aria-hidden="true">
          <ShieldCheck className="w-8 h-8 text-semantic-success-700" />
        </div>
        <h3 className="mobbin-heading-3 text-semantic-success-700 mb-2">No active approvals</h3>
        <p className="mobbin-body text-ink-muted mb-6 max-w-md mx-auto">
          Great news — your wallet has no token approvals. You&apos;re safe! Run a scan to double-check across all supported chains.
        </p>
        <Button
          onClick={onRefresh}
          variant="primary"
          aria-label="Run security scan to check for token approvals"
        >
          Run Security Scan
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4" role="region" aria-label="Loading token approvals">
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="h-9 w-24 bg-paper-sub rounded-full animate-pulse" />
          <div className="h-9 w-32 bg-paper-sub rounded-full animate-pulse" />
        </div>
        <div aria-live="polite" aria-label="Loading token approvals data">
          <FireartTableSkeleton rows={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3" role="toolbar" aria-label="Token approval actions">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <Button
            onClick={selectRisky}
            variant="secondary"
            size="sm"
            className="flex items-center justify-center gap-2 min-h-[44px]"
            aria-label={`Select ${risky.length} risky token approvals`}
          >
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            Select Risky ({risky.length})
          </Button>
          <Button
            onClick={handleBulk}
            disabled={busy || !selectedRows.length || !revokeAllowed || !canRevoke}
            variant="primary"
            size="sm"
            loading={busy}
            className="flex items-center justify-center gap-2 min-h-[44px]"
            aria-label={busy ? `Revoking ${progress ?? ''}` : `Revoke ${selectedRows.length} selected approvals`}
            aria-describedby={!canRevoke ? 'view-only-access' : !revokeAllowed ? 'connect-wallet-to-revoke' : undefined}
          >
            <Zap className="w-4 h-4" aria-hidden="true" />
            {busy ? `Revoking... ${progress ?? ''}` : `Revoke Selected (${selectedRows.length})`}
          </Button>
        </div>

        {selectedRows.length > 0 && (
          <Badge variant="info" className="flex items-center justify-center gap-1" role="status" aria-live="polite">
            <CheckCircle className="w-3 h-3" aria-hidden="true" />
            {selectedRows.length} selected
          </Badge>
        )}
      </div>

      {/* Hidden descriptions for screen readers */}
      <div className="sr-only">
        <div id="view-only-access">View-only access: Cannot revoke approvals</div>
        <div id="connect-wallet-to-revoke">Connect the selected wallet to revoke approvals</div>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3">
        {data.map((r, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 transition-colors duration-100 ${
              sel[keyOf(r)]
                ? 'border-amber-deep bg-paper-sub'
                : 'border-ink-rule bg-paper-deep/60'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!sel[keyOf(r)]}
                  onChange={() => toggle(r)}
                  className="rounded border-ink-rule text-amber-deep focus:ring-amber-deep min-w-[18px] min-h-[18px]"
                  aria-label={`Select ${r.token_symbol || r.token_name || 'Unknown'} token approval`}
                />
                <div>
                  <span className="font-medium text-ink">
                    {r.token_symbol || r.token_name || 'Unknown'}
                  </span>
                  <span className="text-xs text-ink-whisper font-mono ml-2">
                    {r.token_address.slice(0, 6)}...{r.token_address.slice(-4)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                {r.is_unlimited && (
                  <Badge variant="danger" className="text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    High
                  </Badge>
                )}
                {r.risk_flags?.includes('STALE') && (
                  <Badge variant="warning" className="text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Stale
                  </Badge>
                )}
                {!r.is_unlimited && !r.risk_flags?.includes('STALE') && (
                  <Badge variant="success" className="text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Safe
                  </Badge>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-ink-muted">Spender:</span>
                <span className="ml-1 font-medium text-ink">
                  {r.spender_label || `${r.spender_address.slice(0, 6)}...${r.spender_address.slice(-4)}`}
                </span>
              </div>
              <div>
                <span className="text-ink-muted">Chain:</span>
                <Badge variant="secondary" className="text-xs ml-1">
                  {CHAIN_NAMES[r.chain_id] || `${r.chain_id}`}
                </Badge>
              </div>
              <div>
                <span className="text-ink-muted">Amount:</span>
                <span className="ml-1 font-mono font-medium text-ink">
                  {r.is_unlimited ? '∞ Unlimited' : (() => {
                    if (r.token_decimals != null) {
                      const amountBigInt = BigInt(r.amount)
                      return amountBigInt === BigInt(0) ? '0' :
                        Number((amountBigInt / BigInt(10 ** r.token_decimals)).toString())
                    }
                    return r.amount
                  })()}
                </span>
              </div>
              <div>
                <span className="text-ink-muted">Type:</span>
                <Badge variant="outline" className="text-xs ml-1">{r.standard}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block border border-ink-rule rounded-xl overflow-hidden bg-paper-deep/60 shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Token allowances">
            <caption className="sr-only">Token approval allowances with risk assessment and management options</caption>
            <thead className="bg-paper-sub border-b border-ink-rule">
              <tr>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted w-10">
                  <span className="sr-only">Select for bulk action</span>
                </th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Chain</th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Token</th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Spender</th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Standard</th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-4 py-3.5 text-left font-medium text-ink-muted text-xs uppercase tracking-wider">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-rule">
              {data.map((r, i) => (
                <tr
                  key={i}
                  className={`transition-colors duration-100
                    ${sel[keyOf(r)]
                      ? 'bg-paper-sub'
                      : 'hover:bg-paper-sub'
                    }`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={!!sel[keyOf(r)]}
                      onChange={() => toggle(r)}
                      className="rounded border-ink-rule text-amber-deep focus:ring-amber-deep"
                      aria-label={`Select ${r.token_symbol || r.token_name || 'Unknown'} token approval for ${r.spender_label || 'Unknown Contract'}`}
                    />
                  </td>

                  <td className="px-4 py-3.5">
                    <Badge variant="secondary" className="text-xs">
                      {CHAIN_NAMES[r.chain_id] || `Chain ${r.chain_id}`}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-ink">
                        {r.token_symbol || r.token_name || 'Unknown'}
                      </span>
                      <span className="text-xs text-ink-whisper font-mono">
                        {r.token_address.slice(0, 6)}...{r.token_address.slice(-4)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                      <span className="font-medium text-ink">
                        {r.spender_label || 'Unknown Contract'}
                      </span>
                      <span className="text-xs text-ink-whisper font-mono">
                        {r.spender_address.slice(0, 6)}...{r.spender_address.slice(-4)}
                      </span>
                      {r.spender_trust && (
                        <Badge
                          variant={r.spender_trust === 'official' ? 'success' : 'secondary'}
                          className="text-xs mt-1 w-fit"
                        >
                          {r.spender_trust}
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="text-xs">
                      {r.standard}
                    </Badge>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {r.is_unlimited ? (
                        <Badge variant="danger" className="text-xs">
                          &infin; Unlimited
                        </Badge>
                      ) : (
                        <span className="font-mono text-ink">
                          {(() => {
                            if (r.token_decimals != null) {
                              const amountBigInt = BigInt(r.amount)
                              const zeroBigInt = BigInt(0)
                              const displayAmount = amountBigInt === zeroBigInt ? '0' :
                                Number((amountBigInt / BigInt(10 ** r.token_decimals)).toString())
                              return displayAmount
                            }
                            return r.amount
                          })()}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      {r.is_unlimited && (
                        <Badge variant="danger" className="text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          High Risk
                        </Badge>
                      )}
                      {r.risk_flags?.includes('STALE') && (
                        <Badge variant="warning" className="text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Stale
                        </Badge>
                      )}
                      {!r.is_unlimited && !r.risk_flags?.includes('STALE') && (
                        <Badge variant="success" className="text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Safe
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNudge && <SupportNudge when="after-revoke" />}
    </div>
  )
}
