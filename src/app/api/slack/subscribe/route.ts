import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'

/**
 * POST /api/slack/subscribe — subscribe an authenticated user to risk
 * alerts on a wallet via a Slack webhook URL.
 *
 * Pricing claim: alert-class features require the Pro plan or above.
 * The previous implementation had no auth and no plan gate — any
 * unauthenticated request could register a Slack webhook for any
 * address, creating both an abuse surface (relaying our alerts to
 * arbitrary Slack workspaces) and a free-rider on a paid feature.
 * P0 fix.
 */
export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(Number(session.user_id), 'alerts')
  if (!access.allowed) {
    return NextResponse.json(
      {
        error: 'Slack alerts require the Pro plan or above',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: access.plan,
        requiredPlan: access.requiredPlan,
        upgradeUrl: '/pricing',
      },
      { status: 403 },
    )
  }

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
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { wallet, webhookUrl } = await req.json().catch(() => ({}))
  if (!wallet || !webhookUrl) return NextResponse.json({ error: 'Missing' }, { status: 400 })
  await pool.query(
    `DELETE FROM slack_subscriptions WHERE wallet_address=$1 AND webhook_url=$2`,
    [wallet.toLowerCase(), webhookUrl]
  )
  return NextResponse.json({ ok: true })
}
