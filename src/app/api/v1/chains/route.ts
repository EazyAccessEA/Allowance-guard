/**
 * GET /api/v1/chains — List supported blockchain networks
 *
 * Requires API key authentication.
 */
import { type NextRequest } from 'next/server'
import { authenticateApiKey } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { withUsageTracking } from '@/middleware/api-auth'
import { apiSuccess } from '@/lib/api-response'
import { CHAINS } from '@/lib/networks'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const start = Date.now()

  // Authenticate
  const auth = await authenticateApiKey(req)
  if (auth.error) return auth.error
  const apiKey = auth.apiKey!

  // Burst rate limit
  const burst = await checkBurstRateLimit(apiKey, req)
  if (burst) return burst

  const chains = Object.values(CHAINS)
    .filter((c) => c.enabled)
    .map((c) => ({
      chainId: c.id,
      name: c.name,
      symbol: c.symbol,
      explorer: c.explorer,
    }))

  const response = apiSuccess({ chains, count: chains.length }, 200, apiKey)
  withUsageTracking(apiKey, req, response, start)
  return response
}
