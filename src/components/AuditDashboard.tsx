'use client'

import { useState, useEffect, useCallback } from 'react'
import { InlineError } from '@/components/ErrorBoundary'
import EmptyState from '@/components/EmptyState'
import { FileText } from 'lucide-react'

interface AuditLog {
  id: number
  createdAt: string
  actorType: string
  actorId: string | null
  action: string
  subject: string | null
  meta: Record<string, unknown>
  ip: string | null
  path: string | null
  userAgent: string | null
  sessionId: string | null
  severity: string
  category: string
}

interface AuditStats {
  totalEvents: number
  eventsByCategory: Record<string, number>
  eventsBySeverity: Record<string, number>
  eventsByActorType: Record<string, number>
  topActions: Array<{ action: string; count: number }>
  topActors: Array<{ actorId: string; count: number }>
}

export default function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    limit: 50,
    offset: 0,
    actorType: '',
    action: '',
    category: '',
    severity: ''
  })

  const fetchAuditData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch logs and stats in parallel
      const [logsResponse, statsResponse] = await Promise.all([
        fetch(`/api/audit/logs?${new URLSearchParams({
          limit: filters.limit.toString(),
          offset: filters.offset.toString(),
          ...(filters.actorType && { actorType: filters.actorType }),
          ...(filters.action && { action: filters.action }),
          ...(filters.category && { category: filters.category }),
          ...(filters.severity && { severity: filters.severity })
        })}`),
        fetch('/api/audit/stats')
      ])

      if (!logsResponse.ok || !statsResponse.ok) {
        throw new Error('Failed to fetch audit data')
      }

      const logsData = await logsResponse.json()
      const statsData = await statsResponse.json()

      setLogs(logsData.logs)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAuditData()
  }, [fetchAuditData])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-crimson-paper bg-paper-sub border border-crimson-paper/40'
      case 'high': return 'text-semantic-warning-700 bg-paper-sub border border-semantic-warning-600/40'
      case 'medium': return 'text-semantic-warning-700 bg-paper-sub border border-semantic-warning-600/30'
      case 'low': return 'text-semantic-success-700 bg-paper-sub border border-semantic-success-600/40'
      default: return 'text-ink-muted bg-paper-sub border border-ink-rule'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'security': return 'text-crimson-paper'
      case 'authentication': return 'text-ink-blue'
      case 'authorization': return 'text-amber-deep'
      case 'data_access': return 'text-semantic-success-700'
      case 'data_modification': return 'text-semantic-warning-700'
      case 'system': return 'text-ink-muted'
      case 'compliance': return 'text-ink-blue'
      default: return 'text-ink-muted'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-paper-sub rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-paper-sub rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-paper-sub rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <InlineError message={error} onRetry={fetchAuditData} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Audit Dashboard</h1>
        <p className="text-ink-muted">Monitor system activities and security events</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-paper-sub p-4 rounded-lg border border-ink-rule">
            <div className="text-2xl font-bold text-ink">{stats.totalEvents.toLocaleString()}</div>
            <div className="text-sm text-ink-muted">Total Events</div>
          </div>
          <div className="bg-paper-sub p-4 rounded-lg border border-ink-rule">
            <div className="text-2xl font-bold text-crimson-paper">{stats.eventsBySeverity.critical || 0}</div>
            <div className="text-sm text-ink-muted">Critical Events</div>
          </div>
          <div className="bg-paper-sub p-4 rounded-lg border border-ink-rule">
            <div className="text-2xl font-bold text-semantic-warning-700">{stats.eventsBySeverity.high || 0}</div>
            <div className="text-sm text-ink-muted">High Severity</div>
          </div>
          <div className="bg-paper-sub p-4 rounded-lg border border-ink-rule">
            <div className="text-2xl font-bold text-ink-blue">{stats.eventsByActorType.user || 0}</div>
            <div className="text-sm text-ink-muted">User Actions</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-paper-sub p-4 rounded-lg border border-ink-rule mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Actor Type</label>
            <select
              value={filters.actorType}
              onChange={(e) => setFilters({ ...filters, actorType: e.target.value })}
              className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="security">Security</option>
              <option value="authentication">Authentication</option>
              <option value="authorization">Authorization</option>
              <option value="data_access">Data Access</option>
              <option value="data_modification">Data Modification</option>
              <option value="system">System</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Action</label>
            <input
              type="text"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              placeholder="Search actions..."
              className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Limit</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
              className="w-full border border-ink-rule rounded-md px-3 py-2 text-sm"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-paper-sub rounded-lg border border-ink-rule overflow-hidden">
        <div className="px-4 py-3 border-b border-ink-rule">
          <h2 className="text-lg font-medium text-ink">Recent Audit Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-ink-rule">
            <thead className="bg-paper-sub">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Actor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Severity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">IP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted uppercase tracking-wider">Path</th>
              </tr>
            </thead>
            <tbody className="bg-paper-sub divide-y divide-ink-rule">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-paper-sub">
                  <td className="px-4 py-3 text-sm text-ink">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">
                    <div>
                      <div className="font-medium">{log.actorType}</div>
                      {log.actorId && (
                        <div className="text-ink-muted text-xs">{log.actorId}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      {log.subject && (
                        <div className="text-ink-muted text-xs">{log.subject}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`font-medium ${getCategoryColor(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">
                    {log.ip || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-ink">
                    {log.path || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {logs.length === 0 && !loading && !error && (
          <div className="py-4">
            <EmptyState
              icon={<FileText className="h-8 w-8" />}
              title="No audit logs found"
              description="No audit logs match the current filters. Try adjusting your filter criteria."
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-ink-soft">
          Showing {filters.offset + 1} to {Math.min(filters.offset + filters.limit, logs.length)} of {logs.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilters({ ...filters, offset: Math.max(0, filters.offset - filters.limit) })}
            disabled={filters.offset === 0}
            className="px-3 py-1 text-sm border border-ink-rule rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setFilters({ ...filters, offset: filters.offset + filters.limit })}
            disabled={logs.length < filters.limit}
            className="px-3 py-1 text-sm border border-ink-rule rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
