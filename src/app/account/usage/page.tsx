'use client'

import React, { useEffect, useState } from 'react'
import Section from '@/components/ui/Section'
import Container from '@/components/ui/Container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import PlanBadge from '@/components/PlanBadge'
import { cn } from '@/lib/utils'
import {
  ArrowLeft,
  BarChart3,
  Wallet,
  Radio,
  Activity,
  Zap,
} from 'lucide-react'
import type { ConsumerPlan } from '@/lib/plans'

interface DailyCall {
  date: string
  count: number
}

interface UsageData {
  plan: ConsumerPlan
  limits: {
    maxWallets: number
    maxApiCallsPerDay: number
    maxChains: number
    maxMonitoredWallets: number
  }
  usage: {
    apiCallsToday: number
    walletsUsed: number
    scansLast30Days: number
    monitoredWallets: number
  }
  dailyApiCalls: DailyCall[]
}

function UsageStat({
  icon,
  label,
  used,
  limit,
}: {
  icon: React.ReactNode
  label: string
  used: number
  limit: number
}) {
  const isUnlimited = limit === -1
  const percentage = isUnlimited ? 0 : limit > 0 ? Math.round((used / limit) * 100) : 0

  return (
    <Card>
      <CardContent className="py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-700 flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="text-2xl font-bold text-text-primary mt-1">
              {used.toLocaleString()}
              <span className="text-sm font-normal text-text-secondary ml-1">
                / {isUnlimited ? 'Unlimited' : limit.toLocaleString()}
              </span>
            </p>
            {!isUnlimited && limit > 0 && (
              <div className="mt-2 h-2 w-full rounded-full bg-gray-100 dark:bg-secondary-700 overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    percentage > 85
                      ? 'bg-semantic-error-500'
                      : percentage > 60
                        ? 'bg-semantic-warning-500'
                        : 'bg-semantic-success-500'
                  )}
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DailyChart({ data, limit }: { data: DailyCall[]; limit: number }) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BarChart3 className="h-8 w-8 text-text-secondary mb-2" />
        <p className="text-sm text-text-secondary">No API usage data yet.</p>
      </div>
    )
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const chartMax = limit > 0 ? Math.max(maxCount, limit) : maxCount

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-text-secondary">
        <span>Last 30 days</span>
        {limit > 0 && (
          <span>Daily limit: {limit.toLocaleString()}</span>
        )}
      </div>
      <div className="flex items-end gap-[2px] h-32">
        {data.map((d) => {
          const height = chartMax > 0 ? (d.count / chartMax) * 100 : 0
          const overLimit = limit > 0 && d.count > limit

          return (
            <div
              key={d.date}
              className="flex-1 min-w-0 group relative"
              title={`${d.date}: ${d.count} calls`}
            >
              <div
                className={cn(
                  'w-full rounded-t transition-all',
                  overLimit ? 'bg-semantic-error-400' : 'bg-primary-400',
                  'group-hover:bg-primary-600'
                )}
                style={{ height: `${Math.max(height, 2)}%` }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchUsage() {
      try {
        const res = await fetch('/api/account/usage', { credentials: 'include' })
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view usage data.')
          } else {
            setError('Failed to load usage data.')
          }
          return
        }
        const json = await res.json()
        if (!cancelled) setData(json)
      } catch {
        if (!cancelled) setError('Failed to load usage data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUsage()
    return () => { cancelled = true }
  }, [])

  return (
    <Section size="sm" background="muted">
      <Container size="lg">
        <div className="space-y-8">
          {/* Back link */}
          <a
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </a>

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Usage</h1>
              <p className="text-sm text-text-secondary mt-1">
                Monitor your resource usage across wallets, API calls, and more.
              </p>
            </div>
            {data && <PlanBadge plan={data.plan} />}
          </div>

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="py-5">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-neutral-200 dark:bg-secondary-700 rounded w-1/2" />
                      <div className="h-8 bg-neutral-200 dark:bg-secondary-700 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-sm text-semantic-error-600">{error}</p>
              </CardContent>
            </Card>
          )}

          {data && (
            <>
              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <UsageStat
                  icon={<Zap className="h-5 w-5" />}
                  label="API Calls Today"
                  used={data.usage.apiCallsToday}
                  limit={data.limits.maxApiCallsPerDay}
                />
                <UsageStat
                  icon={<Wallet className="h-5 w-5" />}
                  label="Wallets"
                  used={data.usage.walletsUsed}
                  limit={data.limits.maxWallets}
                />
                <UsageStat
                  icon={<Radio className="h-5 w-5" />}
                  label="Monitored Wallets"
                  used={data.usage.monitoredWallets}
                  limit={data.limits.maxMonitoredWallets}
                />
                <UsageStat
                  icon={<Activity className="h-5 w-5" />}
                  label="Scans (30d)"
                  used={data.usage.scansLast30Days}
                  limit={-1}
                />
              </div>

              {/* Daily API calls chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily API Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyChart
                    data={data.dailyApiCalls}
                    limit={data.limits.maxApiCallsPerDay}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </Container>
    </Section>
  )
}
