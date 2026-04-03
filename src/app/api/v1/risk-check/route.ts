/**
 * POST /api/v1/risk-check — Pre-signing approval risk assessment
 *
 * Requires API key authentication.
 * Body: { token: "0x...", spender: "0x...", chainId: number, amount?: string }
 *
 * Evaluates the risk of approving a specific spender for a specific token
 * BEFORE the user signs the transaction. Useful for wallet providers
 * and dApp frontends.
 */
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest, apiServerError } from '@/lib/api-response'
import { pool } from '@/lib/db'
import { cacheGet, cacheSet } from '@/lib/cache'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const riskCheckSchema = z.object({
  token: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v: string) => v.toLowerCase()),
  spender: z.string().regex(/^0x[a-fA-F0-9]{40}$/).transform((v: string) => v.toLowerCase()),
  chainId: z.number().int().positive(),
  amount: z.string().optional(), // raw amount or "unlimited"
})

interface RiskFlag {
  code: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
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

  const parsed = riskCheckSchema.safeParse(body)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { token, spender, chainId, amount } = parsed.data

  // Check cache
  const cacheKey = `v1:riskcheck:${chainId}:${token}:${spender}:${amount ?? 'default'}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    const response = apiSuccess(cached, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  }

  try {
    const flags: RiskFlag[] = []
    let riskScore = 0

    // 1. Check if spender is known/trusted
    const { rows: spenderRows } = await pool.query(
      `SELECT label, trust FROM spender_labels WHERE chain_id=$1 AND address=$2`,
      [chainId, spender],
    )

    const spenderInfo = spenderRows[0]
    const isKnown = !!spenderInfo
    const isTrusted = spenderInfo?.trust === 'trusted'

    if (!isKnown) {
      flags.push({
        code: 'UNKNOWN_SPENDER',
        severity: 'high',
        message: 'Spender address is not in our verified database',
      })
      riskScore += 30
    } else if (!isTrusted) {
      flags.push({
        code: 'UNTRUSTED_SPENDER',
        severity: 'medium',
        message: `Spender "${spenderInfo.label}" is known but not fully trusted`,
      })
      riskScore += 15
    }

    // 2. Check if this is an unlimited approval
    const isUnlimited = amount === 'unlimited' || amount === '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    if (isUnlimited) {
      flags.push({
        code: 'UNLIMITED_APPROVAL',
        severity: 'high',
        message: 'Unlimited approval grants permanent access to all tokens of this type',
      })
      riskScore += 25
    }

    // 3. Check how many wallets have risky allowances with this spender
    const { rows: spenderStats } = await pool.query(
      `SELECT
         COUNT(DISTINCT wallet_address)::int AS affected_wallets,
         COUNT(*) FILTER (WHERE risk_score >= 70)::int AS high_risk_count
       FROM allowances
       WHERE chain_id=$1 AND spender_address=$2`,
      [chainId, spender],
    )

    const stats = spenderStats[0]
    if (Number(stats?.high_risk_count) > 0) {
      flags.push({
        code: 'SPENDER_HAS_RISKY_HISTORY',
        severity: 'critical',
        message: `This spender has ${Number(stats.high_risk_count)} high-risk allowance(s) across wallets`,
      })
      riskScore += 20
    }

    // 4. Check token info
    const { rows: tokenRows } = await pool.query(
      `SELECT name, symbol, decimals FROM token_metadata WHERE chain_id=$1 AND token_address=$2`,
      [chainId, token],
    )
    const tokenInfo = tokenRows[0]
    if (!tokenInfo) {
      flags.push({
        code: 'UNKNOWN_TOKEN',
        severity: 'medium',
        message: 'Token is not in our metadata database',
      })
      riskScore += 10
    }

    riskScore = Math.min(riskScore, 100)

    const riskLevel =
      riskScore >= 70 ? 'critical' :
      riskScore >= 40 ? 'high' :
      riskScore >= 15 ? 'medium' :
      riskScore > 0 ? 'low' : 'safe'

    const payload = {
      chainId,
      token: {
        address: token,
        name: tokenInfo?.name ?? null,
        symbol: tokenInfo?.symbol ?? null,
        decimals: tokenInfo?.decimals ?? null,
      },
      spender: {
        address: spender,
        label: spenderInfo?.label ?? null,
        trusted: isTrusted,
        affectedWallets: stats?.affected_wallets ?? 0,
      },
      approval: {
        amount: amount ?? null,
        isUnlimited,
      },
      risk: {
        score: riskScore,
        level: riskLevel,
        flags,
      },
      recommendation:
        riskScore >= 70
          ? 'REJECT — High risk of fund loss. Do not approve.'
          : riskScore >= 40
            ? 'CAUTION — Review carefully before approving. Consider a limited amount.'
            : riskScore >= 15
              ? 'MODERATE — Spender appears mostly safe. Prefer limited approvals.'
              : 'OK — Low risk approval.',
    }

    await cacheSet(cacheKey, payload, 60)

    const response = apiSuccess(payload, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.risk_check.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      token,
      spender,
    })
    return apiServerError('Failed to perform risk check', apiKey)
  }
}
