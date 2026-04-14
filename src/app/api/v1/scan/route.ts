/**
 * POST /api/v1/scan — Trigger a wallet scan
 *
 * Requires API key authentication.
 * Body: { wallet: "0x...", chains?: [1, 42161, ...] }
 *
 * Returns a scan job ID that can be polled via GET /api/v1/scan/:id
 */
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest, apiServerError } from '@/lib/api-response'
import { enqueueScan } from '@/lib/jobs'
import { enabledChainIds } from '@/lib/networks'
import { walletAddressSchema, chainIdSchema } from '@/lib/validation'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const scanBodySchema = z.object({
  wallet: walletAddressSchema,
  chains: z.array(chainIdSchema).optional(),
})

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

  const parsed = scanBodySchema.safeParse(body)
  if (!parsed.success) {
    return apiBadRequest('Validation failed', apiKey, parsed.error.flatten().fieldErrors)
  }

  const { wallet, chains } = parsed.data
  const chainIds = chains?.length ? chains : enabledChainIds()

  try {
    let jobId: number
    try {
      jobId = await enqueueScan(wallet, chainIds, {
        userId: apiKey.userId,
        apiKeyId: apiKey.id,
      })
    } catch (e: unknown) {
      if (e instanceof Error && String(e.message).includes('uniq_jobs_active_wallet')) {
        const response = apiSuccess(
          { message: 'Scan already in progress for this wallet', wallet },
          200,
          apiKey,
        )
        withUsageTracking(apiKey, req, response, start)
        return response
      }
      throw e
    }

    apiLogger.info('v1.scan.queued', { wallet, chains: chainIds, jobId, keyId: apiKey.id })

    const response = apiSuccess(
      {
        scanId: jobId,
        wallet,
        chains: chainIds,
        status: 'pending',
        statusUrl: `/api/v1/scan/${jobId}`,
      },
      201,
      apiKey,
    )
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.scan.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      keyId: apiKey.id,
    })
    return apiServerError('Failed to queue scan', apiKey)
  }
}
