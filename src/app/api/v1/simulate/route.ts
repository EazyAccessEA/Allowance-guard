/**
 * POST /api/v1/simulate — Time Machine simulation
 *
 * Requires API key authentication.
 * Body: { wallet: "0x...", chainId?: number, revokeAll?: boolean, revokeSpenders?: string[] }
 *
 * Simulates what a wallet's risk profile would look like if specific
 * allowances were revoked. Returns before/after risk comparison.
 */
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest, apiServerError } from '@/lib/api-response'
import { pool } from '@/lib/db'
import { walletAddressSchema } from '@/lib/validation'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const simulateSchema = z.object({
  wallet: walletAddressSchema,
  chainId: z.number().int().positive().optional(),
  revokeAll: z.boolean().optional().default(false),
  revokeSpenders: z
    .array(z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v: string) => v.toLowerCase()))
    .optional(),
})

function computeRiskScore(stats: {
  total: number
  unlimited: number
  highRisk: number
  mediumRisk: number
}): number {
  if (stats.total === 0) return 0
  const unlimitedWeight = Math.min(stats.unlimited * 15, 50)
  const highRiskWeight = Math.min(stats.highRisk * 10, 30)
  const mediumRiskWeight = Math.min(stats.mediumRisk * 3, 15)
  const volumeWeight = Math.min(Math.floor(stats.total / 5), 5)
  return Math.min(unlimitedWeight + highRiskWeight + mediumRiskWeight + volumeWeight, 100)
}

export async function POST(req: NextRequest) {
  const start = Date.now()

  // Authenticate
  const auth = await authenticateApiKey(req)
  if (auth.error) return auth.error
  const apiKey = auth.apiKey!

  // Burst rate limit
  const burst = await checkBurstRateLimit(apiKey, req)
  if (burst) return burst

  // Validate body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return apiBadRequest('Invalid JSON body', apiKey)
  }

  const parsed = simulateSchema.safeParse(body)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { wallet, chainId, revokeAll, revokeSpenders } = parsed.data

  if (!revokeAll && (!revokeSpenders || revokeSpenders.length === 0)) {
    return apiBadRequest(
      'Provide either revokeAll: true or a non-empty revokeSpenders array',
      apiKey,
    )
  }

  try {
    const chainFilter = chainId ? 'AND chain_id=$2' : ''
    const baseParams: (string | number)[] = [wallet]
    if (chainId) baseParams.push(chainId)

    // Current state
    const { rows: currentRows } = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE is_unlimited)::int AS unlimited,
         COUNT(*) FILTER (WHERE risk_score >= 70)::int AS high_risk,
         COUNT(*) FILTER (WHERE risk_score >= 40 AND risk_score < 70)::int AS medium_risk,
         COALESCE(MAX(risk_score), 0)::int AS max_score
       FROM allowances
       WHERE wallet_address=$1 ${chainFilter}`,
      baseParams,
    )

    const currentRaw = currentRows[0]
    const current = {
      total: Number(currentRaw.total),
      unlimited: Number(currentRaw.unlimited),
      high_risk: Number(currentRaw.high_risk),
      highRisk: Number(currentRaw.high_risk),
      medium_risk: Number(currentRaw.medium_risk),
      mediumRisk: Number(currentRaw.medium_risk),
      max_score: Number(currentRaw.max_score),
    }
    const beforeScore = computeRiskScore(current)

    // Simulated state (after revocation)
    let afterQuery: string
    let afterParams: (string | number | string[])[]

    if (revokeAll) {
      // Everything revoked — score goes to 0
      const afterStats = { total: 0, unlimited: 0, highRisk: 0, mediumRisk: 0 }
      const afterScore = computeRiskScore(afterStats)

      const payload = buildPayload(wallet, chainId, beforeScore, current, afterScore, afterStats, current.total)
      const response = apiSuccess(payload, 200, apiKey)
      withUsageTracking(apiKey, req, response, start)
      return response
    } else {
      // Exclude specific spenders
      const spenderParam = `$${baseParams.length + 1}`
      afterQuery = `
        SELECT
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE is_unlimited)::int AS unlimited,
          COUNT(*) FILTER (WHERE risk_score >= 70)::int AS high_risk,
          COUNT(*) FILTER (WHERE risk_score >= 40 AND risk_score < 70)::int AS medium_risk,
          COALESCE(MAX(risk_score), 0)::int AS max_score
        FROM allowances
        WHERE wallet_address=$1 ${chainFilter}
          AND spender_address != ALL(${spenderParam}::text[])
      `
      afterParams = [...baseParams, revokeSpenders!]
    }

    const { rows: afterRows } = await pool.query(afterQuery, afterParams)
    const afterRaw = afterRows[0]
    const after = {
      total: Number(afterRaw.total),
      unlimited: Number(afterRaw.unlimited),
      high_risk: Number(afterRaw.high_risk),
      highRisk: Number(afterRaw.high_risk),
      medium_risk: Number(afterRaw.medium_risk),
      mediumRisk: Number(afterRaw.medium_risk),
      max_score: Number(afterRaw.max_score),
    }
    const afterScore = computeRiskScore(after)
    const revokedCount = current.total - after.total

    const payload = buildPayload(wallet, chainId, beforeScore, current, afterScore, after, revokedCount)
    const response = apiSuccess(payload, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.simulate.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet,
    })
    return apiServerError('Failed to run simulation', apiKey)
  }
}

function buildPayload(
  wallet: string,
  chainId: number | undefined,
  beforeScore: number,
  beforeStats: Record<string, number>,
  afterScore: number,
  afterStats: Record<string, number>,
  revokedCount: number,
) {
  return {
    wallet,
    chainId: chainId ?? 'all',
    simulation: {
      before: {
        riskScore: beforeScore,
        totalAllowances: beforeStats.total,
        unlimitedAllowances: beforeStats.unlimited,
        highRisk: beforeStats.high_risk,
        mediumRisk: beforeStats.medium_risk,
      },
      after: {
        riskScore: afterScore,
        totalAllowances: afterStats.total,
        unlimitedAllowances: afterStats.unlimited,
        highRisk: afterStats.high_risk ?? afterStats.highRisk ?? 0,
        mediumRisk: afterStats.medium_risk ?? afterStats.mediumRisk ?? 0,
      },
      improvement: {
        scoreReduction: beforeScore - afterScore,
        allowancesRevoked: revokedCount,
        percentImprovement:
          beforeScore > 0
            ? Math.round(((beforeScore - afterScore) / beforeScore) * 100)
            : 0,
      },
    },
  }
}
