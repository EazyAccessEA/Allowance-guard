'use client'

import { useState, useEffect, useCallback } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  RefreshCw,
  Zap,
} from 'lucide-react'

interface FunnelItem {
  event_name: string
  count: number
  unique_users: number
}

interface RevenueData {
  totalActive: number
  byPlan: Array<{ plan: string; count: number }>
  churnRate: number
  trialCount: number
  newLast30d: number
}

interface ApiUsageItem {
  plan: string
  total_calls: number
  unique_keys: number
}

interface FeatureItem {
  feature: string
  count: number
}

interface AnalyticsData {
  period: { days: number }
  funnel: FunnelItem[]
  revenue: RevenueData
  apiUsage: ApiUsageItem[]
  topFeatures: FeatureItem[]
}

// Plan price mapping for MRR calculation
const PLAN_PRICES: Record<string, number> = {
  pro: 9.99,
  pro_yearly: 79 / 12,
  sentinel: 49.99,
  sentinel_yearly: 499 / 12,
  api_developer: 39,
  api_growth: 149,
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [days, setDays] = useState(30)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`)
      if (!res.ok) throw new Error(await res.text())
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const calculateMRR = (byPlan: Array<{ plan: string; count: number }>) => {
    return byPlan.reduce((sum, p) => sum + (PLAN_PRICES[p.plan] || 0) * p.count, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary-accent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-light">
        <Section className="py-8">
          <Container>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-semantic-danger mb-4">{error}</p>
                <button onClick={fetchData} className="text-primary-accent hover:underline">
                  Retry
                </button>
              </CardContent>
            </Card>
          </Container>
        </Section>
      </div>
    )
  }

  if (!data) return null

  const mrr = calculateMRR(data.revenue.byPlan)

  return (
    <div className="min-h-screen bg-background-light">
      <Section className="py-8">
        <Container>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-text mb-2">Revenue & Analytics</h1>
              <p className="text-neutral-text">Business metrics and conversion funnels</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="px-3 py-2 border border-neutral-borders rounded-lg bg-background-primary text-neutral-text text-sm"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
              <button
                onClick={fetchData}
                className="p-2 border border-neutral-borders rounded-lg hover:bg-background-primary/50 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-neutral-text" />
              </button>
            </div>
          </div>

          {/* Revenue KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-semantic-success" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-text">MRR</p>
                    <p className="text-2xl font-bold text-neutral-text">${mrr.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-text">Active Subscribers</p>
                    <p className="text-2xl font-bold text-neutral-text">{data.revenue.totalActive}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-semantic-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-text">Churn Rate</p>
                    <p className="text-2xl font-bold text-neutral-text">
                      {(data.revenue.churnRate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-text">Trials Active</p>
                    <p className="text-2xl font-bold text-neutral-text">{data.revenue.trialCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Subscribers by Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-accent" />
                  Subscribers by Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.revenue.byPlan.length === 0 ? (
                  <p className="text-neutral-text text-sm">No active subscribers yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.revenue.byPlan.map((p) => (
                      <div key={p.plan} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{p.plan}</Badge>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-text">{p.count}</span>
                          <span className="text-sm text-neutral-text ml-2">
                            (${((PLAN_PRICES[p.plan] || 0) * p.count).toFixed(0)}/mo)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-neutral-borders text-sm text-neutral-text">
                  New last 30 days: <strong>{data.revenue.newLast30d}</strong>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-accent" />
                  Conversion Funnel ({days}d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.funnel.length === 0 ? (
                  <p className="text-neutral-text text-sm">No funnel events tracked yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.funnel.map((f) => (
                      <div key={f.event_name} className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text font-mono">
                          {f.event_name.replace(/_/g, ' ')}
                        </span>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-text">{f.count}</span>
                          <span className="text-xs text-neutral-text ml-2">
                            ({f.unique_users} users)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Usage by Tier */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-accent" />
                  API Usage by Tier ({days}d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.apiUsage.length === 0 ? (
                  <p className="text-neutral-text text-sm">No API usage recorded yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.apiUsage.map((u) => (
                      <div key={u.plan} className="flex items-center justify-between">
                        <Badge variant="secondary">{u.plan}</Badge>
                        <div className="text-right">
                          <span className="font-semibold text-neutral-text">
                            {u.total_calls.toLocaleString()} calls
                          </span>
                          <span className="text-xs text-neutral-text ml-2">
                            ({u.unique_keys} keys)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary-accent" />
                  Top Features ({days}d)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.topFeatures.length === 0 ? (
                  <p className="text-neutral-text text-sm">No feature usage tracked yet</p>
                ) : (
                  <div className="space-y-3">
                    {data.topFeatures.map((f) => (
                      <div key={f.feature} className="flex items-center justify-between">
                        <span className="text-sm text-neutral-text font-mono">
                          {f.feature.replace(/_/g, ' ')}
                        </span>
                        <span className="font-semibold text-neutral-text">
                          {f.count.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </div>
  )
}
