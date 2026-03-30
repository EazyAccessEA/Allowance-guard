import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const { wallet, webhookUrl, riskOnly = true } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })
  if (!webhookUrl || !/^https:\/\/hooks\.slack\.com\/services\//.test(webhookUrl)) {
    return NextResponse.json({ error: 'Invalid Slack webhook' }, { status: 400 })
  }
  await pool.query(
    `INSERT INTO slack_subscriptions (wallet_address, webhook_url, risk_only)
     VALUES ($1,$2,$3)
     ON CONFLICT (wallet_address, webhook_url) DO UPDATE SET risk_only=EXCLUDED.risk_only`,
     [wallet.toLowerCase(), webhookUrl, !!riskOnly]
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { wallet, webhookUrl } = await req.json().catch(() => ({}))
  if (!wallet || !webhookUrl) return NextResponse.json({ error: 'Missing' }, { status: 400 })
  await pool.query(
    `DELETE FROM slack_subscriptions WHERE wallet_address=$1 AND webhook_url=$2`,
    [wallet.toLowerCase(), webhookUrl]
  )
  return NextResponse.json({ ok: true })
}
