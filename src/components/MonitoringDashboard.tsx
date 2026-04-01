'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import {
  Eye,
  Bell,
  BellOff,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  RefreshCw,
  Clock,
} from 'lucide-react'
import { InlineError } from '@/components/ErrorBoundary'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MonitoringEvent {
  id: string
  monitor_id: string
  wallet_address: string
  chain_id: number
  event_type: 'new_approval' | 'approval_changed' | 'approval_removed' | 'risk_increased'
  payload: {
    token_address?: string
    spender_address?: string
    amount?: string
    is_unlimited?: boolean
    risk_score?: number
  }
  notified: boolean
  acknowledged: boolean
  created_at: string
}

interface MonitorConfig {
  id: string
  wallet_address: string
  enabled: boolean
  freq_minutes: number
  last_scan_at: string | null
  last_change_at: string | null
  notify_channels: { email?: boolean; slack?: boolean; telegram?: boolean }
}

interface MonitoringDashboardProps {
  wallet: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MonitoringDashboard({ wallet }: MonitoringDashboardProps) {
  const [events, setEvents] = useState<MonitoringEvent[]>([])
  const [config, setConfig] = useState<MonitorConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [eventsRes, configRes] = await Promise.all([
        fetch(`/api/monitor/events?wallet=${wallet}&limit=${pageSize}&offset=${(page - 1) * pageSize}`),
        fetch(`/api/monitor?wallet=${wallet}`),
      ])
      if (!eventsRes.ok || !configRes.ok) throw new Error('Failed to load monitoring data')
      const eventsJson = await eventsRes.json()
      const configJson = await configRes.json()

      setEvents(eventsJson.events ?? [])
      setTotal(eventsJson.total ?? 0)
      setConfig(configJson.monitor ?? null)
    } catch {
      setError('Failed to load monitoring data')
    } finally {
      setLoading(false)
    }
  }, [wallet, page])

  useEffect(() => { loadData() }, [loadData])

  async function acknowledgeEvent(eventId: string) {
    await fetch('/api/monitor/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'acknowledge', eventId }),
    })
    await loadData()
  }

  const eventIcon = (type: MonitoringEvent['event_type']) => {
    switch (type) {
      case 'new_approval': return <Plus className="w-4 h-4 text-blue-500" />
      case 'approval_changed': return <ArrowUpRight className="w-4 h-4 text-amber-500" />
      case 'approval_removed': return <Minus className="w-4 h-4 text-green-500" />
      case 'risk_increased': return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const eventLabel = (type: MonitoringEvent['event_type']) => {
    switch (type) {
      case 'new_approval': return 'New Approval'
      case 'approval_changed': return 'Approval Changed'
      case 'approval_removed': return 'Approval Removed'
      case 'risk_increased': return 'Risk Increased'
    }
  }

  const eventVariant = (type: MonitoringEvent['event_type']) => {
    switch (type) {
      case 'new_approval': return 'info' as const
      case 'approval_changed': return 'warning' as const
      case 'approval_removed': return 'success' as const
      case 'risk_increased': return 'danger' as const
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-accent" />
              Monitoring Status
            </CardTitle>
            <Button onClick={loadData} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-text-secondary">Status</div>
                <Badge variant={config.enabled ? 'success' : 'secondary'}>
                  {config.enabled ? 'Active' : 'Paused'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Frequency</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Every {config.freq_minutes >= 60
                    ? `${Math.round(config.freq_minutes / 60)}h`
                    : `${config.freq_minutes}m`}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Last Scan</div>
                <div className="text-sm font-medium">
                  {config.last_scan_at
                    ? new Date(config.last_scan_at).toLocaleDateString()
                    : 'Never'}
                </div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">Notifications</div>
                <div className="flex gap-1">
                  {config.notify_channels.email && (
                    <Badge variant="secondary">Email</Badge>
                  )}
                  {config.notify_channels.slack && (
                    <Badge variant="secondary">Slack</Badge>
                  )}
                  {config.notify_channels.telegram && (
                    <Badge variant="secondary">Telegram</Badge>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="info" icon={<Bell className="w-4 h-4" />}>
              Monitoring is not configured for this wallet. Enable it in the sidebar.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Monitoring Events
              {total > 0 && (
                <Badge variant="secondary">{total}</Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <InlineError message={error} onRetry={loadData} />
          ) : loading && events.length === 0 ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border-primary">
                  <div className="w-4 h-4 bg-gray-200 rounded-full mt-0.5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <BellOff className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No monitoring events yet</p>
              <p className="text-xs text-text-tertiary mt-1">
                Events will appear here when changes are detected in your wallet&apos;s approvals.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      evt.acknowledged
                        ? 'border-border-primary bg-background-secondary'
                        : 'border-primary-200 bg-primary-50'
                    }`}
                  >
                    <div className="mt-0.5">{eventIcon(evt.event_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={eventVariant(evt.event_type)}>
                          {eventLabel(evt.event_type)}
                        </Badge>
                        <span className="text-xs text-text-tertiary">
                          Chain {evt.chain_id}
                        </span>
                        {evt.notified && (
                          <span className="text-xs text-text-tertiary flex items-center gap-0.5">
                            <Bell className="w-3 h-3" /> Notified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary font-mono truncate">
                        {evt.payload.token_address && (
                          <span>Token: {evt.payload.token_address.slice(0, 10)}... </span>
                        )}
                        {evt.payload.spender_address && (
                          <span>Spender: {evt.payload.spender_address.slice(0, 10)}...</span>
                        )}
                      </div>
                      {evt.payload.is_unlimited && (
                        <Badge variant="danger" className="mt-1">Unlimited</Badge>
                      )}
                      <div className="text-xs text-text-tertiary mt-1">
                        {new Date(evt.created_at).toLocaleString()}
                      </div>
                    </div>
                    {!evt.acknowledged && (
                      <Button
                        onClick={() => acknowledgeEvent(evt.id)}
                        variant="ghost"
                        size="sm"
                        title="Acknowledge"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
