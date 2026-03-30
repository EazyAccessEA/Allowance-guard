'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { Shield, AlertTriangle, Check, Eye, EyeOff, Copy, ExternalLink, RefreshCw } from 'lucide-react'

interface WalletSecurityData {
  address: string
  riskScore: number
  totalAllowances: number
  highRiskAllowances: number
  lastScanAt?: string
  isMonitoring: boolean
}

/** Radial gauge SVG for risk score */
function RadialGauge({ score, max = 10 }: { score: number; max?: number }) {
  const pct = Math.min(score / max, 1)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  const getColor = () => {
    if (pct <= 0.3) return { stroke: '#22C55E', text: 'text-green-500 dark:text-green-400', label: 'Low' }
    if (pct <= 0.6) return { stroke: '#F59E0B', text: 'text-amber-500 dark:text-amber-400', label: 'Medium' }
    return { stroke: '#EF4444', text: 'text-red-500 dark:text-red-400', label: 'High' }
  }

  const color = getColor()

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        {/* Track */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-neutral-200 dark:stroke-secondary-700"
        />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={color.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${color.text}`}>{score}</span>
        <span className="text-xs text-text-tertiary dark:text-secondary-500">/ {max}</span>
      </div>
    </div>
  )
}

export default function WalletSecurity() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<WalletSecurityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPrivateInfo, setShowPrivateInfo] = useState(false)

  const fetchWalletSecurityData = useCallback(async () => {
    if (!address) return

    setLoading(true)
    try {
      const [allowancesRes] = await Promise.all([
        fetch(`/api/allowances?wallet=${address}&page=1&pageSize=1000`),
        fetch(`/api/risk/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: address })
        })
      ])

      const allowances = await allowancesRes.json()
      const highRiskCount = allowances.rows?.filter((r: { risk_score: number }) => r.risk_score > 7).length || 0

      let riskScore = 0
      if (allowances.rows && allowances.rows.length > 0) {
        const avgRisk = allowances.rows.reduce((sum: number, r: { risk_score: number }) => sum + (r.risk_score || 0), 0) / allowances.rows.length
        riskScore = Math.round(avgRisk)
      }

      setData({
        address,
        riskScore,
        totalAllowances: allowances.total || 0,
        highRiskAllowances: highRiskCount,
        lastScanAt: new Date().toISOString(),
        isMonitoring: true
      })
    } catch (error) {
      console.error('Failed to fetch wallet security data:', error)
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    if (address && isConnected) {
      fetchWalletSecurityData()
    }
  }, [address, isConnected, fetchWalletSecurityData])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' }
    if (score <= 6) return { level: 'Medium', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' }
    return { level: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' }
  }

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-text-tertiary dark:text-secondary-500 mb-4" />
          <h2 className="text-xl font-semibold text-text-primary dark:text-secondary-100 mb-2">Wallet Security</h2>
          <p className="text-text-secondary dark:text-secondary-400">Connect your wallet to view security settings and monitor your token allowances.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-secondary-800 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-neutral-200 dark:bg-secondary-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const riskInfo = data ? getRiskLevel(data.riskScore) : { level: 'Unknown', color: 'text-text-secondary', bg: 'bg-neutral-50 dark:bg-secondary-800', border: 'border-neutral-200 dark:border-secondary-700' }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-text-primary dark:text-secondary-100">Wallet Security</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPrivateInfo(!showPrivateInfo)}
              className="p-2 text-text-tertiary dark:text-secondary-500 hover:text-text-primary dark:hover:text-secondary-200 rounded-lg transition-colors"
              title={showPrivateInfo ? 'Hide full address' : 'Show full address'}
            >
              {showPrivateInfo ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="bg-background-secondary dark:bg-secondary-800/60 rounded-xl p-4 mb-6 border border-border-primary dark:border-secondary-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary dark:text-secondary-400 mb-1">Connected Wallet</p>
              <p className="font-mono text-sm text-text-primary dark:text-secondary-200">
                {showPrivateInfo ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-white dark:bg-secondary-700 border border-border-primary dark:border-secondary-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-secondary-600 text-text-primary dark:text-secondary-200 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Risk Score with Radial Gauge */}
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskInfo.bg} ${riskInfo.color} ${riskInfo.border} border`}>
              {riskInfo.level} Risk
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-secondary dark:text-secondary-400 mb-3">Security Score</h3>
          <RadialGauge score={data?.riskScore || 0} />
          <p className="text-xs text-text-tertiary dark:text-secondary-500 text-center mt-2">Based on your token allowances</p>
        </div>

        {/* Total Allowances */}
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
              Active
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-secondary dark:text-secondary-400 mb-1">Total Allowances</h3>
          <p className="text-4xl font-bold text-text-primary dark:text-secondary-100 mb-2">{data?.totalAllowances || 0}</p>
          <p className="text-xs text-text-tertiary dark:text-secondary-500">Token approvals granted</p>
        </div>

        {/* High Risk Allowances */}
        <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6 backdrop-blur-xs">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              Attention
            </span>
          </div>
          <h3 className="text-sm font-semibold text-text-secondary dark:text-secondary-400 mb-1">High Risk</h3>
          <p className="text-4xl font-bold text-text-primary dark:text-secondary-100 mb-2">{data?.highRiskAllowances || 0}</p>
          <p className="text-xs text-text-tertiary dark:text-secondary-500">Require immediate review</p>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-white dark:bg-secondary-800/60 border border-border-primary dark:border-secondary-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary dark:text-secondary-100 mb-4">Security Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={fetchWalletSecurityData}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Security Scan'}</span>
          </button>

          <a
            href={`/report/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-100 dark:bg-secondary-700 text-text-primary dark:text-secondary-200 rounded-xl hover:bg-neutral-200 dark:hover:bg-secondary-600 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>View Detailed Report</span>
          </a>
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-8 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200 mb-3">Security Best Practices</h3>
        <ul className="space-y-2.5 text-sm text-primary-800 dark:text-primary-300">
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>Regularly review and revoke unnecessary token allowances</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>Be cautious of unlimited allowances - they pose the highest risk</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>Only approve tokens for trusted applications and contracts</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span>Monitor your wallet regularly for suspicious activity</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
