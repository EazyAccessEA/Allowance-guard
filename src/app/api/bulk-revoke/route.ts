import { NextRequest, NextResponse } from 'next/server'
import { auditUserAction } from '@/lib/audit-enhanced'
import { secureLogger } from '@/lib/secure-logger'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      walletAddress, 
      allowances, 
      strategy = 'sequential',
      batchSize = 5,
      delayMs = 1000 
    } = body

    // Validate required fields
    if (!walletAddress || !allowances || !Array.isArray(allowances)) {
      return NextResponse.json({ 
        error: 'Missing required fields: walletAddress, allowances' 
      }, { status: 400 })
    }

    if (allowances.length === 0) {
      return NextResponse.json({ 
        error: 'No allowances provided' 
      }, { status: 400 })
    }

    // Validate allowance structure
    for (const allowance of allowances) {
      if (!allowance.chain_id || !allowance.token_address || !allowance.spender_address || !allowance.standard) {
        return NextResponse.json({ 
          error: 'Invalid allowance structure. Required: chain_id, token_address, spender_address, standard' 
        }, { status: 400 })
      }
    }

    // Audit the bulk revoke request
    await auditUserAction(
      'bulk_revoke_requested',
      walletAddress,
      `bulk_revoke_${Date.now()}`,
      {
        walletAddress,
        allowanceCount: allowances.length,
        strategy,
        batchSize,
        delayMs,
        allowances: allowances.map(a => ({
          chainId: a.chain_id,
          tokenAddress: a.token_address,
          spenderAddress: a.spender_address,
          standard: a.standard,
          amount: a.amount,
          isUnlimited: a.is_unlimited
        }))
      },
      req,
      'high',
      'data_modification'
    )

    // Group allowances by chain for better organization
    const groupedByChain = allowances.reduce((acc, allowance) => {
      const chainId = allowance.chain_id
      if (!acc[chainId]) {
        acc[chainId] = []
      }
      acc[chainId].push(allowance)
      return acc
    }, {} as Record<number, typeof allowances>)

    // Gas estimates per standard
    const GAS_PER_STANDARD: Record<string, number> = {
      ERC20: 48_000,
      ERC721: 55_000,
      ERC1155: 52_000,
    }
    const TX_BASE_GAS = 21_000
    const BATCH_DISCOUNT_PER_TX = 0.12

    // Calculate per-tx gas
    const perTxGas = allowances.map((a: { standard: string }) =>
      GAS_PER_STANDARD[a.standard] ?? 48_000,
    )

    const totalAllowances = allowances.length
    const totalGasIndividual = perTxGas.reduce(
      (sum: number, gas: number) => sum + gas + TX_BASE_GAS, 0,
    )

    // Batch savings
    const batchSavings = totalAllowances > 1
      ? (totalAllowances - 1) * TX_BASE_GAS +
        perTxGas.slice(1).reduce((sum: number, gas: number) => sum + Math.floor(gas * BATCH_DISCOUNT_PER_TX), 0)
      : 0
    const totalGasBatch = totalGasIndividual - batchSavings
    const savingsPercent = totalGasIndividual > 0
      ? Math.round((batchSavings / totalGasIndividual) * 100)
      : 0

    const estimatedTime = totalAllowances * 3000 // ~3 seconds per transaction

    // Return planning information
    const response = {
      success: true,
      planning: {
        totalAllowances,
        chains: Object.keys(groupedByChain).length,
        allowancesByChain: Object.entries(groupedByChain).map(([chainId, chainAllowances]) => {
          const chainTxGas = (chainAllowances as typeof allowances).map(
            (a: { standard: string }) => GAS_PER_STANDARD[a.standard] ?? 48_000,
          )
          const chainGasIndividual = chainTxGas.reduce(
            (sum: number, gas: number) => sum + gas + TX_BASE_GAS, 0,
          )
          return {
            chainId: parseInt(chainId),
            count: (chainAllowances as typeof allowances).length,
            estimatedGas: chainGasIndividual,
            estimatedTime: (chainAllowances as typeof allowances).length * 3000,
          }
        }),
        totalEstimatedGas: totalGasIndividual,
        totalEstimatedGasBatch: totalGasBatch,
        gasSavings: batchSavings,
        savingsPercent,
        totalEstimatedTime: estimatedTime,
        strategy,
        batchSize,
        delayMs,
      },
      instructions: {
        message: 'This endpoint provides planning information for bulk revoke operations. Actual revocation must be performed client-side using wallet transactions.',
        steps: [
          '1. Review the planning information above',
          '2. Ensure wallet has sufficient ETH for gas fees',
          '3. Execute revocations using the client-side bulk revoke functionality',
          '4. Monitor progress and handle any failures',
        ],
      },
    }

    return NextResponse.json(response)

  } catch (error) {
    secureLogger.error('Failed to process bulk revoke request', { error })
    
    // Audit the error
    await auditUserAction(
      'bulk_revoke_error',
      null,
      `bulk_revoke_error_${Date.now()}`,
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        requestBody: req.body
      },
      req,
      'high',
      'system'
    )

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

// GET endpoint to retrieve bulk revoke statistics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get('walletAddress')
    const hours = parseInt(searchParams.get('hours') || '24')

    if (!walletAddress) {
      return NextResponse.json({ 
        error: 'Missing walletAddress parameter' 
      }, { status: 400 })
    }

    // This would typically query the database for bulk revoke statistics
    // For now, return mock data
    const stats = {
      walletAddress,
      timeRange: `${hours} hours`,
      totalBulkOperations: 0,
      totalAllowancesRevoked: 0,
      averageAllowancesPerOperation: 0,
      successRate: 0,
      averageGasUsed: 0,
      averageTimePerOperation: 0,
      recentOperations: []
    }

    return NextResponse.json(stats)

  } catch (error) {
    secureLogger.error('Failed to retrieve bulk revoke statistics', { error })
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
