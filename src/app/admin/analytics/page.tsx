'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface FunnelRow {
  event_name: string
  event_day: string
  event_count: number
  unique_users: number
}

interface RevenueSummary {
  plan: string
  status: string
  subscriber_count: number
  active_count: number
  cancelled_count: number
  trialing_count: number
  recent_cancellations: number
}

export default function AdminAnalyticsPage() {
  const [funnel, setFunnel] = useState<FunnelRow[]>([])
  const [revenue, setRevenue] = useState<RevenueSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/analytics')
        if (!res.ok) throw new Error('Failed to load analytics')
        const data = await res.json()
        setFunnel(data.funnel ?? [])
        setRevenue(data.revenue ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8 text-center text-ink-muted">
        Loading analytics...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-crimson-paper">
        Error: {error}
      </div>
    )
  }

  // Aggregate funnel events
  const funnelTotals = funnel.reduce<Record<string, { count: number; users: number }>>((acc, row) => {
    if (!acc[row.event_name]) acc[row.event_name] = { count: 0, users: 0 }
    acc[row.event_name].count += row.event_count
    acc[row.event_name].users += row.unique_users
    return acc
  }, {})

  // Aggregate revenue
  const totalActive = revenue.reduce((sum, r) => sum + (r.active_count || 0), 0)
  const totalCancelled = revenue.reduce((sum, r) => sum + (r.cancelled_count || 0), 0)
  const totalTrialing = revenue.reduce((sum, r) => sum + (r.trialing_count || 0), 0)

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold text-ink">Analytics Dashboard</h1>
      <p className="text-sm text-ink-muted">
        Business metrics from the last 30 days. Admin access required.
      </p>

      {/* Revenue Summary */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Revenue Overview</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Active Subscribers" value={totalActive} />
          <StatCard label="Trialing" value={totalTrialing} />
          <StatCard label="Cancelled (30d)" value={totalCancelled} color="red" />
        </div>

        {revenue.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-ink-rule">
            <table className="w-full text-sm">
              <thead className="bg-paper-sub">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-ink-muted">Plan</th>
                  <th className="px-4 py-2 text-left font-medium text-ink-muted">Status</th>
                  <th className="px-4 py-2 text-right font-medium text-ink-muted">Count</th>
                  <th className="px-4 py-2 text-right font-medium text-ink-muted">Active</th>
                  <th className="px-4 py-2 text-right font-medium text-ink-muted">Recent Cancellations</th>
                </tr>
              </thead>
              <tbody>
                {revenue.map((r, i) => (
                  <tr key={i} className="border-t border-ink-rule">
                    <td className="px-4 py-2 font-medium capitalize text-ink">{r.plan}</td>
                    <td className="px-4 py-2 text-ink-muted">{r.status}</td>
                    <td className="px-4 py-2 text-right text-ink">{r.subscriber_count}</td>
                    <td className="px-4 py-2 text-right text-ink">{r.active_count}</td>
                    <td className="px-4 py-2 text-right text-ink">{r.recent_cancellations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Funnel Events */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">Funnel Events (30 days)</h2>
        {Object.keys(funnelTotals).length === 0 ? (
          <p className="text-sm text-ink-muted">No events tracked yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(funnelTotals).map(([name, data]) => (
              <div
                key={name}
                className="rounded-lg border border-ink-rule bg-paper p-4"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  {name.replace(/_/g, ' ')}
                </p>
                <p className="mt-1 text-2xl font-bold text-ink">{data.count}</p>
                <p className="text-xs text-ink-muted">{data.users} unique users</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  color = 'default',
}: {
  label: string
  value: number
  color?: 'default' | 'red'
}) {
  return (
    <div className="rounded-lg border border-ink-rule bg-paper p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
      <p
        className={cn(
          'mt-1 text-3xl font-bold',
          color === 'red' ? 'text-crimson-paper' : 'text-ink',
        )}
      >
        {value}
      </p>
    </div>
  )
}
