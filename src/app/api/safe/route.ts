/**
 * GET /api/safe?address=0x...&chainId=1 — Get Safe info + allowances
 * POST /api/safe — Build batch revoke or governance proposal
 *
 * Requires session auth + Sentinel tier.
 */
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import {
  getSafeInfo,
  isSafeWallet,
  getSafeAllowances,
  buildBatchRevokeTxs,
  buildGovernanceProposal,
} from '@/lib/safe-integration'

export const runtime = 'nodejs'

const getSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.coerce.number().int().positive(),
})

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const feature = await checkFeature(session.userId, 'teams')
  if (!feature.allowed) {
    return NextResponse.json(
      { error: 'Sentinel tier required for multi-sig integration', requiredPlan: feature.requiredPlan },
      { status: 403 },
    )
  }

  const rawParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = getSchema.safeParse(rawParams)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid params', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { address, chainId } = parsed.data

  try {
    const [isSafe, safeInfo, allowances] = await Promise.all([
      isSafeWallet(address, chainId),
      getSafeInfo(address, chainId),
      getSafeAllowances(address, chainId),
    ])

    return NextResponse.json({
      isSafe,
      safeInfo,
      allowances,
      summary: {
        totalAllowances: allowances.length,
        highRisk: allowances.filter((a) => a.riskScore >= 70).length,
        unlimited: allowances.filter((a) => a.isUnlimited).length,
      },
    })
  } catch (error) {
    console.error('Safe info error:', error)
    return NextResponse.json({ error: 'Failed to fetch Safe info' }, { status: 500 })
  }
}

const postSchema = z.object({
  action: z.enum(['batch-revoke', 'governance-proposal']),
  safeAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chainId: z.number().int().positive(),
  allowanceIds: z
    .array(
      z.object({
        tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        spenderAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        tokenSymbol: z.string().optional(),
        spenderLabel: z.string().optional(),
      }),
    )
    .min(1)
    .max(50),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const feature = await checkFeature(session.userId, 'teams')
  if (!feature.allowed) {
    return NextResponse.json(
      { error: 'Sentinel tier required', requiredPlan: feature.requiredPlan },
      { status: 403 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { action, safeAddress, chainId, allowanceIds } = parsed.data

  try {
    if (action === 'batch-revoke') {
      const transactions = buildBatchRevokeTxs(allowanceIds)
      return NextResponse.json({
        action: 'batch-revoke',
        safeAddress,
        chainId,
        transactions,
        totalTxs: transactions.length,
        estimatedGas: transactions.length * 46_000,
      })
    }

    if (action === 'governance-proposal') {
      const proposal = buildGovernanceProposal(safeAddress, chainId, allowanceIds, 'revoke')
      return NextResponse.json({
        action: 'governance-proposal',
        proposal,
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Safe action error:', error)
    return NextResponse.json({ error: 'Failed to build transactions' }, { status: 500 })
  }
}
