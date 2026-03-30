import { NextResponse } from 'next/server'
import { enrichWallet } from '@/lib/enrich'

export async function POST(req: Request) {
  const { wallet } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  await enrichWallet(wallet.toLowerCase())
  return NextResponse.json({ ok: true })
}
