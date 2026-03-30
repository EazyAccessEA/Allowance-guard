'use client'

import { useState, useMemo, useEffect } from 'react'
import { useBulkRevokeEnhanced } from '@/hooks/useBulkRevokeEnhanced'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Alert } from '@/components/ui/Alert'
import {
  AlertTriangle,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  TrendingDown,
  Fuel,
  DollarSign,
} from 'lucide-react'

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

// ---------------------------------------------------------------------------
// Gas Savings Calculator
// ---------------------------------------------------------------------------

const GAS_PER_ERC20_REVOKE = 48_000
const GAS_PER_ERC721_REVOKE = 55_000
const GAS_PER_ERC1155_REVOKE = 52_000
// Batch revocation amortizes fixed tx overhead (~21k gas base) across N txs
const TX_BASE_GAS = 21_000
// Batch discount: shared calldata overhead savings per additional tx
const BATCH_DISCOUNT_PER_TX = 0.12

function estimateGasForRow(row: AllowanceRow): number {
  switch (row.standard) {
    case 'ERC721': return GAS_PER_ERC721_REVOKE
    case 'ERC1155': return GAS_PER_ERC1155_REVOKE
    default: return GAS_PER_ERC20_REVOKE
  }
}

function GasSavingsCalculator({ selectedRows }: { selectedRows: AllowanceRow[] }) {
  const [gasPrice, setGasPrice] = useState<number | null>(null)
  const [ethPrice, setEthPrice] = useState<number | null>(null)

  useEffect(() => {
    // Fetch live gas price estimate
    fetch('/api/gas-estimate')
      .then(r => r.json())
      .then(data => {
        if (data.gasPriceGwei) setGasPrice(data.gasPriceGwei)
        if (data.ethPriceUsd) setEthPrice(data.ethPriceUsd)
      })
      .catch(() => {
        // Use reasonable defaults
        setGasPrice(25)
        setEthPrice(3200)
      })
  }, [])

  // Calculate gas for each row
  const perRowGas = selectedRows.map(estimateGasForRow)
  const totalGasIndividual = perRowGas.reduce(
    (sum, gas) => sum + gas + TX_BASE_GAS,
    0,
  )

  // Batch savings: first tx pays full base, subsequent txs save the base overhead
  // Plus per-tx calldata discount
  const batchSavings = selectedRows.length > 1
    ? (selectedRows.length - 1) * TX_BASE_GAS +
      perRowGas.slice(1).reduce((sum, gas) => sum + Math.floor(gas * BATCH_DISCOUNT_PER_TX), 0)
    : 0

  const totalGasBatch = totalGasIndividual - batchSavings
  const savingsPercent = totalGasIndividual > 0
    ? Math.round((batchSavings / totalGasIndividual) * 100)
    : 0

  // Convert to ETH and USD
  const currentGasPrice = gasPrice ?? 25 // gwei
  const currentEthPrice = ethPrice ?? 3200 // USD

  const costIndividualEth = (totalGasIndividual * currentGasPrice) / 1e9
  const costBatchEth = (totalGasBatch * currentGasPrice) / 1e9
  const savingsEth = costIndividualEth - costBatchEth

  const costIndividualUsd = costIndividualEth * currentEthPrice
  const costBatchUsd = costBatchEth * currentEthPrice
  const savingsUsd = savingsEth * currentEthPrice

  // Group by chain for breakdown
  const byChain = selectedRows.reduce((acc, row, i) => {
    const key = row.chain_id
    if (!acc[key]) acc[key] = { count: 0, gas: 0 }
    acc[key].count++
    acc[key].gas += perRowGas[i]
    return acc
  }, {} as Record<number, { count: number; gas: number }>)

  return (
    <div className="border-t border-neutral-borders pt-4 mb-4">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <Fuel className="w-5 h-5 text-green-600" />
          <h4 className="text-sm font-semibold text-green-800">Gas Savings Estimate</h4>
        </div>

        {/* Main comparison */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-green-600 mb-1">Individual</div>
            <div className="text-sm font-bold text-green-900">
              {(totalGasIndividual / 1000).toFixed(0)}k gas
            </div>
            <div className="text-xs text-green-600">
              ${costIndividualUsd.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-green-600 mb-1">Batch</div>
            <div className="text-sm font-bold text-green-900">
              {(totalGasBatch / 1000).toFixed(0)}k gas
            </div>
            <div className="text-xs text-green-600">
              ${costBatchUsd.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-green-600 mb-1">You Save</div>
            <div className="text-sm font-bold text-green-700 flex items-center justify-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {savingsPercent}%
            </div>
            <div className="text-xs font-medium text-green-700 flex items-center justify-center gap-0.5">
              <DollarSign className="w-3 h-3" />
              {savingsUsd.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Per-chain breakdown */}
        {Object.keys(byChain).length > 1 && (
          <div className="border-t border-green-200 pt-2">
            <div className="text-xs text-green-600 mb-1">Per-chain breakdown</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(byChain).map(([chainId, { count, gas }]) => (
                <span key={chainId} className="text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">
                  Chain {chainId}: {count} txs • {(gas / 1000).toFixed(0)}k gas
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gas price info */}
        <div className="text-[10px] text-green-500 flex items-center gap-2">
          <span>Gas: {currentGasPrice} gwei</span>
          <span>•</span>
          <span>ETH: ${currentEthPrice.toLocaleString()}</span>
          <span>•</span>
          <span>Estimates only — actual costs may vary</span>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BulkRevokePanel
// ---------------------------------------------------------------------------

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
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-accent" />
            Bulk Revoke
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {analysis.selected} of {analysis.total} selected
            </Badge>
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              size="sm"
              variant="ghost"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Hide Advanced
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show Advanced
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Button
            onClick={handleSelectAll}
            size="sm"
            variant="ghost"
            disabled={isRevoking}
          >
            Select All
          </Button>
          <Button
            onClick={handleSelectNone}
            size="sm"
            variant="ghost"
            disabled={isRevoking}
          >
            Select None
          </Button>
          <Button
            onClick={handleSelectRisky}
            size="sm"
            variant="ghost"
            disabled={isRevoking}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="w-4 h-4" />
            Risky ({analysis.risky.length})
          </Button>
          <Button
            onClick={handleBulkRevoke}
            size="sm"
            variant="primary"
            disabled={isRevoking || !selectedRows.length || !revokeAllowed || !canRevoke}
            loading={isRevoking}
            title={!canRevoke ? 'View-only access' : !revokeAllowed ? 'Connect the selected wallet to revoke' : ''}
          >
            Revoke Selected
          </Button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="border-t border-neutral-borders pt-4 mb-4">
            <h4 className="text-sm font-medium text-neutral-text mb-3">Advanced Selection</h4>
            
            {/* By Chain */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-text mb-2">By Chain</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.byChain).map(([chainId, count]) => (
                  <Button
                    key={chainId}
                    onClick={() => handleSelectByChain(parseInt(chainId))}
                    size="sm"
                    variant="ghost"
                    disabled={isRevoking}
                  >
                    Chain {chainId} ({count})
                  </Button>
                ))}
              </div>
            </div>

            {/* By Spender */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-text mb-2">By Spender</label>
              <div className="flex flex-wrap gap-2">
                {analysis.topSpenders.map(({ address, count, label }) => (
                  <Button
                    key={address}
                    onClick={() => handleSelectBySpender(address)}
                    size="sm"
                    variant="ghost"
                    disabled={isRevoking}
                    title={label || address}
                  >
                    {label || `${address.slice(0, 6)}...`} ({count})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {progress && (
          <div className="border-t border-neutral-borders pt-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-text">Progress</span>
              <span className="text-sm text-neutral-text">
                {progress.current} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-neutral-borders rounded-full h-2 mb-2">
              <div
                className="bg-primary-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-neutral-text">
              <span>{progress.currentAction}</span>
              {progress.estimatedTimeRemaining && progress.estimatedTimeRemaining > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{formatTime(progress.estimatedTimeRemaining)} remaining
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && showResults && (
          <div className="border-t border-neutral-borders pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-neutral-text">Results</h4>
              <Button
                onClick={() => setShowResults(false)}
                size="sm"
                variant="ghost"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-semantic-success">{result.success}</div>
                <div className="text-sm text-neutral-text">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-semantic-danger">{result.failed}</div>
                <div className="text-sm text-neutral-text">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-accent">{result.totalTransactions}</div>
                <div className="text-sm text-neutral-text">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-semantic-info">{formatGas(result.totalGasUsed)}</div>
                <div className="text-sm text-neutral-text">Gas Used</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <Alert variant="danger" icon={<AlertTriangle className="h-4 w-4" />}>
                <div className="font-medium mb-2">Errors ({result.errors.length})</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium">
                        {error.row.token_symbol || 'Token'} → {error.row.spender_label || 'Spender'}
                      </span>
                      : {error.error}
                    </div>
                  ))}
                </div>
              </Alert>
            )}
          </div>
        )}

        {/* Gas Savings Calculator */}
        {selectedRows.length > 0 && (
          <GasSavingsCalculator selectedRows={selectedRows} />
        )}

        {/* Warnings */}
        {selectedRows.length > 0 && (
          <div className="border-t border-neutral-borders pt-4">
            <Alert variant="info" icon={<AlertTriangle className="h-4 w-4" />}>
              <div className="font-medium mb-2">Important</div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Each revocation requires a separate transaction and gas fee</li>
                <li>Estimated time: ~{formatTime(estimateTime(selectedRows))}</li>
                <li>Make sure you have enough ETH for gas fees</li>
                <li>Revocations cannot be undone</li>
              </ul>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
