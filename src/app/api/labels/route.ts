import { NextResponse } from 'next/server'
import { saveSpenderLabel } from '@/lib/metadata'

export async function POST(req: Request) {
  const { chainId, address, label, trust = 'curated' } = await req.json().catch(() => ({}))
  if (!chainId || !address || !label) return NextResponse.json({ error: 'Missing' }, { status: 400 })
  await saveSpenderLabel(Number(chainId), address.toLowerCase(), String(label), trust)
  return NextResponse.json({ ok: true })
}
