// app/api/scan/route.ts
import { NextResponse } from 'next/server'

type Body = {
  walletAddress?: string
  chains?: string[]
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body
  const addr = body.walletAddress?.toLowerCase()

  if (!addr || !/^0x[a-f0-9]{40}$/.test(addr)) {
    return NextResponse.json({ error: 'Invalid walletAddress' }, { status: 400 })
  }

  // Day 1: stub only. Day 2 will enqueue a backfill job & return a scan id.
  return NextResponse.json({
    ok: true,
    message: `Scan started for ${addr} on ${body.chains?.join(', ') || 'eth'}`
  })
}
