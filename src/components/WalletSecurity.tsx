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

export default function WalletSecurity() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<WalletSecurityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPrivateInfo, setShowPrivateInfo] = useState(false)

  const fetchWalletSecurityData = useCallback(async () => {
    if (!address) return
    
    setLoading(true)
    try {
      // Fetch wallet security data
      const [allowancesRes] = await Promise.all([
        fetch(`/api/allowances?wallet=${address}&page=1&pageSize=1000`),
        // Refresh risk data
        fetch(`/api/risk/refresh`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: address })
        })
      ])
      
      const allowances = await allowancesRes.json()
      const highRiskCount = allowances.rows?.filter((r: { risk_score: number }) => r.risk_score > 7).length || 0
      
      // Calculate risk score based on allowances
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
    if (score <= 3) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' }
    if (score <= 6) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' }
  }

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wallet Security</h2>
          <p className="text-gray-600">Connect your wallet to view security settings and monitor your token allowances.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const riskInfo = data ? getRiskLevel(data.riskScore) : { level: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Wallet Security</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPrivateInfo(!showPrivateInfo)}
              className="p-2 text-gray-500 hover:text-gray-700"
              title={showPrivateInfo ? 'Hide full address' : 'Show full address'}
            >
              {showPrivateInfo ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>
        
        {/* Wallet Address */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Connected Wallet</p>
              <p className="font-mono text-sm">
                {showPrivateInfo ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
              </p>
            </div>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Risk Score */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.bg} ${riskInfo.color}`}>
              {riskInfo.level} Risk
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Security Score</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{data?.riskScore || 0}/10</p>
          <p className="text-sm text-gray-600">Based on your token allowances</p>
        </div>

        {/* Total Allowances */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <Check className="h-8 w-8 text-green-600" />
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
              Active
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Allowances</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{data?.totalAllowances || 0}</p>
          <p className="text-sm text-gray-600">Token approvals granted</p>
        </div>

        {/* High Risk Allowances */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
              Attention
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">High Risk</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{data?.highRiskAllowances || 0}</p>
          <p className="text-sm text-gray-600">Require immediate review</p>
        </div>
      </div>

      {/* Security Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={fetchWalletSecurityData}
            disabled={loading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Security Scan'}</span>
          </button>
          
          <a
            href={`/report/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>View Detailed Report</span>
          </a>
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Security Best Practices</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Regularly review and revoke unnecessary token allowances</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Be cautious of unlimited allowances - they pose the highest risk</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Only approve tokens for trusted applications and contracts</span>
          </li>
          <li className="flex items-start space-x-2">
            <Check className="h-4 w-4 mt-0.5 text-blue-600" />
            <span>Monitor your wallet regularly for suspicious activity</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
