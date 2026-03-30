/**
 * GET /api/v1/allowances — Get token allowances for a wallet
 *
 * Requires API key authentication.
 * Query params: wallet (required), chainId?, riskOnly?, page?, pageSize?
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
  riskOnly: z.enum(['true', 'false']).transform((v: string) => v === 'true').optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
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

  // Parse query params
  const rawParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed = querySchema.safeParse(rawParams)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { wallet, chainId, riskOnly, page, pageSize } = parsed.data
  const offset = (page - 1) * pageSize

  // Check cache
  const cacheKey = `v1:allow:${wallet}:${chainId ?? 'all'}:${riskOnly ?? false}:${page}:${pageSize}`
  const cached = await cacheGet(cacheKey)
  if (cached) {
    const response = apiSuccess(cached, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  }

  try {
    const conditions: string[] = ['a.wallet_address=$1']
    const params: (string | number | boolean)[] = [wallet]
    let paramIdx = 2

    if (chainId) {
      conditions.push(`a.chain_id=$${paramIdx}`)
      params.push(chainId)
      paramIdx++
    }
    if (riskOnly) {
      conditions.push('(a.is_unlimited=true OR a.risk_score>0)')
    }

    const where = conditions.join(' AND ')

    const query = `
      SELECT a.chain_id, a.token_address, a.spender_address, a.standard, a.allowance_type,
             a.amount, a.is_unlimited, a.last_seen_block, a.risk_score, a.risk_flags,
             tm.name AS token_name, tm.symbol AS token_symbol, tm.decimals AS token_decimals,
             sl.label AS spender_label, sl.trust AS spender_trust
      FROM allowances a
      LEFT JOIN token_metadata tm ON tm.chain_id=a.chain_id AND tm.token_address=a.token_address
      LEFT JOIN spender_labels sl ON sl.chain_id=a.chain_id AND sl.address=a.spender_address
      WHERE ${where}
      ORDER BY a.is_unlimited DESC, a.risk_score DESC, a.amount DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `
    params.push(pageSize, offset)

    const countQuery = `SELECT COUNT(*)::int AS total FROM allowances a WHERE ${where}`

    const [{ rows }, countRes] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, paramIdx - 1)),
    ])

    const total = (countRes.rows[0]?.total as number) ?? 0

    const payload = {
      allowances: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    }

    await cacheSet(cacheKey, payload, 15)

    const response = apiSuccess(payload, 200, apiKey)
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.allowances.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      wallet,
    })
    return apiServerError('Failed to fetch allowances', apiKey)
  }
}
