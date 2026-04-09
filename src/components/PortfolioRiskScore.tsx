'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Shield, TrendingUp, TrendingDown, Minus, Globe, AlertTriangle, Lock } from 'lucide-react'

interface ChainRisk {
  chainId: number
  chainName: string
  totalAllowances: number
  unlimitedAllowances: number
  highRiskCount: number
  permit2Allowances: number
  estimatedValueUsd: number
  riskScore: number
}

interface PortfolioRisk {
  portfolioRiskScore: number
  riskLevel: string
  totalAllowances: number
  unlimitedAllowances: number
  highRiskAllowances: number
  permit2Allowances: number
  chainsUsed: number
  estimatedTotalValueUsd: number
  trend: { direction: string; delta: number }
  benchmark: { saferThanPercent: number; totalWallets: number }
  chains: ChainRisk[]
}

function RiskGauge({ score }: { score: number }) {
  const pct = Math.min(score / 100, 1)
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  const color =
    score >= 70 ? '#EF4444'
      : score >= 40 ? '#F97316'
        : score >= 15 ? '#F59E0B'
          : '#22C55E'

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          fill="none" strokeWidth="10"
          className="stroke-neutral-200 dark:stroke-secondary-700"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" strokeWidth="10" strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-ink-whisper">/ 100</span>
      </div>
    </div>
  )
}

function ChainBar({ chain }: { chain: ChainRisk }) {
  const barColor =
    chain.riskScore >= 70 ? 'bg-red-500'
      : chain.riskScore >= 40 ? 'bg-orange-500'
        : chain.riskScore >= 15 ? 'bg-amber-500'
          : 'bg-green-500'

  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-sm font-medium text-ink w-24 truncate">
        {chain.chainName}
      </span>
      <div className="flex-1 h-2.5 bg-neutral-100 dark:bg-paper-sub rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${chain.riskScore}%` }}
        />
      </div>
      <span className="text-xs font-mono text-ink-muted w-8 text-right">
        {chain.riskScore}
      </span>
      {chain.estimatedValueUsd > 0 && (
        <span className="text-xs text-ink-whisper w-20 text-right">
          ${chain.estimatedValueUsd.toLocaleString()}
        </span>
      )}
    </div>
  )
}

export default function PortfolioRiskScore() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<PortfolioRisk | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/portfolio-risk?wallet=${address}`)
      if (!res.ok) throw new Error('Failed to fetch')
      setData(await res.json())
    } catch {
      setError('Failed to load portfolio risk data')
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    if (address && isConnected) fetchData()
  }, [address, isConnected, fetchData])

  if (!isConnected) {
    return (
      <div className="text-center py-12">
        <Globe className="mx-auto h-12 w-12 text-ink-whisper mb-4" />
        <h2 className="text-xl font-semibold text-ink mb-2">
          Cross-Chain Portfolio Risk
        </h2>
        <p className="text-ink-muted">
          Connect your wallet to see your aggregated risk score across all chains.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 w-40 mx-auto bg-neutral-200 dark:bg-paper-sub rounded-full" />
        <div className="h-6 bg-neutral-200 dark:bg-paper-sub rounded w-1/3 mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-paper-sub rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-10 w-10 text-amber-deep mb-3" />
        <p className="text-ink-muted">{error}</p>
      </div>
    )
  }

  if (!data) return null

  const TrendIcon = data.trend.direction === 'improving' ? TrendingDown
    : data.trend.direction === 'worsening' ? TrendingUp
      : Minus

  const trendColor = data.trend.direction === 'improving'
    ? 'text-green-800 dark:text-green-800'
    : data.trend.direction === 'worsening'
      ? 'text-red-800 dark:text-red-800'
      : 'text-ink-whisper'

  return (
    <div className="space-y-6">
      {/* Main score */}
      <div className="bg-paper-sub border border-ink-rule rounded-xl p-6 text-center">
        <h2 className="text-lg font-semibold text-ink mb-4">
          Cross-Chain Portfolio Risk
        </h2>
        <RiskGauge score={data.portfolioRiskScore} />

        <div className="mt-4 flex items-center justify-center gap-6">
          {/* Trend */}
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              {data.trend.direction === 'stable' ? 'Stable' : `${Math.abs(data.trend.delta)} pts`}
            </span>
            <span className="text-xs text-ink-whisper">30d</span>
          </div>

          {/* Benchmark */}
          <div className="flex items-center gap-1 text-amber-deep dark:text-amber-deep">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              Safer than {data.benchmark.saferThanPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Chains', value: data.chainsUsed, icon: Globe },
          { label: 'Total Approvals', value: data.totalAllowances, icon: Shield },
          { label: 'Unlimited', value: data.unlimitedAllowances, icon: AlertTriangle },
          { label: 'Permit2', value: data.permit2Allowances, icon: Lock },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-paper-sub border border-ink-rule rounded-xl p-4 text-center"
          >
            <Icon className="h-5 w-5 mx-auto text-ink-whisper mb-1" />
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-ink-whisper">{label}</p>
          </div>
        ))}
      </div>

      {/* Per-chain breakdown */}
      {data.chains.length > 0 && (
        <div className="bg-paper-sub border border-ink-rule rounded-xl p-6">
          <h3 className="text-sm font-semibold text-ink-muted mb-3">
            Risk by Chain
          </h3>
          <div className="divide-y divide-border-primary dark:divide-secondary-700">
            {data.chains
              .sort((a, b) => b.riskScore - a.riskScore)
              .map((chain) => (
                <ChainBar key={chain.chainId} chain={chain} />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
