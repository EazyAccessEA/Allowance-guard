// app/api/scan/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { enqueueScan } from '@/lib/jobs'
import { withReq } from '@/lib/logger'
import { enabledChainIds } from '@/lib/networks'
import { scanRateLimit } from '@/lib/rate-limit'
import { incrScan } from '@/lib/metrics'
import { validateRequest } from '@/middleware/validation'
import { scanRequestSchema } from '@/lib/validation'
import { trackEvent } from '@/lib/analytics'

export const runtime = 'nodejs'

const MAP: Record<string, number> = {
  eth: 1,
  arb: 42161,
  base: 8453,
  op: 10,
  polygon: 137,
  avalanche: 43114,
  bsc: 56,
  fantom: 250,
  zksync: 324,
  'polygon-zkevm': 1101,
  mantle: 5000,
  gnosis: 100,
  linea: 59144,
  scroll: 534352,
  celo: 42220,
  blast: 81457,
  cronos: 25,
  moonbeam: 1284,
  aurora: 1313161554,
  opbnb: 204,
  manta: 169,
  mode: 34443,
  taiko: 167000,
  metis: 1088,
  kava: 2222,
  zetachain: 7000,
  worldchain: 480,
}

/**
 * POST /api/scan — queue a wallet scan.
 *
 * Returns immediately with {ok, jobId}. The actual scan is processed
 * by the Vercel Cron (/api/jobs/process, every 1 minute). The client
 * polls /api/jobs/{id} until status = 'succeeded', then fetches
 * /api/allowances for results.
 *
 * This is the only architecture that works reliably on Vercel:
 * - Inline processing → 504 gateway timeout
 * - after() → doesn't fire on this platform
 * - HTTP trigger to /api/jobs/process → blocked by challenge
 * - Vercel Cron → works (internal, bypasses challenge)
 */
export async function POST(req: Request) {
  try {
    const L = withReq(req)

    // Rate limiting
    const rateLimitResponse = scanRateLimit(req as NextRequest)
    if (rateLimitResponse instanceof NextResponse) {
      return rateLimitResponse
    }

    L.info('scan.queue.start', { path: '/api/scan' })

    // Validate
    const validation = await validateRequest(scanRequestSchema)(req as NextRequest)
    if (!validation.success) {
      L.warn('Invalid scan request body', { errors: validation.details })
      return NextResponse.json(
        { error: validation.error, details: validation.details },
        { status: 400 }
      )
    }

    const { walletAddress, chains } = validation.data!
    const addr = walletAddress
    const chainIds = chains?.length
      ? chains.map(c => MAP[c])
      : enabledChainIds()

    // Metrics + analytics (fire-and-forget)
    await incrScan()
    trackEvent('scan_started', {
      metadata: { walletAddress: addr, chains: chainIds },
    })

    // Queue the job
    let jobId: number
    try {
      jobId = await enqueueScan(addr, chainIds)
    } catch (e: unknown) {
      if (e instanceof Error && String(e.message || '').includes('uniq_jobs_active_wallet')) {
        L.info('scan.queue.duplicate', { wallet: addr })
        return NextResponse.json({ ok: true, message: 'Scan already in progress' })
      }
      throw e
    }

    L.info('scan.queue.ok', { wallet: addr, jobId })

    // Return immediately. Vercel Cron processes the job within ~1 minute.
    return NextResponse.json({ ok: true, jobId, message: `Scan queued for ${addr}` })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[scan] unhandled:', msg)
    return NextResponse.json(
      { error: 'Failed to queue scan', detail: msg },
      { status: 500 }
    )
  }
}
