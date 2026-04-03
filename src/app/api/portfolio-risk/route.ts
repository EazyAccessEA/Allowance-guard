/**
 * GET /api/portfolio-risk — Consumer cross-chain portfolio risk score
 *
 * Session-based (no API key). Used by the frontend dashboard.
 * Query: wallet (required)
 */
import { NextResponse, type NextRequest } from 'next/server'
import { pool } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/cache'
import { SUPPORTED_CHAINS } from '@/config/chains'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet')?.toLowerCase()
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const cacheKey = `portfolio-risk:${wallet}`
  const cached = await cacheGet(cacheKey)
  if (cached) return NextResponse.json(cached)

  try {
    const chainNameMap: Record<number, string> = {}
    for (const c of SUPPORTED_CHAINS) chainNameMap[c.id] = c.name

    const { rows } = await pool.query(
      `SELECT
         a.chain_id,
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE a.is_unlimited)::int AS unlimited,
         COUNT(*) FILTER (WHERE a.risk_score >= 70)::int AS high_risk,
         COUNT(*) FILTER (WHERE a.risk_score >= 40 AND a.risk_score < 70)::int AS med_risk,
         COUNT(*) FILTER (WHERE a.risk_flags::text LIKE '%permit2%')::int AS permit2,
         COALESCE(SUM(
           CASE WHEN tm.price_usd IS NOT NULL AND NOT a.is_unlimited
           THEN tm.price_usd * (a.amount::numeric / POW(10, COALESCE(tm.decimals, 18)))
           ELSE 0 END
         ), 0)::numeric AS value_usd
       FROM allowances a
       LEFT JOIN token_metadata tm ON tm.chain_id = a.chain_id AND tm.token_address = a.token_address
       WHERE a.wallet_address = $1
       GROUP BY a.chain_id`,
      [wallet],
    )

    const chains = rows.map((r) => {
      let score = 0
      score += Math.min(Number(r.unlimited) * 15, 45)
      score += Math.min(Number(r.high_risk) * 12, 30)
      score += Math.min(Number(r.med_risk) * 3, 10)
      score += Math.min(Math.floor(Number(r.total) / 5), 5)
      score += Math.min(Number(r.permit2) * 5, 10)
      score = Math.min(score, 100)

      return {
        chainId: Number(r.chain_id),
        chainName: chainNameMap[Number(r.chain_id)] || `Chain ${r.chain_id}`,
        totalAllowances: Number(r.total),
        unlimitedAllowances: Number(r.unlimited),
        highRiskCount: Number(r.high_risk),
        permit2Allowances: Number(r.permit2),
        estimatedValueUsd: Math.round(Number(r.value_usd) * 100) / 100,
        riskScore: score,
      }
    })

    const totalValue = chains.reduce((s, c) => s + c.estimatedValueUsd, 0)
    let portfolioScore: number
    if (totalValue > 0) {
      portfolioScore = Math.round(
        chains.reduce((s, c) => s + c.riskScore * (c.estimatedValueUsd / totalValue), 0),
      )
    } else {
      portfolioScore = chains.length > 0
        ? Math.round(chains.reduce((s, c) => s + c.riskScore, 0) / chains.length)
        : 0
    }
    if (chains.length >= 4) portfolioScore = Math.min(portfolioScore + 5, 100)

    // Trend
    const { rows: hist } = await pool.query(
      `SELECT COALESCE(AVG(risk_score) FILTER (WHERE risk_score > 0), 0)::int AS avg
       FROM allowances WHERE wallet_address = $1 AND updated_at >= NOW() - INTERVAL '30 days'`,
      [wallet],
    )
    const prev = Number(hist[0]?.avg ?? 0)
    const delta = portfolioScore - prev

    // Benchmark
    const { rows: bench } = await pool.query(
      `SELECT COUNT(DISTINCT wallet_address)::int AS total,
              COUNT(DISTINCT wallet_address) FILTER (WHERE wallet_address IN (
                SELECT wallet_address FROM allowances GROUP BY wallet_address
                HAVING COALESCE(AVG(risk_score) FILTER (WHERE risk_score > 0), 0) >= $2
              ))::int AS riskier
       FROM allowances`,
      [wallet, portfolioScore],
    )
    const totalW = Number(bench[0]?.total ?? 1)
    const saferPct = totalW > 0 ? Math.round((Number(bench[0]?.riskier ?? 0) / totalW) * 100) : 50

    const payload = {
      portfolioRiskScore: portfolioScore,
      riskLevel: portfolioScore >= 70 ? 'critical' : portfolioScore >= 40 ? 'high' : portfolioScore >= 15 ? 'medium' : portfolioScore > 0 ? 'low' : 'safe',
      totalAllowances: chains.reduce((s, c) => s + c.totalAllowances, 0),
      unlimitedAllowances: chains.reduce((s, c) => s + c.unlimitedAllowances, 0),
      highRiskAllowances: chains.reduce((s, c) => s + c.highRiskCount, 0),
      permit2Allowances: chains.reduce((s, c) => s + c.permit2Allowances, 0),
      chainsUsed: chains.length,
      estimatedTotalValueUsd: Math.round(totalValue * 100) / 100,
      trend: { direction: delta > 0 ? 'worsening' : delta < 0 ? 'improving' : 'stable', delta },
      benchmark: { saferThanPercent: saferPct, totalWallets: totalW },
      chains,
    }

    await cacheSet(cacheKey, payload, 30)
    return NextResponse.json(payload)
  } catch (error) {
    console.error('portfolio-risk error:', error)
    return NextResponse.json({ error: 'Failed to compute portfolio risk' }, { status: 500 })
  }
}
