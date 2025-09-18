'use client'
import { useState, useCallback } from 'react'
import { useRevoke } from './useRevoke'
import { auditUserAction } from '@/lib/audit-enhanced'

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

export interface BulkRevokeResult {
  success: number
  failed: number
  errors: Array<{
    row: AllowanceRow
    error: string
  }>
  totalGasUsed: bigint
  totalTransactions: number
}

export interface BulkRevokeProgress {
  current: number
  total: number
  currentAction: string
  estimatedTimeRemaining?: number
  gasEstimate?: bigint
}

export function useBulkRevokeEnhanced(selectedWallet?: string | null) {
  const { revoke } = useRevoke(selectedWallet)
  const [isRevoking, setIsRevoking] = useState(false)
  const [progress, setProgress] = useState<BulkRevokeProgress | null>(null)
  const [result, setResult] = useState<BulkRevokeResult | null>(null)

  const revokeMany = useCallback(async (
    rows: AllowanceRow[], 
    onProgress?: (progress: BulkRevokeProgress) => void
  ): Promise<BulkRevokeResult> => {
    if (!selectedWallet) {
      throw new Error('No wallet selected')
    }

    setIsRevoking(true)
    setProgress(null)
    setResult(null)

    const startTime = Date.now()
    const errors: BulkRevokeResult['errors'] = []
    let success = 0
    let failed = 0
    const totalGasUsed = BigInt(0)
    let totalTransactions = 0

    try {
      // Group by chain for better batching
      const groupedByChain = rows.reduce((acc, row) => {
        if (!acc[row.chain_id]) {
          acc[row.chain_id] = []
        }
        acc[row.chain_id].push(row)
        return acc
      }, {} as Record<number, AllowanceRow[]>)

      const totalRows = rows.length
      let processedRows = 0

      // Process each chain
      for (const [chainId, chainRows] of Object.entries(groupedByChain)) {
        const chainIdNum = parseInt(chainId)
        
        // Update progress
        const currentProgress: BulkRevokeProgress = {
          current: processedRows,
          total: totalRows,
          currentAction: `Processing ${chainRows.length} approvals on chain ${chainIdNum}...`,
          estimatedTimeRemaining: calculateEstimatedTime(processedRows, totalRows, startTime)
        }
        setProgress(currentProgress)
        onProgress?.(currentProgress)

        // Process rows in batches of 5 to avoid overwhelming the network
        const batchSize = 5
        for (let i = 0; i < chainRows.length; i += batchSize) {
          const batch = chainRows.slice(i, i + batchSize)
          
          // Process batch concurrently
          const batchPromises = batch.map(async (row, batchIndex) => {
            const globalIndex = processedRows + batchIndex
            
            try {
              const currentProgress: BulkRevokeProgress = {
                current: globalIndex,
                total: totalRows,
                currentAction: `Revoking ${row.token_symbol || 'token'} allowance for ${row.spender_label || 'spender'}...`,
                estimatedTimeRemaining: calculateEstimatedTime(globalIndex, totalRows, startTime)
              }
              setProgress(currentProgress)
              onProgress?.(currentProgress)

              // Add delay between transactions to avoid nonce issues
              if (batchIndex > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000))
              }

              const txHash = await revoke(row)
              
              // Audit the successful revocation
              await auditUserAction(
                'bulk_revoke_success',
                selectedWallet,
                `${row.chain_id}:${row.token_address}:${row.spender_address}`,
                {
                  chainId: row.chain_id,
                  tokenAddress: row.token_address,
                  spenderAddress: row.spender_address,
                  standard: row.standard,
                  amount: row.amount,
                  isUnlimited: row.is_unlimited,
                  txHash,
                  batchIndex: globalIndex,
                  totalRows
                }
              )

              success++
              totalTransactions++
              
              return { success: true, row, txHash }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              
              // Audit the failed revocation
              await auditUserAction(
                'bulk_revoke_failed',
                selectedWallet,
                `${row.chain_id}:${row.token_address}:${row.spender_address}`,
                {
                  chainId: row.chain_id,
                  tokenAddress: row.token_address,
                  spenderAddress: row.spender_address,
                  standard: row.standard,
                  amount: row.amount,
                  isUnlimited: row.is_unlimited,
                  error: errorMessage,
                  batchIndex: globalIndex,
                  totalRows
                }
              )

              errors.push({ row, error: errorMessage })
              failed++
              
              return { success: false, row, error: errorMessage }
            }
          })

          // Wait for batch to complete
          await Promise.allSettled(batchPromises)
          processedRows += batch.length

          // Add delay between batches
          if (i + batchSize < chainRows.length) {
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
      }

      // Final progress update
      const finalProgress: BulkRevokeProgress = {
        current: totalRows,
        total: totalRows,
        currentAction: 'Bulk revocation completed',
        estimatedTimeRemaining: 0
      }
      setProgress(finalProgress)
      onProgress?.(finalProgress)

      // Audit the bulk operation completion
      await auditUserAction(
        'bulk_revoke_completed',
        selectedWallet,
        `bulk_revoke_${Date.now()}`,
        {
          totalRows,
          success,
          failed,
          totalTransactions,
          totalGasUsed: totalGasUsed.toString(),
          duration: Date.now() - startTime,
          errors: errors.map(e => ({ 
            token: e.row.token_address, 
            spender: e.row.spender_address, 
            error: e.error 
          }))
        }
      )

      const finalResult: BulkRevokeResult = {
        success,
        failed,
        errors,
        totalGasUsed,
        totalTransactions
      }

      setResult(finalResult)
      return finalResult

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Audit the bulk operation failure
      await auditUserAction(
        'bulk_revoke_error',
        selectedWallet,
        `bulk_revoke_error_${Date.now()}`,
        {
          totalRows: rows.length,
          error: errorMessage,
          duration: Date.now() - startTime
        }
      )

      throw error
    } finally {
      setIsRevoking(false)
      setProgress(null)
    }
  }, [revoke, selectedWallet])

  const revokeByChain = useCallback(async (
    rows: AllowanceRow[],
    chainId: number,
    onProgress?: (progress: BulkRevokeProgress) => void
  ): Promise<BulkRevokeResult> => {
    const chainRows = rows.filter(row => row.chain_id === chainId)
    return revokeMany(chainRows, onProgress)
  }, [revokeMany])

  const revokeRisky = useCallback(async (
    rows: AllowanceRow[],
    onProgress?: (progress: BulkRevokeProgress) => void
  ): Promise<BulkRevokeResult> => {
    const riskyRows = rows.filter(row => 
      row.is_unlimited || 
      (row.risk_flags && row.risk_flags.includes('STALE')) ||
      row.risk_score > 50
    )
    return revokeMany(riskyRows, onProgress)
  }, [revokeMany])

  const revokeBySpender = useCallback(async (
    rows: AllowanceRow[],
    spenderAddress: string,
    onProgress?: (progress: BulkRevokeProgress) => void
  ): Promise<BulkRevokeResult> => {
    const spenderRows = rows.filter(row => 
      row.spender_address.toLowerCase() === spenderAddress.toLowerCase()
    )
    return revokeMany(spenderRows, onProgress)
  }, [revokeMany])

  const estimateGas = useCallback(async (rows: AllowanceRow[]): Promise<bigint> => {
    // This would require implementing gas estimation
    // For now, return a rough estimate based on transaction count
    return BigInt(rows.length * 50000) // ~50k gas per transaction
  }, [])

  const estimateTime = useCallback((rows: AllowanceRow[]): number => {
    // Estimate time based on number of transactions and network delays
    const baseTimePerTx = 3000 // 3 seconds per transaction
    const batchDelay = 2000 // 2 seconds between batches
    const batchSize = 5
    
    const batches = Math.ceil(rows.length / batchSize)
    const totalTime = (rows.length * baseTimePerTx) + ((batches - 1) * batchDelay)
    
    return totalTime
  }, [])

  return {
    revokeMany,
    revokeByChain,
    revokeRisky,
    revokeBySpender,
    estimateGas,
    estimateTime,
    isRevoking,
    progress,
    result
  }
}

function calculateEstimatedTime(processed: number, total: number, startTime: number): number {
  if (processed === 0) return 0
  
  const elapsed = Date.now() - startTime
  const rate = processed / elapsed
  const remaining = total - processed
  
  return Math.round(remaining / rate)
}
