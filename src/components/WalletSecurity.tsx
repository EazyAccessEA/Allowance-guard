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
 if (pct <= 0.3) return { stroke: '#22C55E', text: 'text-semantic-success-700 ', label: 'Low' }
 if (pct <= 0.6) return { stroke: '#F59E0B', text: 'text-amber-deep ', label: 'Medium' }
 return { stroke: '#EF4444', text: 'text-crimson-paper ', label: 'High' }
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
 className="stroke-neutral-200"
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
 <span className="text-xs text-ink-whisper">/ {max}</span>
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
 if (score <= 3) return { level: 'Low', color: 'text-semantic-success-700 ', bg: 'bg-paper-sub ', border: 'border-semantic-success-600/40 ' }
 if (score <= 6) return { level: 'Medium', color: 'text-amber-deep ', bg: 'bg-amber-50 ', border: 'border-amber-200 ' }
 return { level: 'High', color: 'text-crimson-paper ', bg: 'bg-paper-sub ', border: 'border-crimson-paper/40 ' }
 }

 if (!isConnected || !address) {
 return (
 <div className="max-w-4xl mx-auto p-6">
 <div className="text-center py-12">
 <Shield className="mx-auto h-12 w-12 text-ink-whisper mb-4" />
 <h2 className="text-xl font-semibold text-ink mb-2">Wallet Security</h2>
 <p className="text-ink-muted">Connect your wallet to view security settings and monitor your token allowances.</p>
 </div>
 </div>
 )
 }

 if (loading) {
 return (
 <div className="max-w-4xl mx-auto p-6">
 <div className="animate-pulse">
 <div className="h-8 bg-neutral-200 rounded w-1/3 mb-6"></div>
 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 {[1, 2, 3].map(i => (
 <div key={i} className="h-32 bg-neutral-200 rounded-xl"></div>
 ))}
 </div>
 </div>
 </div>
 )
 }

 const riskInfo = data ? getRiskLevel(data.riskScore) : { level: 'Unknown', color: 'text-ink-muted', bg: 'bg-paper-sub', border: 'border-neutral-200 ' }

 return (
 <div className="max-w-4xl mx-auto p-6">
 {/* Header */}
 <div className="mb-8">
 <div className="flex items-center justify-between mb-4">
 <h1 className="text-2xl font-bold text-ink">Wallet Security</h1>
 <div className="flex items-center space-x-2">
 <button
 onClick={() => setShowPrivateInfo(!showPrivateInfo)}
 className="p-2 text-ink-whisper hover:text-ink rounded-lg transition-colors"
 title={showPrivateInfo ? 'Hide full address' : 'Show full address'}
 >
 {showPrivateInfo ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
 </button>
 </div>
 </div>

 {/* Wallet Address */}
 <div className="bg-paper-sub rounded-xl p-4 mb-6 border border-ink-rule">
 <div className="flex items-center justify-between">
 <div>
 <p className="text-sm font-medium text-ink-muted mb-1">Connected Wallet</p>
 <p className="font-mono text-sm text-ink">
 {showPrivateInfo ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
 </p>
 </div>
 <button
 onClick={copyAddress}
 className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-paper-sub border border-ink-rule rounded-lg hover:bg-paper-sub text-ink transition-colors"
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
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6 backdrop-blur-xs">
 <div className="flex items-center justify-between mb-4">
 <Shield className="h-6 w-6 text-amber-deep" />
 <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${riskInfo.bg} ${riskInfo.color} ${riskInfo.border} border`}>
 {riskInfo.level} Risk
 </span>
 </div>
 <h3 className="text-sm font-semibold text-ink-muted mb-3">Security Score</h3>
 <RadialGauge score={data?.riskScore || 0} />
 <p className="text-xs text-ink-whisper text-center mt-2">Based on your token allowances</p>
 </div>

 {/* Total Allowances */}
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6 backdrop-blur-xs">
 <div className="flex items-center justify-between mb-4">
 <Check className="h-6 w-6 text-semantic-success-700" />
 <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-paper-sub text-semantic-success-700 border border-semantic-success-600/40">
 Active
 </span>
 </div>
 <h3 className="text-sm font-semibold text-ink-muted mb-1">Total Allowances</h3>
 <p className="text-4xl font-bold text-ink mb-2">{data?.totalAllowances || 0}</p>
 <p className="text-xs text-ink-whisper">Token approvals granted</p>
 </div>

 {/* High Risk Allowances */}
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6 backdrop-blur-xs">
 <div className="flex items-center justify-between mb-4">
 <AlertTriangle className="h-6 w-6 text-crimson-paper" />
 <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-paper-sub text-crimson-paper border border-crimson-paper/40">
 Attention
 </span>
 </div>
 <h3 className="text-sm font-semibold text-ink-muted mb-1">High Risk</h3>
 <p className="text-4xl font-bold text-ink mb-2">{data?.highRiskAllowances || 0}</p>
 <p className="text-xs text-ink-whisper">Require immediate review</p>
 </div>
 </div>

 {/* Security Actions */}
 <div className="bg-paper-sub border border-ink-rule rounded-xl p-6">
 <h3 className="text-lg font-semibold text-ink mb-4">Security Actions</h3>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <button
 onClick={fetchWalletSecurityData}
 disabled={loading}
 className="flex items-center justify-center space-x-2 px-4 py-3 bg-amber-deep text-ink rounded-xl hover:bg-amber-deep transition-colors disabled:opacity-50"
 >
 <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
 <span>{loading ? 'Refreshing...' : 'Refresh Security Scan'}</span>
 </button>

 <a
 href={`/report/${address}`}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center justify-center space-x-2 px-4 py-3 bg-neutral-100 text-ink rounded-xl hover:bg-neutral-200 transition-colors"
 >
 <ExternalLink className="h-5 w-5" />
 <span>View Detailed Report</span>
 </a>
 </div>
 </div>

 {/* Security Tips */}
 <div className="mt-8 bg-paper-sub border border-amber-deep/40 rounded-xl p-6">
 <h3 className="text-lg font-semibold text-amber-deep mb-3">Security Best Practices</h3>
 <ul className="space-y-2.5 text-sm text-amber-deep">
 <li className="flex items-start space-x-2">
 <Check className="h-4 w-4 mt-0.5 text-amber-deep flex-shrink-0" />
 <span>Regularly review and revoke unnecessary token allowances</span>
 </li>
 <li className="flex items-start space-x-2">
 <Check className="h-4 w-4 mt-0.5 text-amber-deep flex-shrink-0" />
 <span>Be cautious of unlimited allowances - they pose the highest risk</span>
 </li>
 <li className="flex items-start space-x-2">
 <Check className="h-4 w-4 mt-0.5 text-amber-deep flex-shrink-0" />
 <span>Only approve tokens for trusted applications and contracts</span>
 </li>
 <li className="flex items-start space-x-2">
 <Check className="h-4 w-4 mt-0.5 text-amber-deep flex-shrink-0" />
 <span>Monitor your wallet regularly for suspicious activity</span>
 </li>
 </ul>
 </div>
 </div>
 )
}
