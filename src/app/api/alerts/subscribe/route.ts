import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { email, wallet, riskOnly = true } = await req.json().catch(() => ({}))
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  }
  
  try {
    await pool.query(
      `INSERT INTO alert_subscriptions (email, wallet_address, risk_only)
       VALUES ($1, $2, $3)
       ON CONFLICT (email, wallet_address) DO UPDATE SET risk_only = EXCLUDED.risk_only`,
      [email.toLowerCase(), wallet.toLowerCase(), !!riskOnly]
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { email, wallet } = await req.json().catch(() => ({}))
  
  if (!email || !wallet) {
    return NextResponse.json({ error: 'Missing email or wallet' }, { status: 400 })
  }
  
  try {
    await pool.query(
      `DELETE FROM alert_subscriptions WHERE email = $1 AND wallet_address = $2`,
      [email.toLowerCase(), wallet.toLowerCase()]
    )
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Unsubscription error:', error)
    return NextResponse.json({ error: 'Unsubscription failed' }, { status: 500 })
  }
}
