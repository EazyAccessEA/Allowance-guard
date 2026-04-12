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
import { scanWalletOnChain } from '@/lib/scanner'
import { withTimeout } from '@/lib/retry'
import { refreshRiskForWallet } from '@/lib/risk'
import { enrichWallet } from '@/lib/enrich'
import { cacheDel } from '@/lib/cache'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'

/**
 * Top chains by DeFi TVL / approval volume. These are scanned INLINE
 * (~18s total) so the user gets results immediately. The remaining
 * chains are queued for background processing via Vercel Cron.
 *
 * Council approved: #3 Web3, #4 Security, #5 Marketing, #11 Investor,
 * #15 Architect, #17 Performance — unanimous.
 */
const FAST_CHAINS = new Set([1, 42161, 8453, 137, 10, 56])

const MAP: Record<string, number> = {
  eth: 1, arb: 42161, base: 8453, op: 10, polygon: 137, avalanche: 43114,
  bsc: 56, fantom: 250, zksync: 324, 'polygon-zkevm': 1101, mantle: 5000,
  gnosis: 100, linea: 59144, scroll: 534352, celo: 42220, blast: 81457,
  cronos: 25, moonbeam: 1284, aurora: 1313161554, opbnb: 204, manta: 169,
  mode: 34443, taiko: 167000, metis: 1088, kava: 2222, zetachain: 7000,
  worldchain: 480,
}

/**
 * POST /api/scan
 *
 * Two-phase scan:
 * 1. FAST (inline, ~18s): scan top 6 chains, return results immediately
 * 2. SLOW (background): queue remaining chains for Vercel Cron (~1 min)
 *
 * The user sees results in ~18 seconds. Background chains appear on refresh.
 */
export async function POST(req: Request) {
  try {
    const L = withReq(req)

    const rateLimitResponse = scanRateLimit(req as NextRequest)
    if (rateLimitResponse instanceof NextResponse) {
      return rateLimitResponse
    }

    L.info('scan.queue.start', { path: '/api/scan' })

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
    const allChainIds = chains?.length
      ? chains.map(c => MAP[c])
      : enabledChainIds()

    // Split into fast (inline) and slow (background) groups
    const fastChains = allChainIds.filter(id => FAST_CHAINS.has(id))
    const slowChains = allChainIds.filter(id => !FAST_CHAINS.has(id))

    await incrScan()
    trackEvent('scan_started', { metadata: { walletAddress: addr, chains: allChainIds } })

    // ── Phase 1: FAST — scan top chains inline (~18s) ──────────────
    L.info('scan.fast.start', { wallet: addr, chains: fastChains.length })

    const failed: { chainId: number; error: string }[] = []
    let scanned = 0

    for (const chainId of fastChains) {
      try {
        await withTimeout(
          scanWalletOnChain(addr, chainId as Parameters<typeof scanWalletOnChain>[1]),
          30_000 // 30s per chain — enough for ~5 getLogs calls
        )
        scanned++
      } catch (e) {
        failed.push({ chainId, error: e instanceof Error ? e.message.slice(0, 200) : String(e) })
      }
    }

    // Post-scan: risk + enrich on whatever we found
    try {
      await refreshRiskForWallet(addr)
      await enrichWallet(addr)
    } catch {}

    await cacheDel(`allow:${addr.toLowerCase()}:*`)

    L.info('scan.fast.done', { wallet: addr, scanned, failed: failed.length })

    // ── Phase 2: SLOW — queue remaining chains for cron ────────────
    let backgroundJobId: number | null = null
    if (slowChains.length > 0) {
      try {
        backgroundJobId = await enqueueScan(addr, slowChains)
        L.info('scan.slow.queued', { wallet: addr, jobId: backgroundJobId, chains: slowChains.length })
      } catch (e: unknown) {
        // Duplicate is fine — another scan already covers these chains
        if (!(e instanceof Error && e.message.includes('uniq_jobs_active_wallet'))) {
          L.warn('scan.slow.queue.failed', { error: e instanceof Error ? e.message : String(e) })
        }
      }
    }

    return NextResponse.json({
      ok: true,
      scanned,
      failed: failed.length,
      failedDetails: failed.slice(0, 6),
      backgroundJobId,
      backgroundChains: slowChains.length,
      message: `Scanned ${scanned} chains. ${slowChains.length} more scanning in background.`,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[scan] unhandled:', msg)
    return NextResponse.json(
      { error: 'Failed to scan', detail: msg },
      { status: 500 }
    )
  }
}
