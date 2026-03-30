'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Activity,
  Wallet,
  UserPlus,
  UserMinus,
  Shield,
  Scan,
  FileText,
  Settings,
  RefreshCw,
  Download,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityEntry {
  id: string
  team_id: number
  user_id: number
  action: string
  subject: string | null
  details: Record<string, unknown>
  ip_address: string | null
  created_at: string
  user_email?: string
  user_name?: string
}

interface TeamActivityLogProps {
  teamId: number
}

// ---------------------------------------------------------------------------
// Action display helpers
// ---------------------------------------------------------------------------

const ACTION_CONFIG: Record<string, { icon: typeof Activity; label: string; variant: 'info' | 'success' | 'warning' | 'danger' | 'secondary' }> = {
  wallet_added: { icon: Wallet, label: 'Wallet Added', variant: 'info' },
  wallet_removed: { icon: Wallet, label: 'Wallet Removed', variant: 'warning' },
  member_invited: { icon: UserPlus, label: 'Member Invited', variant: 'info' },
  member_removed: { icon: UserMinus, label: 'Member Removed', variant: 'danger' },
  approval_revoked: { icon: Shield, label: 'Approval Revoked', variant: 'success' },
  scan_triggered: { icon: Scan, label: 'Scan Triggered', variant: 'secondary' },
  rule_created: { icon: Settings, label: 'Rule Created', variant: 'info' },
  export_generated: { icon: FileText, label: 'Export Generated', variant: 'secondary' },
  team_created: { icon: Activity, label: 'Team Created', variant: 'success' },
  team_updated: { icon: Settings, label: 'Team Updated', variant: 'secondary' },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamActivityLog({ teamId }: TeamActivityLogProps) {
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 25

  const loadActivity = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/teams/activity?teamId=${teamId}&limit=${pageSize}&offset=${(page - 1) * pageSize}`,
      )
      const data = await res.json()
      setActivities(data.activities ?? [])
      setTotal(data.total ?? 0)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [teamId, page])

  useEffect(() => { loadActivity() }, [loadActivity])

  const exportActivity = async () => {
    try {
      const res = await fetch('/api/compliance/export', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          exportType: 'team_report',
          format: 'csv',
          filters: { teamId },
        }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `team_activity_${teamId}_${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch {
      // silently fail
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Team Activity
            {total > 0 && <Badge variant="secondary">{total}</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportActivity} variant="ghost" size="sm" title="Export activity log">
              <Download className="w-4 h-4" />
            </Button>
            <Button onClick={loadActivity} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && activities.length === 0 ? (
          <div className="text-sm text-text-secondary">Loading activity...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
            <p className="text-sm text-text-secondary">No activity recorded yet</p>
            <p className="text-xs text-text-tertiary mt-1">
              Team actions will appear here as members interact with team resources.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {activities.map((entry) => {
                const config = ACTION_CONFIG[entry.action] ?? {
                  icon: Activity,
                  label: entry.action,
                  variant: 'secondary' as const,
                }
                const Icon = config.icon

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border-primary"
                  >
                    <div className="mt-0.5">
                      <Icon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <span className="text-xs text-text-secondary">
                          by {entry.user_name ?? entry.user_email ?? `User #${entry.user_id}`}
                        </span>
                      </div>
                      {entry.subject && (
                        <div className="text-xs text-text-secondary font-mono truncate">
                          {entry.subject}
                        </div>
                      )}
                      <div className="text-xs text-text-tertiary mt-1">
                        {new Date(entry.created_at).toLocaleString()}
                        {entry.ip_address && (
                          <span className="ml-2">IP: {entry.ip_address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-primary">
                <div className="text-sm text-text-secondary">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    variant="ghost"
                    size="sm"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
  )
}
