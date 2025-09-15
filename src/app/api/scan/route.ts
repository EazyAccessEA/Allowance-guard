// app/api/scan/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { enqueueScan, hasRecentScan } from '@/lib/jobs'
import { withReq } from '@/lib/logger'

export const runtime = 'nodejs'

const Body = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chains: z.array(z.enum(['eth','arb','base'])).optional().default(['eth','arb','base'])
})

const MAP: Record<string, 1|42161|8453> = { eth: 1, arb: 42161, base: 8453 }

export async function POST(req: Request) {
  const L = withReq(req)
  
  try {
    L.info('scan.queue.start', { path: '/api/scan' })
    
    const json = await req.json().catch(() => ({}))
    const parsed = Body.safeParse(json)
    
    if (!parsed.success) {
      L.warn('Invalid scan request body', { errors: parsed.error.issues })
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    const addr = parsed.data.walletAddress.toLowerCase()
    const chains = parsed.data.chains.map(c => MAP[c])
    
    // Check for recent scan to prevent duplicates
    if (await hasRecentScan(addr)) {
      L.info('scan.queue.duplicate', { wallet: addr })
      return NextResponse.json({ ok: true, message: 'Scan already in progress' })
    }
    
    L.info('Enqueueing wallet scan', { address: addr, chains })
    
    const jobId = await enqueueScan(addr, chains)
    
    L.info('scan.queue.ok', { wallet: addr, jobId })
    
    return NextResponse.json({ ok: true, jobId, message: `Scan queued for ${addr}` })
  } catch (error) {
    L.error('scan.queue.fail', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to queue scan' }, { status: 500 })
  }
}
