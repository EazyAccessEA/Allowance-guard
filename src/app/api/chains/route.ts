import { NextResponse } from 'next/server'
import { CHAINS, getSupportedChainIds } from '@/lib/networks'

export async function GET() {
  const enabled = getSupportedChainIds(true)
  const data = enabled.map(id => CHAINS[id])
  return NextResponse.json({ success: true, chains: data })
}
