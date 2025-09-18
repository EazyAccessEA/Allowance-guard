// app/api/scan/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { z } from 'zod'
import { enqueueScan } from '@/lib/jobs'
import { withReq } from '@/lib/logger'
import { enabledChainIds } from '@/lib/networks'
import { scanRateLimit } from '@/lib/rate-limit'
import { incrScan } from '@/lib/metrics'

export const runtime = 'nodejs'

const Body = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chains: z.array(z.enum(['eth','arb','base'])).optional()
})

const MAP: Record<string, 1|42161|8453> = { eth: 1, arb: 42161, base: 8453 }

export async function POST(req: Request) {
  const L = withReq(req)
  
  // Apply rate limiting
  const rateLimitResponse = scanRateLimit(req as NextRequest)
  if (rateLimitResponse instanceof NextResponse) {
    return rateLimitResponse
  }
  
  try {
    L.info('scan.queue.start', { path: '/api/scan' })
    
    const json = await req.json().catch(() => ({}))
    const parsed = Body.safeParse(json)
    
    if (!parsed.success) {
      L.warn('Invalid scan request body', { errors: parsed.error.issues })
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    const addr = parsed.data.walletAddress.toLowerCase()
    const chains = parsed.data.chains?.length 
      ? parsed.data.chains.map(c => MAP[c])
      : enabledChainIds()
    
    // Increment scan counter
    await incrScan()
    
    L.info('Enqueueing wallet scan', { address: addr, chains })
    
    let jobId: number
    try {
      jobId = await enqueueScan(addr, chains)
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
