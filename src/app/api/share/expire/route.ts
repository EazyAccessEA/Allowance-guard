import { NextResponse } from 'next/server'
import { expireShare } from '@/lib/share'

export async function POST(req: Request) {
  const { wallet } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  await expireShare(wallet)
  return NextResponse.json({ ok: true })
}
