'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ArrowUpRight,
  Shield,
  Filter,
  ChevronDown,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WalletEvent {
  id: string
  wallet_address: string
  chain_id: number
  token_address: string
  spender_address: string
  event_type: 'approval_granted' | 'approval_changed' | 'approval_revoked' | 'risk_changed'
  previous_amount: string | null
  new_amount: string | null
  previous_unlimited: boolean | null
  new_unlimited: boolean | null
  risk_score: number | null
  previous_risk_score: number | null
  block_number: string | null
  tx_hash: string | null
  token_symbol: string | null
  spender_label: string | null
  created_at: string
}

interface RiskSnapshot {
  risk_score: number
  total_allowances: number
  unlimited_count: number
  high_risk_count: number
  snapshot_at: string
}

interface HistoricalTimelineProps {
  wallet: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HistoricalTimeline({ wallet }: HistoricalTimelineProps) {
  const [events, setEvents] = useState<WalletEvent[]>([])
  const [riskHistory, setRiskHistory] = useState<RiskSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [riskDays, setRiskDays] = useState(30)
  const pageSize = 25

  const loadEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        wallet,
        type: filter,
        limit: String(pageSize),
        offset: String((page - 1) * pageSize),
      })
      const res = await fetch(`/api/history?${params}`)
      const json = await res.json()
      setEvents(json.events ?? [])
      setTotal(json.total ?? 0)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [wallet, filter, page])

  const loadRiskHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/history/risk?wallet=${wallet}&days=${riskDays}`)
      const json = await res.json()
      setRiskHistory(json.snapshots ?? [])
    } catch {
      // silent
    }
  }, [wallet, riskDays])

  useEffect(() => { loadEvents() }, [loadEvents])
  useEffect(() => { loadRiskHistory() }, [loadRiskHistory])

  // ---------------------------------------------------------------------------
  // Renderers
  // ---------------------------------------------------------------------------

  const eventIcon = (type: WalletEvent['event_type']) => {
    switch (type) {
      case 'approval_granted': return <Plus className="w-4 h-4 text-blue-500" />
      case 'approval_changed': return <ArrowUpRight className="w-4 h-4 text-amber-500" />
      case 'approval_revoked': return <Minus className="w-4 h-4 text-green-500" />
      case 'risk_changed': return <Shield className="w-4 h-4 text-red-500" />
    }
  }

  const eventLabel = (type: WalletEvent['event_type']) => {
    switch (type) {
      case 'approval_granted': return 'Approval Granted'
      case 'approval_changed': return 'Approval Changed'
      case 'approval_revoked': return 'Approval Revoked'
      case 'risk_changed': return 'Risk Changed'
    }
  }

  const eventBadgeVariant = (type: WalletEvent['event_type']) => {
    switch (type) {
      case 'approval_granted': return 'info' as const
      case 'approval_changed': return 'warning' as const
      case 'approval_revoked': return 'success' as const
      case 'risk_changed': return 'danger' as const
    }
  }

  const formatAmount = (amount: string | null, isUnlimited: boolean | null) => {
    if (isUnlimited) return 'Unlimited'
    if (!amount || amount === '0') return '0'
    // Shorten very large numbers
    const num = parseFloat(amount)
    if (isNaN(num)) return amount
    if (num >= 1e18) return `${(num / 1e18).toFixed(2)}e18`
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    return amount
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  // Compute current risk from latest snapshot
  const latestRisk = riskHistory.length > 0 ? riskHistory[riskHistory.length - 1] : null
  const firstRisk = riskHistory.length > 1 ? riskHistory[0] : null
  const riskTrend = latestRisk && firstRisk
    ? latestRisk.risk_score - firstRisk.risk_score
    : 0

  return (
    <div className="space-y-6">
      {/* Risk Over Time Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-accent" />
              Time Machine
            </CardTitle>
            <div className="flex gap-2">
              {[7, 30, 90].map((d) => (
                <Button
                  key={d}
                  onClick={() => setRiskDays(d)}
                  variant={riskDays === d ? 'primary' : 'ghost'}
                  size="sm"
                >
                  {d}d
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {riskHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-text-secondary">
                No risk history yet. Data will populate after scans.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-text-secondary">Current Risk</div>
                <div className="text-2xl font-bold">{latestRisk?.risk_score ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Trend ({riskDays}d)</div>
                <div className="flex items-center gap-1">
                  {riskTrend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : riskTrend < 0 ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : null}
                  <span className={`text-lg font-bold ${
                    riskTrend > 0 ? 'text-red-500' : riskTrend < 0 ? 'text-green-500' : 'text-text-primary'
                  }`}>
                    {riskTrend > 0 ? '+' : ''}{riskTrend}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Allowances</div>
                <div className="text-2xl font-bold">{latestRisk?.total_allowances ?? '—'}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">High Risk</div>
                <div className="text-2xl font-bold text-semantic-danger">
                  {latestRisk?.high_risk_count ?? '—'}
                </div>
              </div>
            </div>
          )}

          {/* Mini risk chart (text-based sparkline) */}
          {riskHistory.length > 1 && (
            <div className="mt-4 pt-4 border-t border-secondary-700">
              <div className="text-xs text-text-secondary mb-2">Risk Score Over Time</div>
              <div className="flex items-end gap-1 h-16">
                {riskHistory.map((s, i) => {
                  const maxScore = Math.max(...riskHistory.map(r => r.risk_score), 1)
                  const heightPct = (s.risk_score / maxScore) * 100
                  const color = s.risk_score >= 70 ? 'bg-red-500' :
                    s.risk_score >= 40 ? 'bg-amber-500' : 'bg-green-500'
                  return (
                    <div
                      key={i}
                      className={`flex-1 ${color} rounded-t-sm transition-all`}
                      style={{ height: `${Math.max(4, heightPct)}%` }}
                      title={`${s.risk_score} — ${new Date(s.snapshot_at).toLocaleDateString()}`}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between text-[10px] text-text-tertiary mt-1">
                <span>{riskHistory.length > 0 ? new Date(riskHistory[0].snapshot_at).toLocaleDateString() : ''}</span>
                <span>{riskHistory.length > 0 ? new Date(riskHistory[riskHistory.length - 1].snapshot_at).toLocaleDateString() : ''}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Approval History
              {total > 0 && <Badge variant="secondary">{total}</Badge>}
            </CardTitle>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="sm"
            >
              <Filter className="w-4 h-4 mr-1" />
              Filter
              <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {showFilters && (
            <div className="mb-4 pb-4 border-b border-secondary-700">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Events' },
                  { value: 'approval_granted', label: 'Granted' },
                  { value: 'approval_changed', label: 'Changed' },
                  { value: 'approval_revoked', label: 'Revoked' },
                  { value: 'risk_changed', label: 'Risk Changed' },
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    onClick={() => { setFilter(value); setPage(1) }}
                    variant={filter === value ? 'primary' : 'ghost'}
                    size="sm"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Events */}
          {loading ? (
            <div className="text-sm text-text-secondary py-4">Loading timeline...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No events recorded yet</p>
              <p className="text-xs text-text-tertiary mt-1">
                Historical events will appear here as your wallet is scanned over time.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border-primary" />

              <div className="space-y-4">
                {events.map((evt) => (
                  <div key={evt.id} className="relative flex gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className="absolute left-2.5 mt-1.5 w-3 h-3 rounded-full border-2 border-background-primary bg-primary-accent" />

                    <div className="flex-1 p-3 rounded-lg border border-secondary-700 bg-background-secondary">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {eventIcon(evt.event_type)}
                        <Badge variant={eventBadgeVariant(evt.event_type)}>
                          {eventLabel(evt.event_type)}
                        </Badge>
                        <span className="text-xs text-text-tertiary">Chain {evt.chain_id}</span>
                        <span className="text-xs text-text-tertiary ml-auto">
                          {new Date(evt.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-sm text-text-secondary">
                        <span className="font-mono text-xs">
                          {evt.token_symbol ?? evt.token_address.slice(0, 10) + '...'}
                        </span>
                        {' → '}
                        <span className="font-mono text-xs">
                          {evt.spender_label ?? evt.spender_address.slice(0, 10) + '...'}
                        </span>
                      </div>

                      {/* Amount change */}
                      {(evt.previous_amount !== null || evt.new_amount !== null) && (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          {evt.previous_amount !== null && (
                            <span className="text-text-tertiary line-through">
                              {formatAmount(evt.previous_amount, evt.previous_unlimited)}
                            </span>
                          )}
                          {evt.previous_amount !== null && evt.new_amount !== null && (
                            <span className="text-text-tertiary">→</span>
                          )}
                          {evt.new_amount !== null && (
                            <span className="font-medium">
                              {formatAmount(evt.new_amount, evt.new_unlimited)}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Risk change */}
                      {evt.risk_score !== null && evt.previous_risk_score !== null && (
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <Shield className="w-3 h-3" />
                          Risk: {evt.previous_risk_score} → {evt.risk_score}
                          {evt.risk_score > evt.previous_risk_score && (
                            <TrendingUp className="w-3 h-3 text-red-500" />
                          )}
                          {evt.risk_score < evt.previous_risk_score && (
                            <TrendingDown className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      )}

                      {/* Tx link */}
                      {evt.tx_hash && (
                        <div className="mt-2">
                          <span className="text-xs font-mono text-text-tertiary">
                            tx: {evt.tx_hash.slice(0, 10)}...{evt.tx_hash.slice(-6)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-700">
              <div className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  variant="ghost"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  variant="ghost"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
