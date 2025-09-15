import { NextResponse } from 'next/server'
import { CHAINS } from '@/lib/networks'

export async function GET() {
  return NextResponse.json({ 
    chains: Object.values(CHAINS).map(c => ({
      id: c.id, 
      name: c.name, 
      enabled: c.enabled, 
      explorer: c.explorer
    }))
  })
}
