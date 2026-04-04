// GET /api/allowances/permit2
//
// Scan Permit2 allowances for a wallet on one or all supported chains.
// Query params: wallet (required), chainId (optional — scan all if omitted)

import { NextRequest, NextResponse } from 'next/server'
import { getAddress, isAddress, type Address } from 'viem'
import { limitHit } from '@/lib/ratelimit'
import { pool } from '@/lib/db'
import { scanPermit2Allowances, scanAllChainsPermit2, type Permit2Allowance } from '@/lib/permit2'
import { SUPPORTED_CHAIN_IDS } from '@/config/chains'
import { secureLogger } from '@/lib/secure-logger'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  // Rate limit (public-ish endpoint, but heavier than most)
  const rl = await limitHit('permit2-scan', 60, 10)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': String(rl.remaining),
          'X-RateLimit-Reset': String(rl.ttl),
        },
      },
    )
  }

  const { searchParams } = new URL(req.url)
  const walletRaw = searchParams.get('wallet')
  const chainIdRaw = searchParams.get('chainId')

  if (!walletRaw || !isAddress(walletRaw)) {
    return NextResponse.json(
      { error: 'Missing or invalid wallet address' },
      { status: 400 },
    )
  }

  const wallet = getAddress(walletRaw) as Address

  // Optionally restrict to a single chain
  let chainIds = SUPPORTED_CHAIN_IDS
  if (chainIdRaw) {
    const cid = parseInt(chainIdRaw, 10)
    if (!SUPPORTED_CHAIN_IDS.includes(cid)) {
      return NextResponse.json(
        { error: `Unsupported chain ID: ${cid}` },
        { status: 400 },
      )
    }
    chainIds = [cid]
  }

  try {
    // Discover tokens from the user's existing allowances table
    const tokenQuery = await pool.query(
      `SELECT DISTINCT chain_id, token_address FROM allowances
       WHERE wallet_address = $1 AND chain_id = ANY($2::int[])`,
      [wallet.toLowerCase(), chainIds],
    )

    const tokensByChain: Record<number, Address[]> = {}
    for (const row of tokenQuery.rows) {
      const cid = Number(row.chain_id)
      if (!tokensByChain[cid]) tokensByChain[cid] = []
      tokensByChain[cid].push(getAddress(row.token_address as string) as Address)
    }

    let results: Permit2Allowance[]

    if (chainIds.length === 1) {
      results = await scanPermit2Allowances(wallet, chainIds[0], tokensByChain[chainIds[0]] || [])
    } else {
      results = await scanAllChainsPermit2(wallet, tokensByChain)
    }

    // Serialize bigints for JSON
    const serialized = results.map(a => ({
      chainId: a.chainId,
      token: a.token,
      spender: a.spender,
      spenderLabel: a.spenderLabel,
      amount: a.amount.toString(),
      isUnlimited: a.isUnlimited,
      expiration: a.expiration,
      expirationDate: a.expiration > 0
        ? new Date(a.expiration * 1000).toISOString()
        : null,
      nonce: a.nonce,
      isExpired: a.isExpired,
      riskLevel: a.riskLevel,
    }))

    return NextResponse.json({
      wallet,
      chainIds,
      permit2Allowances: serialized,
      totalCount: serialized.length,
      activeCount: serialized.filter(a => !a.isExpired).length,
      hasPermit2Risk: serialized.some(a => !a.isExpired && (a.riskLevel === 'high' || a.riskLevel === 'critical')),
    })
  } catch (err) {
    secureLogger.error('Permit2 scan failed', { err, wallet })
    return NextResponse.json(
      { error: 'Failed to scan Permit2 allowances' },
      { status: 500 },
    )
  }
}
