import { NextResponse } from 'next/server'
import { createOrRotateShare } from '@/lib/share'

export async function POST(req: Request) {
  const { wallet, censor_addresses = true, censor_amounts = false, risk_only = true, expires_in_days = null } =
    await req.json().catch(() => ({}))

  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }

  const token = await createOrRotateShare({
    wallet, censor_addresses, censor_amounts, risk_only, expires_in_days
  })
  return NextResponse.json({ ok: true, token })
}
