// app/api/scan/route.ts
import { NextResponse, NextRequest, after } from 'next/server'
import { enqueueScan, claimPending, finishJob } from '@/lib/jobs'
import { withReq, apiLogger } from '@/lib/logger'
import { enabledChainIds } from '@/lib/networks'
import { scanRateLimit } from '@/lib/rate-limit'
import { incrScan } from '@/lib/metrics'
import { validateRequest } from '@/middleware/validation'
import { scanRequestSchema } from '@/lib/validation'
import { trackEvent } from '@/lib/analytics'
import { scanWalletOnChain } from '@/lib/scanner'
import { withTimeout } from '@/lib/retry'
import { refreshRiskForWallet } from '@/lib/risk'
import { enrichWallet } from '@/lib/enrich'
import { cacheDel } from '@/lib/cache'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 180 // 3 min — enough for 27-chain scan in after()

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

    // Process the scan INLINE — not via after(), not via HTTP trigger,
    // not via cron. The response waits until the scan completes (~30-90s).
    // This is the only reliable path because Vercel's challenge blocks
    // all HTTP triggers, and after() doesn't fire on this platform.
    const failed: { chainId: number; error: string }[] = []
    let scanned = 0

    for (const chainId of chainIds) {
      try {
        await withTimeout(
          scanWalletOnChain(addr, chainId as Parameters<typeof scanWalletOnChain>[1]),
          15_000
        )
        scanned++
      } catch (e) {
        failed.push({ chainId, error: e instanceof Error ? e.message.slice(0, 200) : String(e) })
      }
    }

    L.info('scan.inline.summary', { jobId, wallet: addr, scanned, failed: failed.length, total: chainIds.length })

    // Post-scan tasks
    try {
      await refreshRiskForWallet(addr)
      await enrichWallet(addr)
    } catch (e) {
      L.warn('scan.post.failed', { error: e instanceof Error ? e.message : String(e) })
    }

    await pool.query(
      `UPDATE wallet_monitors SET last_scan_at=NOW(), updated_at=NOW() WHERE wallet_address=$1`,
      [addr.toLowerCase()]
    )
    await cacheDel(`allow:${addr.toLowerCase()}:*`)

    if (scanned === 0 && failed.length > 0) {
      await finishJob(jobId, false, `All ${failed.length} chains failed. First: ${failed[0].error}`)
      return NextResponse.json({ ok: true, jobId, scanned: 0, failed: failed.length, message: 'Scan failed — all chains unreachable' })
    }

    await finishJob(jobId, true)
    return NextResponse.json({ ok: true, jobId, scanned, failed: failed.length, message: `Scanned ${scanned} chains` })
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
