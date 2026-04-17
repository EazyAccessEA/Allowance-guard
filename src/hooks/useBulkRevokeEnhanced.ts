'use client'
import { useState, useCallback } from 'react'
import {
  useAccount,
  useCapabilities,
  useConfig,
  useSendCalls,
  useSwitchChain,
} from 'wagmi'
import { waitForCallsStatus } from '@wagmi/core'
import { encodeFunctionData } from 'viem'
import { useRevoke } from './useRevoke'
import { ERC20_ABI, ERC721_ABI } from '@/lib/abi'
// Audit logging will be handled server-side via API calls

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
  /** Chain ids whose revokes were bundled via EIP-5792 `wallet_sendCalls`. */
  batchedChains: number[]
  /** EIP-5792 batch ids, one per batched chain, in `batchedChains` order. */
  batchIds: string[]
}

// EIP-5792 capability key. Modern wallets expose `atomic.status`; some
// earlier revisions used `atomicBatch.supported`. Treat either as support.
function chainSupportsAtomicBatch(
  capabilities: Record<string | number, unknown> | undefined,
  chainId: number,
): boolean {
  if (!capabilities) return false
  const hex = '0x' + chainId.toString(16)
  const forChain = capabilities[chainId] ?? capabilities[hex]
  if (!forChain || typeof forChain !== 'object') return false
  const rec = forChain as Record<string, unknown>
  const atomic = rec['atomic'] as { status?: string } | undefined
  if (atomic?.status === 'supported' || atomic?.status === 'ready') return true
  const atomicBatch = rec['atomicBatch'] as { supported?: boolean } | undefined
  if (atomicBatch?.supported) return true
  return false
}

