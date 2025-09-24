'use client'

import React, { useState, useEffect } from 'react'
import { useAllowances, useRiskLevel, useAllowanceFormatter } from '@/hooks/useAllowanceGuard'
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

  const getRiskIcon = (riskLevel: number) => {
    switch (riskLevel) {
      case 1:
        return <CheckCircle className="text-green-500" size={16} />
      case 2:
        return <AlertTriangle className="text-yellow-500" size={16} />
      case 3:
        return <AlertTriangle className="text-orange-500" size={16} />
      case 4:
        return <Shield className="text-red-500" size={16} />
      default:
        return <AlertTriangle className="text-gray-500" size={16} />
    }
  }

  const getRiskColor = (riskLevel: number) => {
    switch (riskLevel) {
      case 1:
        return 'bg-green-100 text-green-800 border-green-200'
      case 2:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 4:
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const themeClasses = currentTheme === 'dark' 
    ? 'bg-gray-900 text-white border-gray-700' 
    : 'bg-white text-gray-900 border-gray-200'

  if (error) {
    return (
      <div className={`${themeClasses} border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="text-red-500" size={20} />
            <h3 className="font-semibold">AllowanceGuard</h3>
          </div>
        </div>
        <div className="text-red-600 text-sm">
          Error loading allowances: {error}
        </div>
        <button
          onClick={refetch}
          className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
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
            <Shield className="text-blue-500" size={20} />
            <h3 className="font-semibold">AllowanceGuard</h3>
            {loading && <RefreshCw className="animate-spin text-gray-500" size={16} />}
          </div>
          <button
            onClick={refetch}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
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
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {displayedAllowances.length === 0 ? (
            <div className="text-center py-6">
              <Shield className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500 text-sm">
                {showRiskOnly ? 'No risky allowances found' : 'No allowances found'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedAllowances.map((allowance, index) => {
                // Get risk info without using hook inside callback
                const riskInfo = allowance.riskLevel === 'high' 
                  ? { color: 'text-red-600', bgColor: 'bg-red-50', label: 'High Risk' }
                  : allowance.riskLevel === 'medium'
                  ? { color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'Medium Risk' }
                  : { color: 'text-green-600', bgColor: 'bg-green-50', label: 'Low Risk' }
                
                return (
                  <div
                    key={allowance.id || index}
                    className={`p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all ${
                      currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
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
                        <p className="text-xs text-gray-500 truncate">
                          Spender: {allowance.spenderName || allowance.spenderAddress}
                        </p>
                        <p className="text-xs text-gray-500">
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
                            className="flex items-center space-x-1 text-xs text-blue-500 hover:text-blue-600"
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
                className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600 mx-auto"
              >
                {showAll ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showAll ? 'Show Less' : `Show All (${allowances.length})`}</span>
              </button>
            </div>
          )}

          {allowances.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => window.open('https://www.allowanceguard.com', '_blank')}
                className="w-full flex items-center justify-center space-x-2 text-sm text-blue-500 hover:text-blue-600"
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

// Export types for external use
export type { AllowanceGuardWidgetProps }
