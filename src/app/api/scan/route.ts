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
  // Phase 9.6 — Tier 1
  blast: 81457,
  cronos: 25,
  moonbeam: 1284,
  aurora: 1313161554,
  opbnb: 204,
  manta: 169,
  // Phase 9.6 — Tier 2
  mode: 34443,
  taiko: 167000,
  metis: 1088,
  kava: 2222,
  zetachain: 7000,
  worldchain: 480,
}

export async function POST(req: Request) {
  // Outer try-catch wraps EVERYTHING including rate limiting and logging
  // so we never return a bare 500 with no body.
  try {
    const L = withReq(req)

    // Apply rate limiting
    const rateLimitResponse = scanRateLimit(req as NextRequest)
    if (rateLimitResponse instanceof NextResponse) {
      return rateLimitResponse
    }

    L.info('scan.queue.start', { path: '/api/scan' })

    // Validate request with enhanced validation
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

    // Increment scan counter (Redis — swallows errors internally)
    await incrScan()

    // Track scan_started analytics event (swallows errors internally)
    trackEvent('scan_started', {
      metadata: { walletAddress: addr, chains: chainIds },
    })

    L.info('Enqueueing wallet scan', { address: addr, chains: chainIds })

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

    // Trigger job processing immediately — server-side, bypasses
    // Vercel challenge. The client can't call /api/jobs/process
    // directly because the challenge blocks browser fetches.
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    fetch(`${appUrl}/api/jobs/process`, { method: 'POST' }).catch(() => {})

    return NextResponse.json({ ok: true, jobId, message: `Scan queued for ${addr}` })
  } catch (error) {
    // Surface the ACTUAL error message so we stop debugging blind
    const msg = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack?.split('\n').slice(0, 3).join(' | ') : ''
    console.error('[scan] unhandled:', msg, stack)
    return NextResponse.json(
      { error: 'Failed to queue scan', detail: msg },
      { status: 500 }
    )
  }
}
