/**
 * GET /api/v1/risk-score — Get aggregated risk score for a wallet
 *
 * Requires API key authentication.
 * Query params: wallet (required), chainId? (optional)
 *
 * Returns an overall risk score (0-100), risk breakdown by category,
 * and summary of high-risk allowances.
 */
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest, apiServerError } from '@/lib/api-response'
import { pool } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/cache'
import { walletAddressSchema } from '@/lib/validation'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const querySchema = z.object({
  wallet: walletAddressSchema,
  chainId: z.coerce.number().int().positive().optional(),
})

export async function GET(req: NextRequest) {
  const start = Date.now()

  // Authenticate
  const auth = await authenticateApiKey(req)
  if (auth.error) return auth.error
  const apiKey = auth.apiKey!

  // Burst rate limit
  const burst = await checkBurstRateLimit(apiKey, req)
  if (burst) return burst

  // Parse query
  const rawParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = querySchema.safeParse(rawParams)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { wallet, chainId } = parsed.data

  // Check cache
  const cacheKey = `v1:risk:${wallet}:${chainId ?? 'all'}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    const response = apiSuccess(cached, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  }

  try {
    const chainFilter = chainId ? 'AND chain_id=$2' : ''
    const params: (string | number)[] = [wallet]
    if (chainId) params.push(chainId)

    // Aggregated risk metrics
    const { rows } = await pool.query(
      `SELECT
         COUNT(*)::int AS total_allowances,
         COUNT(*) FILTER (WHERE is_unlimited)::int AS unlimited_allowances,
         COUNT(*) FILTER (WHERE risk_score > 0)::int AS risky_allowances,
         COUNT(*) FILTER (WHERE risk_score >= 70)::int AS high_risk_count,
         COUNT(*) FILTER (WHERE risk_score >= 40 AND risk_score < 70)::int AS medium_risk_count,
         COUNT(*) FILTER (WHERE risk_score > 0 AND risk_score < 40)::int AS low_risk_count,
         COALESCE(MAX(risk_score), 0)::int AS max_risk_score,
         COALESCE(AVG(risk_score) FILTER (WHERE risk_score > 0), 0)::int AS avg_risk_score,
         COUNT(DISTINCT chain_id)::int AS chains_with_allowances
       FROM allowances
       WHERE wallet_address=$1 ${chainFilter}`,
      params,
    )

    const raw = rows[0] ?? {}
    const stats = {
      total_allowances: Number(raw.total_allowances ?? 0),
      unlimited_allowances: Number(raw.unlimited_allowances ?? 0),
      high_risk_count: Number(raw.high_risk_count ?? 0),
      medium_risk_count: Number(raw.medium_risk_count ?? 0),
      low_risk_count: Number(raw.low_risk_count ?? 0),
      max_risk_score: Number(raw.max_risk_score ?? 0),
      avg_risk_score: Number(raw.avg_risk_score ?? 0),
      chains_with_allowances: Number(raw.chains_with_allowances ?? 0),
    }

    // Compute overall wallet risk score (0-100)
    let overallScore = 0
    if (stats.total_allowances > 0) {
      // Weight: unlimited allowances are highest risk
      const unlimitedWeight = Math.min(stats.unlimited_allowances * 15, 50)
      const highRiskWeight = Math.min(stats.high_risk_count * 10, 30)
      const mediumRiskWeight = Math.min(stats.medium_risk_count * 3, 15)
      const volumeWeight = Math.min(Math.floor(stats.total_allowances / 5), 5)
      overallScore = Math.min(unlimitedWeight + highRiskWeight + mediumRiskWeight + volumeWeight, 100)
    }

    // Top risky allowances
    const { rows: topRisks } = await pool.query(
      `SELECT chain_id, token_address, spender_address, risk_score, risk_flags, is_unlimited,
              tm.symbol AS token_symbol, sl.label AS spender_label
       FROM allowances a
       LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
       LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
       WHERE wallet_address=$1 AND risk_score > 0 ${chainFilter}
       ORDER BY risk_score DESC
       LIMIT 10`,
      params,
    )

    const riskLevel =
      overallScore >= 70 ? 'critical' :
      overallScore >= 40 ? 'high' :
      overallScore >= 15 ? 'medium' :
      overallScore > 0 ? 'low' : 'safe'

    const payload = {
      wallet,
      chainId: chainId ?? 'all',
      riskScore: overallScore,
      riskLevel,
      breakdown: {
        totalAllowances: stats.total_allowances,
        unlimitedAllowances: stats.unlimited_allowances,
        highRisk: stats.high_risk_count,
        mediumRisk: stats.medium_risk_count,
        lowRisk: stats.low_risk_count,
        maxIndividualScore: stats.max_risk_score,
        avgRiskScore: stats.avg_risk_score,
        chainsWithAllowances: stats.chains_with_allowances,
      },
      topRisks,
    }

    await cacheSet(cacheKey, payload, 30)

    const response = apiSuccess(payload, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.risk_score.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet,
    })
    return apiServerError('Failed to compute risk score', apiKey)
  }
}
