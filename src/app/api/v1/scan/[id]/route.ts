/**
 * GET /api/v1/scan/:id — Check scan job status
 *
 * Requires API key authentication.
 * Returns the current status of a previously submitted scan.
 */
import { type NextRequest } from 'next/server'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest, apiNotFound, apiServerError } from '@/lib/api-response'
import { getJob } from '@/lib/jobs'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const start = Date.now()

  // Authenticate
  const auth = await authenticateApiKey(req)
  if (auth.error) return auth.error
  const apiKey = auth.apiKey!

  // Burst rate limit
  const burst = await checkBurstRateLimit(apiKey, req)
  if (burst) return burst

  const { id } = await params
  const scanId = Number(id)
  if (!Number.isFinite(scanId)) {
    return apiBadRequest('Invalid scan ID', apiKey)
  }

  try {
    const job = await getJob(scanId)
    if (!job) {
      return apiNotFound('Scan not found', apiKey)
    }

    // Enforce ownership: scans can only be read by the user/key that created
    // them. Return 404 (not 403) to avoid leaking whether a given scanId exists.
    // Legacy jobs without ownership metadata (created before enforcement) are
    // accessible only to the scan's own API key or same-user keys.
    const payload = (job.payload ?? {}) as { userId?: number; apiKeyId?: string }
    const ownerUserId = payload.userId
    const ownerKeyId = payload.apiKeyId

    if (ownerUserId !== undefined && ownerUserId !== apiKey.userId) {
      apiLogger.warn('v1.scan.status.forbidden', {
        scanId,
        requestingUserId: apiKey.userId,
        jobOwnerUserId: ownerUserId,
      })
      return apiNotFound('Scan not found', apiKey)
    }
    if (ownerKeyId !== undefined && ownerKeyId !== apiKey.id && ownerUserId === undefined) {
      // Per-key enforcement only when there's no user-level ownership recorded
      return apiNotFound('Scan not found', apiKey)
    }

    const response = apiSuccess(
      {
        scanId: job.id,
        status: job.status,
        wallet: (job.payload as { wallet?: string })?.wallet ?? null,
        chains: (job.payload as { chains?: number[] })?.chains ?? [],
        attempts: job.attempts,
        error: job.status === 'failed' ? job.error : null,
        createdAt: job.created_at,
        startedAt: job.started_at,
        completedAt: job.finished_at,
      },
      200,
      apiKey,
    )
    withUsageTracking(apiKey, req, response, start)
    return response
  } catch (error) {
    apiLogger.error('v1.scan.status.error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      scanId,
    })
    return apiServerError('Failed to fetch scan status', auth.apiKey)
  }
}
