'use client'

import { useState, useMemo } from 'react'
import { useBulkRevokeEnhanced } from '@/hooks/useBulkRevokeEnhanced'
import { HexButton } from './HexButton'

type AllowanceRow = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
  risk_score: number
  risk_flags: string[]
  token_name?: string | null
  token_symbol?: string | null
  spender_label?: string | null
}

interface BulkRevokePanelProps {
  data: AllowanceRow[]
  selectedRows: AllowanceRow[]
  onSelectionChange: (rows: AllowanceRow[]) => void
  onRefresh: () => Promise<void>
  selectedWallet: string | null
  connectedAddress: string | undefined
  canRevoke?: boolean
}

export default function BulkRevokePanel({
  data,
  selectedRows,
  onSelectionChange,
  onRefresh,
  selectedWallet,
  connectedAddress,
  canRevoke = true
}: BulkRevokePanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showResults, setShowResults] = useState(false)
  
  const {
    revokeMany,
    estimateTime,
    isRevoking,
    progress,
    result
  } = useBulkRevokeEnhanced(selectedWallet)

  const revokeAllowed = 
    !!selectedWallet &&
    !!connectedAddress &&
    selectedWallet.toLowerCase() === connectedAddress.toLowerCase()

  // Analyze data for smart suggestions
  const analysis = useMemo(() => {
    const risky = data.filter(r => r.is_unlimited || (r.risk_flags || []).includes('STALE'))
    const byChain = data.reduce((acc, row) => {
      acc[row.chain_id] = (acc[row.chain_id] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    const bySpender = data.reduce((acc, row) => {
      const key = row.spender_address.toLowerCase()
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topSpenders = Object.entries(bySpender)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([address, count]) => ({
        address,
        count,
        label: data.find(r => r.spender_address.toLowerCase() === address)?.spender_label
      }))

    return {
      risky,
      byChain,
      topSpenders,
      total: data.length,
      selected: selectedRows.length
    }
  }, [data, selectedRows])

  const handleSelectAll = () => {
    onSelectionChange(data)
  }

  const handleSelectNone = () => {
    onSelectionChange([])
  }

  const handleSelectRisky = () => {
    onSelectionChange(analysis.risky)
  }

  const handleSelectByChain = (chainId: number) => {
    const chainRows = data.filter(r => r.chain_id === chainId)
    onSelectionChange(chainRows)
  }

  const handleSelectBySpender = (spenderAddress: string) => {
    const spenderRows = data.filter(r => r.spender_address.toLowerCase() === spenderAddress.toLowerCase())
    onSelectionChange(spenderRows)
  }

  const handleBulkRevoke = async () => {
    if (!selectedRows.length) return

    try {
      await revokeMany(selectedRows, () => {
        // Progress is handled by the hook
      })
      
      setShowResults(true)
      await onRefresh()
    } catch (error) {
      console.error('Bulk revoke failed:', error)
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.round(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatGas = (gas: bigint) => {
    const gasStr = gas.toString()
    if (gasStr.length <= 6) return `${gasStr} gas`
    return `${(Number(gas) / 1000000).toFixed(1)}M gas`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Bulk Revoke</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {analysis.selected} of {analysis.total} selected
          </span>
          <HexButton
            onClick={() => setShowAdvanced(!showAdvanced)}
            size="sm"
            variant="ghost"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </HexButton>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <HexButton
          onClick={handleSelectAll}
          size="sm"
          variant="ghost"
          disabled={isRevoking}
        >
          Select All
        </HexButton>
        <HexButton
          onClick={handleSelectNone}
          size="sm"
          variant="ghost"
          disabled={isRevoking}
        >
          Select None
        </HexButton>
        <HexButton
          onClick={handleSelectRisky}
          size="sm"
          variant="ghost"
          disabled={isRevoking}
        >
          Select Risky ({analysis.risky.length})
        </HexButton>
        <HexButton
          onClick={handleBulkRevoke}
          size="sm"
          variant="primary"
          disabled={isRevoking || !selectedRows.length || !revokeAllowed || !canRevoke}
          loading={isRevoking}
          title={!canRevoke ? 'View-only access' : !revokeAllowed ? 'Connect the selected wallet to revoke' : ''}
        >
          Revoke Selected
        </HexButton>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced Selection</h4>
          
          {/* By Chain */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">By Chain</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analysis.byChain).map(([chainId, count]) => (
                <HexButton
                  key={chainId}
                  onClick={() => handleSelectByChain(parseInt(chainId))}
                  size="sm"
                  variant="ghost"
                  disabled={isRevoking}
                >
                  Chain {chainId} ({count})
                </HexButton>
              ))}
            </div>
          </div>

          {/* By Spender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">By Spender</label>
            <div className="flex flex-wrap gap-2">
              {analysis.topSpenders.map(({ address, count, label }) => (
                <HexButton
                  key={address}
                  onClick={() => handleSelectBySpender(address)}
                  size="sm"
                  variant="ghost"
                  disabled={isRevoking}
                  title={label || address}
                >
                  {label || `${address.slice(0, 6)}...`} ({count})
                </HexButton>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      {progress && (
        <div className="border-t border-gray-200 pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Progress</span>
            <span className="text-sm text-gray-600">
              {progress.current} / {progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{progress.currentAction}</span>
            {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
              <span>~{formatTime(progress.estimatedTimeRemaining)} remaining</span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {result && showResults && (
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Results</h4>
            <button
              onClick={() => setShowResults(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.success}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.totalTransactions}</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{formatGas(result.totalGasUsed)}</div>
              <div className="text-sm text-gray-600">Gas Used</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <h5 className="text-sm font-medium text-red-800 mb-2">Errors ({result.errors.length})</h5>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="text-xs text-red-700">
                    <span className="font-medium">
                      {error.row.token_symbol || 'Token'} → {error.row.spender_label || 'Spender'}
                    </span>
                    : {error.error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {selectedRows.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Each revocation requires a separate transaction and gas fee</li>
                    <li>Estimated time: ~{formatTime(estimateTime(selectedRows))}</li>
                    <li>Make sure you have enough ETH for gas fees</li>
                    <li>Revocations cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