function encodeRevokeCall(row: AllowanceRow): { to: `0x${string}`; data: `0x${string}` } {
  const to = row.token_address as `0x${string}`
  if (row.standard === 'ERC20') {
    return {
      to,
      data: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [row.spender_address as `0x${string}`, BigInt(0)],
      }),
    }
  }
  if (row.standard === 'ERC721' || row.standard === 'ERC1155') {
    return {
      to,
      data: encodeFunctionData({
        abi: ERC721_ABI,
        functionName: 'setApprovalForAll',
        args: [row.spender_address as `0x${string}`, false],
      }),
    }
  }
  throw new Error(`Unsupported standard: ${row.standard}`)
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
  const { address } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { sendCallsAsync } = useSendCalls()
  const { data: capabilities } = useCapabilities()
  const wagmiConfig = useConfig()
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
    const batchedChains: number[] = []
    const batchIds: string[] = []
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

        // EIP-5792 fast path. If the connected wallet supports atomic
        // batching on this chain and we have ≥2 rows to revoke, send all
        // revokes as a single `wallet_sendCalls` batch. User signs once;
        // one base-tx fee is amortised across N approvals.
        const canBatch =
          chainRows.length >= 2 &&
          chainSupportsAtomicBatch(
            capabilities as Record<string | number, unknown> | undefined,
            chainIdNum,
          )

        if (canBatch && address) {
          try {
            setProgress({
              current: processedRows,
              total: totalRows,
              currentAction: `Batching ${chainRows.length} revokes into one transaction...`,
              estimatedTimeRemaining: calculateEstimatedTime(processedRows, totalRows, startTime),
            })
            onProgress?.({
              current: processedRows,
              total: totalRows,
              currentAction: `Batching ${chainRows.length} revokes into one transaction...`,
            })

            const calls = chainRows.map(encodeRevokeCall)
            const { id: batchId } = await sendCallsAsync({
              calls,
              chainId: chainIdNum,
              account: address as `0x${string}`,
            })

            // Wait for the batch to land. waitForCallsStatus polls until
            // the wallet reports a terminal state and returns per-call
            // receipts with transactionHash values.
            const status = await waitForCallsStatus(wagmiConfig, {
              id: batchId,
              timeout: 120_000,
            })

            const receipts = (status.receipts ?? []) as Array<{
              transactionHash?: `0x${string}`
              status?: 'success' | 'reverted' | number
            }>

            // Pair each row with the corresponding receipt. EIP-5792
            // wallets return receipts in the same order as the calls
            // array we submitted. Some wallets return one combined receipt
            // for the whole batch — handle both by falling back to the
            // first receipt's hash for every row.
            const fallbackHash = receipts[0]?.transactionHash ?? (batchId as `0x${string}`)
            await Promise.all(
              chainRows.map(async (row, idx) => {
                const rec = receipts[idx] ?? receipts[0]
                const txHash = rec?.transactionHash ?? fallbackHash
                const succeeded = rec?.status === 'success' || rec?.status === 1 || !rec?.status
                try {
                  await fetch('/api/receipts', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                      wallet: selectedWallet,
                      chainId: row.chain_id,
                      token: row.token_address,
                      spender: row.spender_address,
                      standard: row.standard,
                      allowanceType: row.allowance_type,
                      preAmount: row.amount || '0',
                      txHash,
                      batched: true,
                      batchId,
                    }),
                  })
                } catch (e) {
                  console.warn('Failed to create receipt for batched revoke:', e)
                }
                if (succeeded) {
                  success++
                } else {
                  failed++
                  errors.push({ row, error: 'reverted in batch' })
                }
              }),
            )

            totalTransactions += 1
            batchedChains.push(chainIdNum)
            batchIds.push(batchId)

            // Single audit event for the whole batch.
            try {
              await fetch('/api/audit/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  action: 'bulk_revoke_batched',
                  actorType: 'user',
                  actorId: selectedWallet,
                  subject: `batch:${batchId}`,
                  category: 'data_modification',
                  severity: 'low',
                  meta: {
                    chainId: chainIdNum,
                    batchId,
                    approvalCount: chainRows.length,
                    transport: 'eip-5792',
                  },
                }),
              })
            } catch (auditError) {
              console.warn('Failed to log batch audit event:', auditError)
            }

            processedRows += chainRows.length
            continue
          } catch (batchErr) {
            // Batched path failed — log once and fall through to the
            // sequential loop. Do NOT throw: sequential is the honest
            // fallback on wallets that advertise support but reject the
            // call (e.g., a downgrade in-flight).
            console.warn('EIP-5792 batch failed; falling back to sequential', batchErr)
            // Re-affirm the chain so the sequential writeContract calls
            // below land on the right network.
            try {
              await switchChainAsync({ chainId: chainIdNum })
            } catch {
              /* non-fatal; useRevoke performs its own chain check */
            }
          }
        }

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
              
              // Audit the successful revocation via API
              try {
                await fetch('/api/audit/log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'bulk_revoke_success',
                    actorType: 'user',
                    actorId: selectedWallet,
                    subject: `${row.chain_id}:${row.token_address}:${row.spender_address}`,
                    category: 'data_modification',
                    severity: 'low',
                    meta: {
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
                  })
                })
              } catch (auditError) {
                console.warn('Failed to log audit event:', auditError)
              }

              success++
              totalTransactions++
              
              return { success: true, row, txHash }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              
              // Audit the failed revocation via API
              try {
                await fetch('/api/audit/log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'bulk_revoke_failed',
                    actorType: 'user',
                    actorId: selectedWallet,
                    subject: `${row.chain_id}:${row.token_address}:${row.spender_address}`,
                    category: 'data_modification',
                    severity: 'medium',
                    meta: {
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
                  })
                })
              } catch (auditError) {
                console.warn('Failed to log audit event:', auditError)
              }

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

      // Audit the bulk operation completion via API
      try {
        await fetch('/api/audit/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'bulk_revoke_completed',
            actorType: 'user',
            actorId: selectedWallet,
            subject: `bulk_revoke_${Date.now()}`,
            category: 'data_modification',
            severity: 'low',
            meta: {
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
          })
        })
      } catch (auditError) {
        console.warn('Failed to log audit event:', auditError)
      }

      const finalResult: BulkRevokeResult = {
        success,
        failed,
        errors,
        totalGasUsed,
        totalTransactions,
        batchedChains,
        batchIds,
      }

      setResult(finalResult)
      return finalResult

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Audit the bulk operation failure via API
      try {
        await fetch('/api/audit/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'bulk_revoke_error',
            actorType: 'user',
            actorId: selectedWallet,
            subject: `bulk_revoke_error_${Date.now()}`,
            category: 'data_modification',
            severity: 'high',
            meta: {
              totalRows: rows.length,
              error: errorMessage,
              duration: Date.now() - startTime
            }
          })
        })
      } catch (auditError) {
        console.warn('Failed to log audit event:', auditError)
      }

      throw error
    } finally {
      setIsRevoking(false)
      setProgress(null)
    }
  }, [revoke, selectedWallet, address, capabilities, sendCallsAsync, switchChainAsync, wagmiConfig])

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
