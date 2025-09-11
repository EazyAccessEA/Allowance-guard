// app/api/scan/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { enqueueScan } from '@/lib/jobs'
import { apiLogger } from '@/lib/logger'

export const runtime = 'nodejs'

const Body = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chains: z.array(z.enum(['eth','arb','base'])).optional().default(['eth','arb','base'])
})

const MAP: Record<string, 1|42161|8453> = { eth: 1, arb: 42161, base: 8453 }

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = Body.safeParse(json)
    
    if (!parsed.success) {
      apiLogger.warn('Invalid scan request body', { errors: parsed.error.issues })
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    const addr = parsed.data.walletAddress.toLowerCase()
    const chains = parsed.data.chains.map(c => MAP[c])
    
    apiLogger.info('Enqueueing wallet scan', { address: addr, chains })
    
    const jobId = await enqueueScan(addr, chains)
    
    apiLogger.info('Wallet scan queued successfully', { address: addr, jobId })
    
    return NextResponse.json({ ok: true, jobId, message: `Scan queued for ${addr}` })
  } catch (error) {
    apiLogger.error('Failed to queue wallet scan', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json({ error: 'Failed to queue scan' }, { status: 500 })
  }
}
