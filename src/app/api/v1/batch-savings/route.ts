/**
 * GET /api/v1/batch-savings — Estimate gas savings for batched revocation
 *
 * Requires API key authentication.
 * Query params:
 *   - chainId (required): EVM chain id
 *   - count (required): number of approvals to revoke in the batch
 *   - gasPriceGwei (optional): override the default gas price for this chain
 *
 * Returns sequential vs EIP-5792-batched gas quotes. Savings are labelled
 * `approximate` — the figure is only realised on wallets that support
 * `wallet_sendCalls` (Coinbase Smart Wallet, Base Smart Wallet, etc.).
 * See `src/lib/batch-savings.ts` for the gas model + assumptions.
 */
import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { authenticateApiKey, withUsageTracking } from '@/middleware/api-auth'
import { checkBurstRateLimit } from '@/middleware/api-rate-limit'
import { apiSuccess, apiBadRequest } from '@/lib/api-response'
import { computeBatchSavings } from '@/lib/batch-savings'

export const runtime = 'nodejs'

const querySchema = z.object({
  chainId: z.coerce.number().int().positive(),
  count: z.coerce.number().int().positive().max(200),
  gasPriceGwei: z.coerce.number().positive().optional(),
})

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

  const { chainId, count, gasPriceGwei } = parsed.data

  const result = computeBatchSavings({
    chainId,
    approvalCount: count,
    gasPriceGwei,
  })

  // Stringify bigint fee fields — JSON can't serialise BigInt natively.
  const payload = {
    chainId: result.chainId,
    approvalCount: result.approvalCount,
    gasPriceGwei: result.gasPriceGwei,
    sequential: {
      gasUnits: result.sequential.gasUnits,
      feeWei: result.sequential.feeWei.toString(),
      feeEther: result.sequential.feeEther,
    },
    batched: result.batched
      ? {
          gasUnits: result.batched.gasUnits,
          feeWei: result.batched.feeWei.toString(),
          feeEther: result.batched.feeEther,
        }
      : null,
    savings: result.savings
      ? {
          gasUnits: result.savings.gasUnits,
          feeWei: result.savings.feeWei.toString(),
          feeEther: result.savings.feeEther,
          fraction: result.savings.fraction,
        }
      : null,
    confidence: result.confidence,
    assumptions: result.assumptions,
  }

  const response = apiSuccess(payload, 200, apiKey)
  withUsageTracking(apiKey, req, response, start)
  return response
}
