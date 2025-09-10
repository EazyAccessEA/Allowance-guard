// app/api/scan/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { scanWalletOnChain } from '@/lib/scanner'
import { apiLogger, logApiCall, logScanOperation } from '@/lib/logger'

export const runtime = 'nodejs'

const Body = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chains: z.array(z.enum(['eth','arb','base'])).optional().default(['eth','arb','base'])
})

const MAP: Record<string, 1|42161|8453> = { eth: 1, arb: 42161, base: 8453 }

export async function POST(req: Request) {
  const startTime = Date.now()
  
  try {
    const json = await req.json().catch(() => ({}))
    const parsed = Body.safeParse(json)
    
    if (!parsed.success) {
      apiLogger.warn('Invalid scan request body', { errors: parsed.error.errors })
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }
    
    const addr = parsed.data.walletAddress.toLowerCase()
    const chains = parsed.data.chains.map(c => MAP[c])
    
    apiLogger.info('Starting wallet scan', { address: addr, chains })
    
    // Simple sequential scan for Day 2 (optimize to queue later)
    for (const chainId of chains) {
      try {
        await scanWalletOnChain(addr, chainId)
        logScanOperation('Scan completed', addr, chainId, true)
      } catch (error) {
        logScanOperation('Scan failed', addr, chainId, false, error instanceof Error ? error.message : 'Unknown error')
        throw error
      }
    }
    
    const duration = Date.now() - startTime
    apiLogger.info('Wallet scan completed successfully', { address: addr, duration })
    
    return NextResponse.json({ ok: true, message: `Scan complete for ${addr}` })
  } catch (error) {
    const duration = Date.now() - startTime
    apiLogger.error('Wallet scan failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration 
    })
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
