/**
 * GET /api/v1/portfolio-risk — Cross-chain aggregated portfolio risk score
 *
 * Requires API key authentication.
 * Query params: wallet (required)
 *
 * Returns a single portfolio-wide risk score that aggregates risk across
 * all chains, weighted by value, including Permit2, chain-specific risks,
 * historical trend, and peer benchmarking.
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
import { SUPPORTED_CHAINS } from '@/config/chains'

export const runtime = 'nodejs'

const querySchema = z.object({
  wallet: walletAddressSchema,
})

interface ChainRisk {
  chainId: number
  chainName: string
  totalAllowances: number
  unlimitedAllowances: number
  highRiskCount: number
  estimatedValueUsd: number
  riskScore: number
  permit2Allowances: number
}

export async function GET(req: NextRequest) {
  const start = Date.now()

  const auth = await authenticateApiKey(req)
  if (auth.error) return auth.error
  const apiKey = auth.apiKey!

  const burst = await checkBurstRateLimit(apiKey, req)
  if (burst) return burst

  const rawParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = querySchema.safeParse(rawParams)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { wallet } = parsed.data

  const cacheKey = `v1:portfolio-risk:${wallet}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    const response = apiSuccess(cached, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  }

  try {
    // Per-chain breakdown
    const { rows: chainRows } = await pool.query(
      `SELECT
         a.chain_id,
         COUNT(*)::int AS total_allowances,
         COUNT(*) FILTER (WHERE a.is_unlimited)::int AS unlimited_allowances,
         COUNT(*) FILTER (WHERE a.risk_score >= 70)::int AS high_risk_count,
         COUNT(*) FILTER (WHERE a.risk_score >= 40 AND a.risk_score < 70)::int AS medium_risk_count,
         COALESCE(MAX(a.risk_score), 0)::int AS max_risk_score,
         COALESCE(AVG(a.risk_score) FILTER (WHERE a.risk_score > 0), 0)::int AS avg_risk_score,
         COUNT(*) FILTER (WHERE a.risk_flags::text LIKE '%permit2%')::int AS permit2_count,
         COALESCE(SUM(
           CASE WHEN tm.price_usd IS NOT NULL AND NOT a.is_unlimited
           THEN tm.price_usd * (a.amount::numeric / POW(10, COALESCE(tm.decimals, 18)))
           ELSE 0 END
         ), 0)::numeric AS estimated_value_usd
       FROM allowances a
       LEFT JOIN token_metadata tm ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
       WHERE a.wallet_address = $1
       GROUP BY a.chain_id
       ORDER BY estimated_value_usd DESC`,
      [wallet],
    )

    const chainNameMap: Record<number, string> = {}
    for (const c of SUPPORTED_CHAINS) {
      chainNameMap[c.id] = c.name
    }

    const chainBreakdown: ChainRisk[] = chainRows.map((row) => {
      const unlimited = Number(row.unlimited_allowances)
      const highRisk = Number(row.high_risk_count)
      const mediumRisk = Number(row.medium_risk_count)
      const total = Number(row.total_allowances)
      const permit2 = Number(row.permit2_count)

      // Per-chain score (0-100)
      let chainScore = 0
      chainScore += Math.min(unlimited * 15, 45)
      chainScore += Math.min(highRisk * 12, 30)
      chainScore += Math.min(mediumRisk * 3, 10)
      chainScore += Math.min(Math.floor(total / 5), 5)
      chainScore += Math.min(permit2 * 5, 10)
      chainScore = Math.min(chainScore, 100)

      return {
        chainId: Number(row.chain_id),
        chainName: chainNameMap[Number(row.chain_id)] || `Chain ${row.chain_id}`,
        totalAllowances: total,
        unlimitedAllowances: unlimited,
        highRiskCount: highRisk,
        estimatedValueUsd: Math.round(Number(row.estimated_value_usd) * 100) / 100,
        riskScore: chainScore,
        permit2Allowances: permit2,
      }
    })

    // Aggregate portfolio score — weighted by estimated value
    const totalValue = chainBreakdown.reduce((s, c) => s + c.estimatedValueUsd, 0)
    let portfolioScore: number

    if (totalValue > 0) {
      // Value-weighted average risk
      portfolioScore = Math.round(
        chainBreakdown.reduce((s, c) => {
          const weight = c.estimatedValueUsd / totalValue
          return s + c.riskScore * weight
        }, 0),
      )
    } else {
      // Equal-weight fallback
      portfolioScore =
        chainBreakdown.length > 0
          ? Math.round(chainBreakdown.reduce((s, c) => s + c.riskScore, 0) / chainBreakdown.length)
          : 0
    }

    // Bridge/cross-chain penalty: approvals on 4+ chains is riskier
    const chainsUsed = chainBreakdown.length
    if (chainsUsed >= 4) portfolioScore = Math.min(portfolioScore + 5, 100)

    // Historical trend (last 30 days vs current)
    const { rows: historyRows } = await pool.query(
      `SELECT
         COALESCE(AVG(risk_score) FILTER (WHERE risk_score > 0), 0)::int AS avg_risk_30d
       FROM allowances
       WHERE wallet_address = $1
         AND updated_at >= NOW() - INTERVAL '30 days'`,
      [wallet],
    )
    const prev30dAvg = Number(historyRows[0]?.avg_risk_30d ?? 0)
    const trendDirection = portfolioScore > prev30dAvg ? 'worsening' : portfolioScore < prev30dAvg ? 'improving' : 'stable'
    const trendDelta = portfolioScore - prev30dAvg

    // Percentile benchmark: compare against other scanned wallets
    const { rows: benchRows } = await pool.query(
      `SELECT
         COUNT(DISTINCT wallet_address)::int AS total_wallets,
         COUNT(DISTINCT wallet_address) FILTER (
           WHERE wallet_address IN (
             SELECT wallet_address FROM allowances
             GROUP BY wallet_address
             HAVING COALESCE(AVG(risk_score) FILTER (WHERE risk_score > 0), 0) >= $2
           )
         )::int AS wallets_riskier_or_equal
       FROM allowances`,
      [wallet, portfolioScore],
    )
    const totalWallets = Number(benchRows[0]?.total_wallets ?? 1)
    const walletsRiskierOrEqual = Number(benchRows[0]?.wallets_riskier_or_equal ?? 0)
    const saferThanPct = totalWallets > 0 ? Math.round((walletsRiskierOrEqual / totalWallets) * 100) : 50

    const totalAllowances = chainBreakdown.reduce((s, c) => s + c.totalAllowances, 0)
    const totalUnlimited = chainBreakdown.reduce((s, c) => s + c.unlimitedAllowances, 0)
    const totalHighRisk = chainBreakdown.reduce((s, c) => s + c.highRiskCount, 0)
    const totalPermit2 = chainBreakdown.reduce((s, c) => s + c.permit2Allowances, 0)

    const riskLevel =
      portfolioScore >= 70 ? 'critical'
        : portfolioScore >= 40 ? 'high'
          : portfolioScore >= 15 ? 'medium'
            : portfolioScore > 0 ? 'low' : 'safe'

    const payload = {
      wallet,
      portfolioRiskScore: portfolioScore,
      riskLevel,
      summary: {
        chainsWithAllowances: chainsUsed,
        totalAllowances,
        unlimitedAllowances: totalUnlimited,
        highRiskAllowances: totalHighRisk,
        permit2Allowances: totalPermit2,
        estimatedTotalValueUsd: Math.round(totalValue * 100) / 100,
      },
      trend: {
        direction: trendDirection,
        deltaScore: trendDelta,
        period: '30d',
        message:
          trendDirection === 'improving'
            ? `Your risk score improved by ${Math.abs(trendDelta)} points this month`
            : trendDirection === 'worsening'
              ? `Your risk score increased by ${trendDelta} points this month`
              : 'Your risk score is stable',
      },
      benchmark: {
        saferThanPercent: saferThanPct,
        message: `Safer than ${saferThanPct}% of wallets with similar activity`,
        totalWalletsCompared: totalWallets,
      },
      chainBreakdown,
    }

    await cacheSet(cacheKey, payload, 60)

    const response = apiSuccess(payload, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.portfolio_risk.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet,
    })
    return apiServerError('Failed to compute portfolio risk', apiKey)
  }
}
