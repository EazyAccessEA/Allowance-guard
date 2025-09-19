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
  Shield,
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

const chainNames: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  137: 'Polygon',
  10: 'Optimism',
  43114: 'Avalanche'
}

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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-background-light rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">No allowances found</h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          This wallet has no token approvals. Run a scan to check for allowances across supported chains.
        </p>
        <Button 
          onClick={onRefresh}
          variant="primary"
        >
          Run Security Scan
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-24 bg-background-light rounded-full animate-pulse" />
          <div className="h-9 w-32 bg-background-light rounded-full animate-pulse" />
        </div>
        <FireartTableSkeleton rows={5} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            onClick={selectRisky} 
            variant="secondary" 
            size="sm"
            className="flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Select Risky ({risky.length})
          </Button>
          <Button 
            onClick={handleBulk} 
            disabled={busy || !selectedRows.length || !revokeAllowed || !canRevoke} 
            variant="primary"
            size="sm"
            loading={busy}
            className="flex items-center gap-2"
            title={!canRevoke ? 'View-only access' : !revokeAllowed ? 'Connect the selected wallet to revoke' : ''}
          >
            <Zap className="w-4 h-4" />
            {busy ? `Revoking… ${progress ?? ''}` : `Revoke Selected (${selectedRows.length})`}
          </Button>
        </div>
        
        {selectedRows.length > 0 && (
          <Badge variant="info" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {selectedRows.length} selected
          </Badge>
        )}
      </div>

      {/* Table */}
      <div className="border border-border-default rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table" aria-label="Token allowances">
            <thead className="bg-background-light border-b border-border-default">
              <tr>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">
                  <span className="sr-only">Select</span>
                </th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Chain</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Token</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Spender</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Standard</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Amount</th>
                <th scope="col" className="px-4 py-3 text-left font-medium text-text-secondary">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default">
              {data.map((r, i) => (
                <tr key={i} className="hover:bg-background-light/50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      checked={!!sel[keyOf(r)]} 
                      onChange={() => toggle(r)}
                      className="rounded border-border-default text-primary-accent focus:ring-primary-accent"
                    />
                  </td>
                  
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">
                      {chainNames[r.chain_id] || `Chain ${r.chain_id}`}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-text-primary">
                        {r.token_symbol || r.token_name || 'Unknown'}
                      </span>
                      <span className="text-xs text-text-muted font-mono">
                        {r.token_address.slice(0, 6)}...{r.token_address.slice(-4)}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-text-primary">
                        {r.spender_label || 'Unknown Contract'}
                      </span>
                      <span className="text-xs text-text-muted font-mono">
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
                  
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {r.standard}
                    </Badge>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.is_unlimited ? (
                        <Badge variant="danger" className="text-xs">
                          ∞ Unlimited
                        </Badge>
                      ) : (
                        <span className="font-mono text-text-primary">
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
                  
                  <td className="px-4 py-3">
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