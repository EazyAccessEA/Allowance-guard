/**
 * POST /api/risk/assess — Pre-signing risk assessment for browser extension
 *
 * Public endpoint (no API key required) used by the AllowanceGuard browser
 * extension to evaluate approve() and permit() calls before the user signs.
 *
 * Body: {
 *   walletAddress: string,
 *   tokenAddress: string,
 *   spenderAddress: string,
 *   chainId: number,
 *   amount?: string,
 *   functionSignature?: string  // e.g. "approve" | "permit" | "setApprovalForAll"
 * }
 */
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { pool } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/cache'

export const runtime = 'nodejs'

const assessSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v) => v.toLowerCase()),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v) => v.toLowerCase()),
  spenderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v) => v.toLowerCase()),
  chainId: z.number().int().positive(),
  amount: z.string().optional(),
  functionSignature: z.enum(['approve', 'permit', 'setApprovalForAll', 'permit2']).optional(),
})

interface RiskIssue {
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
}

// Known malicious addresses (subset for fast checking)
const KNOWN_EXPLOITS = new Set([
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
  '0x629e7da20197a5429d30da36e77d06cdf796b71a',
  '0x56d8b635a7c88fd1104d23d632af40c1c3aac4e3',
  '0xb66cd966670d962c227b3eaba30a872dbfb995db',
  '0xdce5d6b41c32f578f875efffc0d422c57a75d7d8',
  '0x4bed6cb142b7677079df7e411772c9982dcbb40e',
  '0x0d043128146654c7683fbf30ac98d7b2285ded00',
  '0x1fcdb04d0c5364fbd92c73ca8af9baa72c269107',
  '0xc8a65fadf0e0ddaf421f28feab69bf6e2e589963',
  '0x50275e0b7261559ce1644014d4b78d4aa63be836',
  '0x3a23f943181408eac424116af7b7790c94cb97a5',
  '0x27e920b3ebd9a91fb24e3aa5b0e930f0eabed15f',
])

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    )
  }

  const parsed = assessSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { walletAddress, tokenAddress, spenderAddress, chainId, amount, functionSignature } = parsed.data

  // Check cache
  const cacheKey = `risk:assess:${chainId}:${tokenAddress}:${spenderAddress}:${amount ?? 'default'}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    return NextResponse.json(cached)
  }

  try {
    const issues: RiskIssue[] = []
    let riskLevel = 0

    // 1. Known exploit address check (instant)
    if (KNOWN_EXPLOITS.has(spenderAddress)) {
      issues.push({
        code: 'KNOWN_EXPLOIT',
        severity: 'critical',
        message: 'This spender address is associated with a known exploit or hack. DO NOT APPROVE.',
      })
      riskLevel = 4
    }

    // 2. Check if spender is known and trusted
    const { rows: spenderRows } = await pool.query(
      `SELECT label, trust FROM spender_labels WHERE chain_id=$1 AND address=$2`,
      [chainId, spenderAddress],
    )
    const spenderInfo = spenderRows[0]

    if (!spenderInfo && riskLevel < 4) {
      issues.push({
        code: 'UNKNOWN_SPENDER',
        severity: 'high',
        message: 'This spender is not in our verified database. Proceed with extreme caution.',
      })
      riskLevel = Math.max(riskLevel, 3)
    } else if (spenderInfo && spenderInfo.trust !== 'trusted') {
      issues.push({
        code: 'UNTRUSTED_SPENDER',
        severity: 'medium',
        message: `Spender "${spenderInfo.label}" is known but not fully trusted.`,
      })
      riskLevel = Math.max(riskLevel, 2)
    }

    // 3. Check unlimited approval
    const isUnlimited = amount === 'unlimited' ||
      amount === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' ||
      (amount && BigInt(amount) > BigInt('0xffffffffffffffffffffffffffff'))

    if (isUnlimited) {
      issues.push({
        code: 'UNLIMITED_APPROVAL',
        severity: 'high',
        message: 'This is an unlimited approval. Consider approving only the exact amount needed.',
      })
      riskLevel = Math.max(riskLevel, 3)
    }

    // 4. Check if permit() or permit2 (higher risk than approve)
    if (functionSignature === 'permit' || functionSignature === 'permit2') {
      issues.push({
        code: 'PERMIT_SIGNATURE',
        severity: 'medium',
        message: 'Permit signatures can be replayed if the spender is malicious. Verify the spender carefully.',
      })
      riskLevel = Math.max(riskLevel, 2)
    }

    // 5. setApprovalForAll grants access to ALL tokens in the collection
    if (functionSignature === 'setApprovalForAll') {
      issues.push({
        code: 'APPROVAL_FOR_ALL',
        severity: 'high',
        message: 'This grants access to ALL tokens in this collection, not just one.',
      })
      riskLevel = Math.max(riskLevel, 3)
    }

    // 6. Check spender's history with other wallets
    const { rows: historyRows } = await pool.query(
      `SELECT
         COUNT(DISTINCT wallet_address)::int AS affected_wallets,
         COUNT(*) FILTER (WHERE risk_score >= 70)::int AS high_risk_count
       FROM allowances
       WHERE chain_id=$1 AND spender_address=$2`,
      [chainId, spenderAddress],
    )
    const history = historyRows[0]
    if (Number(history?.high_risk_count) > 0) {
      issues.push({
        code: 'RISKY_HISTORY',
        severity: 'critical',
        message: `This spender has ${history.high_risk_count} high-risk allowance(s) across ${history.affected_wallets} wallet(s).`,
      })
      riskLevel = Math.max(riskLevel, 4)
    }

    // 7. Check if token is known
    const { rows: tokenRows } = await pool.query(
      `SELECT name, symbol, decimals, price_usd FROM token_metadata
       WHERE chain_id=$1 AND token_address=$2`,
      [chainId, tokenAddress],
    )
    const tokenInfo = tokenRows[0]
    if (!tokenInfo) {
      issues.push({
        code: 'UNKNOWN_TOKEN',
        severity: 'medium',
        message: 'This token is not in our metadata database. It may be new or potentially malicious.',
      })
      riskLevel = Math.max(riskLevel, 2)
    }

    // 8. Check contract verification
    const { rows: verifyRows } = await pool.query(
      `SELECT verified FROM contract_verification_cache
       WHERE chain_id=$1 AND address=$2 AND checked_at > NOW() - INTERVAL '7 days'`,
      [chainId, spenderAddress],
    )
    if (verifyRows.length > 0 && !verifyRows[0].verified) {
      issues.push({
        code: 'UNVERIFIED_CONTRACT',
        severity: 'medium',
        message: 'The spender contract source code is not verified on the block explorer.',
      })
      riskLevel = Math.max(riskLevel, 2)
    }

    const recommendation =
      riskLevel >= 4 ? 'REJECT — Do not approve this transaction.'
        : riskLevel >= 3 ? 'CAUTION — Review carefully. Consider a limited amount instead.'
          : riskLevel >= 2 ? 'MODERATE — Appears mostly safe but verify the spender.'
            : 'OK — Low risk approval.'

    const payload = {
      riskLevel,
      riskLevelText: riskLevel >= 4 ? 'Critical' : riskLevel >= 3 ? 'High' : riskLevel >= 2 ? 'Medium' : riskLevel > 0 ? 'Low' : 'Safe',
      issues: issues.map(i => i.message),
      issueDetails: issues,
      tokenName: tokenInfo?.name ?? 'Unknown Token',
      tokenSymbol: tokenInfo?.symbol ?? null,
      spenderName: spenderInfo?.label ?? 'Unknown Contract',
      spenderTrusted: spenderInfo?.trust === 'trusted',
      isUnlimited: !!isUnlimited,
      affectedWallets: Number(history?.affected_wallets ?? 0),
      recommendation,
      dashboardUrl: `https://www.allowanceguard.com/report/${walletAddress}`,
    }

    await cacheSet(cacheKey, payload, 30)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('risk/assess error:', error)
    return NextResponse.json(
      { error: 'Failed to assess risk' },
      { status: 500 },
    )
  }
}
