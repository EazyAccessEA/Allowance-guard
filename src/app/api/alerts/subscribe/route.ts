import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { apiLogger, logEmailOperation } from '@/lib/logger'

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
    
    logEmailOperation('Subscription created', email, true)
    apiLogger.info('Email subscription created', { email, wallet, riskOnly })
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    logEmailOperation('Subscription failed', email, false, error instanceof Error ? error.message : 'Unknown error')
    apiLogger.error('Subscription error', { error: error instanceof Error ? error.message : 'Unknown error', email, wallet })
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
    
    logEmailOperation('Unsubscription completed', email, true)
    apiLogger.info('Email unsubscription completed', { email, wallet })
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    logEmailOperation('Unsubscription failed', email, false, error instanceof Error ? error.message : 'Unknown error')
    apiLogger.error('Unsubscription error', { error: error instanceof Error ? error.message : 'Unknown error', email, wallet })
    return NextResponse.json({ error: 'Unsubscription failed' }, { status: 500 })
  }
}
