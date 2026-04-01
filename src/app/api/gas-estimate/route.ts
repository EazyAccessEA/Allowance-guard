import { NextRequest, NextResponse } from 'next/server'
import { secureLogger } from '@/lib/secure-logger'
import { getGasEstimate, getAllGasEstimates } from '@/lib/gas'
import { SUPPORTED_CHAIN_IDS } from '@/config/chains'

/**
 * GET /api/gas-estimate
 *
 * Chain-aware gas estimation. Supports L2 gas models (Arbitrum, OP Stack).
 *
 * Query params:
 *   chainId (optional) — get estimate for a specific chain
 *   If omitted, returns estimates for all supported chains.
 *
 * Backward compatible: still returns gasPriceGwei and ethPriceUsd at top level
 * (from Ethereum mainnet) for existing consumers.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const chainIdParam = searchParams.get('chainId')

  try {
    if (chainIdParam) {
      // Single chain
      const chainId = parseInt(chainIdParam, 10)
      if (!SUPPORTED_CHAIN_IDS.includes(chainId)) {
        return NextResponse.json(
          { error: `Unsupported chain: ${chainId}` },
          { status: 400 },
        )
      }
      const estimate = await getGasEstimate(chainId)
      return NextResponse.json({
        // Backward compat fields
        gasPriceGwei: estimate.gasPriceGwei,
        ethPriceUsd: estimate.nativeTokenPriceUsd,
        // Full estimate
        estimate,
      })
    }

    // All chains
    const estimates = await getAllGasEstimates()

    // Backward compat: extract mainnet values
    const mainnet = estimates.find(e => e.chainId === 1)

    return NextResponse.json({
      // Backward compat
      gasPriceGwei: mainnet?.gasPriceGwei ?? 25,
      ethPriceUsd: mainnet?.nativeTokenPriceUsd ?? 3200,
      // Full per-chain estimates
      estimates,
    })
  } catch (err) {
    secureLogger.error('Gas estimation failed', { err })
    return NextResponse.json({
      gasPriceGwei: 25,
      ethPriceUsd: 3200,
      estimates: [],
    })
  }
}
