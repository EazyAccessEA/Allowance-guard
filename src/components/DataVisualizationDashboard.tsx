'use client'

import React, { useState, useMemo } from 'react'
import { 
  ChartContainer, 
  BarChart, 
  PieChart, 
  LineChart, 
  MiniChart 
} from './charts'
import { Button } from './ui/Button'
import { 
  Shield, 
  RefreshCw
} from 'lucide-react'

interface AllowanceData {
  chain_id: number
  token_address: string
  spender_address: string
  token_name?: string | null
  token_symbol?: string | null
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

interface DataVisualizationDashboardProps {
  data: AllowanceData[]
  loading?: boolean
  onRefresh?: () => void
}

const chainNames: Record<number, string> = {
  1: 'Ethereum',
  8453: 'Base',
  42161: 'Arbitrum',
  137: 'Polygon',
  10: 'Optimism',
  43114: 'Avalanche'
}

export function DataVisualizationDashboard({ 
  data, 
  onRefresh 
}: DataVisualizationDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!data?.length) return null

    // Chain distribution
    const chainDistribution = data.reduce((acc, item) => {
      const chain = chainNames[item.chain_id] || `Chain ${item.chain_id}`
      acc[chain] = (acc[chain] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Risk distribution
    const riskDistribution = data.reduce((acc, item) => {
      if (item.is_unlimited) {
        acc['Unlimited'] = (acc['Unlimited'] || 0) + 1
      } else if (item.risk_flags?.includes('STALE')) {
        acc['Stale'] = (acc['Stale'] || 0) + 1
      } else {
        acc['Safe'] = (acc['Safe'] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Token distribution (top 10)
    const tokenDistribution = data.reduce((acc, item) => {
      const token = item.token_symbol || item.token_name || 'Unknown'
      acc[token] = (acc[token] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topTokens = Object.entries(tokenDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    // Spender trust distribution
    const trustDistribution = data.reduce((acc, item) => {
      const trust = item.spender_trust || 'unknown'
      acc[trust] = (acc[trust] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Risk trend (simulated data for demo)
    const riskTrend = [
      { label: 'Week 1', value: 45 },
      { label: 'Week 2', value: 52 },
      { label: 'Week 3', value: 38 },
      { label: 'Week 4', value: 41 },
      { label: 'Week 5', value: 35 },
      { label: 'Week 6', value: 28 },
      { label: 'Week 7', value: 32 },
      { label: 'Week 8', value: 25 }
    ]

    return {
      chainDistribution,
      riskDistribution,
      tokenDistribution: topTokens,
      trustDistribution,
      riskTrend
    }
  }, [data])

  if (!processedData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-background-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-text-tertiary" />
          </div>
          <h3 className="mobbin-heading-3 text-text-primary mb-2">No Data Available</h3>
          <p className="mobbin-body text-text-secondary mb-6 max-w-md mx-auto">
            Connect your wallet and run a scan to see detailed analytics and visualizations.
          </p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="primary">
              Run Security Scan
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="mobbin-heading-1 text-text-primary mb-2">Analytics Dashboard</h2>
          <p className="mobbin-body text-text-secondary">
            Comprehensive insights into your wallet&apos;s token approvals and security posture.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={timeRange === '7d' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7D
            </Button>
            <Button
              variant={timeRange === '30d' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30D
            </Button>
            <Button
              variant={timeRange === '90d' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90D
            </Button>
          </div>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="secondary"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Mini Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniChart
          title="Total Allowances"
          value={data.length}
          data={[45, 52, 38, 41, 35, 28, 32, 25]}
          trend="down"
          trendValue="-12%"
          color="#00C2B3"
          size="md"
        />
        <MiniChart
          title="High Risk"
          value={processedData.riskDistribution['Unlimited'] || 0}
          data={[12, 15, 18, 14, 16, 12, 10, 8]}
          trend="down"
          trendValue="-25%"
          color="#EF4444"
          size="md"
        />
        <MiniChart
          title="Safe Approvals"
          value={processedData.riskDistribution['Safe'] || 0}
          data={[28, 32, 35, 38, 42, 45, 48, 52]}
          trend="up"
          trendValue="+18%"
          color="#22C55E"
          size="md"
        />
        <MiniChart
          title="Chains Monitored"
          value={Object.keys(processedData.chainDistribution).length}
          data={[4, 5, 6, 6, 6, 6, 6, 6]}
          trend="neutral"
          trendValue="0%"
          color="#0EA5E9"
          size="md"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution Pie Chart */}
        <PieChart
          title="Risk Distribution"
          subtitle="Breakdown of approval risk levels"
          data={Object.entries(processedData.riskDistribution).map(([label, value]) => ({
            label,
            value,
            color: label === 'Unlimited' ? '#EF4444' : 
                   label === 'Stale' ? '#F59E0B' : '#22C55E'
          }))}
          showLegend={true}
          showValues={true}
          height="h-80"
        />

        {/* Chain Distribution Bar Chart */}
        <BarChart
          title="Chain Distribution"
          subtitle="Token approvals by blockchain"
          data={Object.entries(processedData.chainDistribution).map(([label, value]) => ({
            label,
            value,
            color: '#00C2B3'
          }))}
          showValues={true}
          height="h-80"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Trend Line Chart */}
        <LineChart
          title="Risk Trend"
          subtitle="Security improvements over time"
          data={processedData.riskTrend}
          color="#00C2B3"
          showValues={true}
          showGrid={true}
          height="h-64"
        />

        {/* Top Tokens Bar Chart */}
        <BarChart
          title="Top Tokens"
          subtitle="Most approved tokens"
          data={processedData.tokenDistribution.map(([label, value]) => ({
            label: label.length > 8 ? `${label.slice(0, 8)}...` : label,
            value,
            color: '#8B5CF6'
          }))}
          showValues={true}
          height="h-64"
        />
      </div>

      {/* Trust Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BarChart
            title="Spender Trust Levels"
            subtitle="Distribution of contract trust levels"
            data={Object.entries(processedData.trustDistribution).map(([label, value]) => ({
              label: label.charAt(0).toUpperCase() + label.slice(1),
              value,
              color: label === 'official' ? '#22C55E' : 
                     label === 'curated' ? '#0EA5E9' : 
                     label === 'community' ? '#F59E0B' : '#64748B'
            }))}
            showValues={true}
            height="h-64"
          />
        </div>
        
        <div className="space-y-4">
          <ChartContainer
            title="Security Score"
            subtitle="Overall wallet security rating"
            height="h-64"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#00C2B3"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.75)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mobbin-heading-2 text-text-primary">75</div>
                    <div className="mobbin-caption text-text-secondary">Score</div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className="mobbin-body text-text-primary mb-1">Good Security</div>
                <div className="mobbin-caption text-text-secondary">
                  {processedData.riskDistribution['Unlimited'] || 0} high-risk approvals need attention
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
