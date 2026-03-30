import { NextResponse } from 'next/server'
import { secureLogger } from '@/lib/secure-logger'

/**
 * GET /api/gas-estimate
 *
 * Returns current gas price (gwei) and ETH price (USD).
 * Uses public APIs with a cache to avoid excessive calls.
 */

// Simple in-memory cache (TTL: 60 seconds)
let cachedData: { gasPriceGwei: number; ethPriceUsd: number; fetchedAt: number } | null = null
const CACHE_TTL_MS = 60_000

export async function GET() {
  // Return cached data if fresh
  if (cachedData && Date.now() - cachedData.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cachedData)
  }

  let gasPriceGwei = 25 // fallback
  let ethPriceUsd = 3200 // fallback

  try {
    // Fetch gas price from eth_gasPrice RPC (use first available RPC)
    const rpcUrl = process.env.ETH_RPC_URL ?? process.env.NEXT_PUBLIC_ETH_RPC_URL
    if (rpcUrl) {
      const gasRes = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_gasPrice',
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000),
      })
      const gasJson = await gasRes.json()
      if (gasJson.result) {
        gasPriceGwei = Math.round(parseInt(gasJson.result, 16) / 1e9)
      }
    }
  } catch (err) {
    secureLogger.warn('Failed to fetch gas price', { err })
  }

  try {
    // Fetch ETH price from CoinGecko (free, no key needed)
    const priceRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { signal: AbortSignal.timeout(5000) },
    )
    const priceJson = await priceRes.json()
    if (priceJson.ethereum?.usd) {
      ethPriceUsd = priceJson.ethereum.usd
    }
  } catch (err) {
    secureLogger.warn('Failed to fetch ETH price', { err })
  }

  cachedData = { gasPriceGwei, ethPriceUsd, fetchedAt: Date.now() }

  return NextResponse.json({
    gasPriceGwei,
    ethPriceUsd,
  })
}
