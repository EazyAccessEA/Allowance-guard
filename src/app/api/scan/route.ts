// app/api/scan/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { scanWalletOnChain } from '@/lib/scanner'

export const runtime = 'nodejs'

const Body = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  chains: z.array(z.enum(['eth','arb','base'])).optional().default(['eth','arb','base'])
})

const MAP: Record<string, 1|42161|8453> = { eth: 1, arb: 42161, base: 8453 }

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }
  const addr = parsed.data.walletAddress.toLowerCase()
  const chains = parsed.data.chains.map(c => MAP[c])

  // Simple sequential scan for Day 2 (optimize to queue later)
  for (const chainId of chains) {
    await scanWalletOnChain(addr, chainId)
  }

  return NextResponse.json({ ok: true, message: `Scan complete for ${addr}` })
}
