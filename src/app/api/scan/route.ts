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

const MAP: Record<string, 1|42161|8453|10|137|43114|56|250|324|1101|5000|100|59144|534352|42220> = {
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
  celo: 42220
}

export async function POST(req: Request) {
  const L = withReq(req)
  
  // Apply rate limiting
  const rateLimitResponse = scanRateLimit(req as NextRequest)
  if (rateLimitResponse instanceof NextResponse) {
    return rateLimitResponse
  }
  
  try {
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
    
    // Increment scan counter
    await incrScan()

    // Track scan_started analytics event
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
    
    return NextResponse.json({ ok: true, jobId, message: `Scan queued for ${addr}` })
  } catch (error) {
    L.error('scan.queue.fail', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to queue scan' }, { status: 500 })
  }
}
