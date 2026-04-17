'use client'

import React, { useState, useEffect } from 'react'
import { useAllowances, useAllowanceFormatter } from '@/hooks/useAllowanceGuard'
import { Shield, AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react'

export interface AllowanceGuardWidgetProps {
  walletAddress: string
  chainId?: number
  showRiskOnly?: boolean
  maxItems?: number
  theme?: 'light' | 'dark' | 'auto'
  compact?: boolean
  showHeader?: boolean
  onAllowanceClick?: (allowance: unknown) => void
  className?: string
}

export default function AllowanceGuardWidget({
  walletAddress,
  chainId,
  showRiskOnly = false,
  maxItems = 10,
  theme = 'light',
  compact = false,
  showHeader = true,
  onAllowanceClick,
  className = ''
}: AllowanceGuardWidgetProps) {
  const [showAll, setShowAll] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(theme)

  const { data: allowances, loading, error, refetch } = useAllowances({
    walletAddress,
    chainId,
    riskOnly: showRiskOnly,
    pageSize: maxItems,
    enabled: !!walletAddress
  })

  const { formatAllowance } = useAllowanceFormatter()

  // Auto theme detection
  useEffect(() => {
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      setCurrentTheme(mediaQuery.matches ? 'dark' : 'light')
      
      const handler = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light')
      }
      
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      setCurrentTheme(theme)
    }
  }, [theme])

  const displayedAllowances = showAll ? allowances : allowances.slice(0, maxItems)
  const hasMore = allowances.length > maxItems

  // Semantic state ramp — AA on both paper-sub (light) and ink (dark)
  // via the -600/700 steps. The widget is embedded in third-party apps
  // so this is the one AG surface that legitimately supports two themes.
  const getRiskIcon = (riskLevel: number) => {
    switch (riskLevel) {
      case 1:
        return <CheckCircle className="text-semantic-success-700" size={16} />
      case 2:
        return <AlertTriangle className="text-semantic-warning-700" size={16} />
      case 3:
        return <AlertTriangle className="text-semantic-warning-700" size={16} />
      case 4:
        return <Shield className="text-crimson-paper" size={16} />
      default:
        return <AlertTriangle className="text-ink-whisper" size={16} />
    }
  }

  const getRiskColor = (riskLevel: number) => {
    switch (riskLevel) {
      case 1:
        return 'bg-paper-sub text-semantic-success-700 border-semantic-success-600/40'
      case 2:
        return 'bg-paper-sub text-semantic-warning-700 border-semantic-warning-600/40'
      case 3:
        return 'bg-paper-sub text-semantic-warning-700 border-semantic-warning-600/40'
      case 4:
        return 'bg-paper-sub text-crimson-paper border-crimson-paper/40'
      default:
        return 'bg-paper-sub text-ink-muted border-ink-rule'
    }
  }

  const themeClasses = currentTheme === 'dark'
    ? 'bg-ink text-paper border-ink/60'
    : 'bg-paper-sub text-ink border-ink-rule'

  if (error) {
    return (
      <div className={`${themeClasses} border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-crimson-paper" size={20} />
            <h3 className="font-semibold">AllowanceGuard</h3>
          </div>
        </div>
        <div className="text-crimson-paper text-sm">
          Error loading allowances: {error}
        </div>
        <button
          onClick={refetch}
          className="mt-3 px-3 py-1 bg-amber-deep text-paper rounded text-sm hover:bg-amber-deep/90 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className={`${themeClasses} border rounded-lg ${compact ? 'p-3' : 'p-4'} ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-amber-deep" size={20} />
            <h3 className="font-semibold">AllowanceGuard</h3>
            {loading && <RefreshCw className="animate-spin text-ink-whisper" size={16} />}
          </div>
          <button
            onClick={refetch}
            className={`p-1 rounded transition-colors ${
              currentTheme === 'dark' ? 'hover:bg-paper/10' : 'hover:bg-paper-deep'
            }`}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {loading && !allowances.length ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-paper-deep rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-paper-deep rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-paper-deep rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-paper-deep rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {displayedAllowances.length === 0 ? (
            <div className="text-center py-6">
              <Shield className="mx-auto text-ink-whisper mb-2" size={32} />
              <p className="text-ink-muted text-sm">
                {showRiskOnly ? 'No risky allowances found' : 'No allowances found'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAllowances.map((allowance, index) => {
                // Get risk info without using hook inside callback
                const riskInfo = allowance.riskLevel >= 7
                  ? { label: 'High Risk' }
                  : allowance.riskLevel >= 4
                  ? { label: 'Medium Risk' }
                  : { label: 'Low Risk' }

                return (
                  <div
                    key={allowance.id || index}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      currentTheme === 'dark'
                        ? 'bg-paper/5 border-paper/10'
                        : 'bg-paper border-ink-rule'
                    }`}
                    onClick={() => onAllowanceClick?.(allowance)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getRiskIcon(allowance.riskLevel)}
                          <span className="font-medium text-sm truncate">
                            {allowance.tokenName || allowance.tokenSymbol}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted truncate">
                          Spender: {allowance.spenderName || allowance.spenderAddress}
                        </p>
                        <p className="text-xs text-ink-muted">
                          Amount: {formatAllowance(allowance.allowance)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(allowance.riskLevel)}`}>
                          {riskInfo.label}
                        </span>
                        {allowance.riskLevel >= 3 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open('https://www.allowanceguard.com', '_blank')
                            }}
                            className="flex items-center space-x-1 text-xs text-amber-deep hover:underline"
                          >
                            <span>Revoke</span>
                            <ExternalLink size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex items-center space-x-1 text-sm text-amber-deep hover:underline mx-auto"
              >
                {showAll ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showAll ? 'Show Less' : `Show All (${allowances.length})`}</span>
              </button>
            </div>
          )}

          {allowances.length > 0 && (
            <div className={`mt-4 pt-3 border-t ${currentTheme === 'dark' ? 'border-paper/10' : 'border-ink-rule'}`}>
              <button
                onClick={() => window.open('https://www.allowanceguard.com', '_blank')}
                className="w-full flex items-center justify-center space-x-2 text-sm text-amber-deep hover:underline"
              >
                <span>View Full Report</span>
                <ExternalLink size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

