import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { checkFeature, getUserPlanLimits } from '@/lib/feature-gate'
import { isUnlimited } from '@/lib/plans'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const wallet = (searchParams.get('wallet') || '').toLowerCase()
  if (!/^0x[a-f0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })

  // Scope query to authenticated user's monitors
  const { rows } = await pool.query(
    `SELECT * FROM wallet_monitors WHERE wallet_address=$1 AND user_id=$2`,
    [wallet, session.user_id]
  )
  return NextResponse.json({ monitor: rows[0] ?? null })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pricing claim: "Continuous monitoring" requires the Pro plan or
  // above (monitoring flag), with `maxMonitoredWallets` quota per plan
  // (Pro = 5, Sentinel = 50). Previously auth-gated only — Free users
  // could create unlimited monitors, and Pro users could exceed their
  // 5-wallet quota. P0 fix.
  const access = await checkFeature(Number(session.user_id), 'monitoring')
  if (!access.allowed) {
    return NextResponse.json(
      {
        error: 'Continuous monitoring requires the Pro plan or above',
        code: 'PLAN_LIMIT_EXCEEDED',
        plan: access.plan,
        requiredPlan: access.requiredPlan,
        upgradeUrl: '/pricing',
      },
      { status: 403 },
    )
  }

  const { wallet, enabled = true, freq_minutes = 720 } = await req.json().catch(() => ({}))
  if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) return NextResponse.json({ error: 'Invalid wallet' }, { status: 400 })

  // maxMonitoredWallets quota — only when enabling a monitor that isn't
  // already counted. Disabling or updating an existing monitor doesn't
  // need a quota check (it's already in the count).
  if (enabled) {
    const limits = await getUserPlanLimits(Number(session.user_id))
    if (!isUnlimited(limits.maxMonitoredWallets)) {
      const { rows: existing } = await pool.query(
        `SELECT COUNT(*)::int AS count FROM wallet_monitors
         WHERE user_id = $1 AND enabled = TRUE AND wallet_address <> $2`,
        [session.user_id, wallet.toLowerCase()],
      )
      const currentEnabled = (existing[0]?.count as number) ?? 0
      if (currentEnabled >= limits.maxMonitoredWallets) {
        return NextResponse.json(
          {
            error: `Your plan allows up to ${limits.maxMonitoredWallets} monitored wallets`,
            code: 'WALLET_LIMIT_EXCEEDED',
            plan: limits.plan,
            limit: limits.maxMonitoredWallets,
            used: currentEnabled,
            requiredPlan: limits.plan === 'pro' ? 'sentinel' : undefined,
            upgradeUrl: '/pricing',
          },
          { status: 403 },
        )
      }
    }
  }

  await pool.query(`
    INSERT INTO wallet_monitors (wallet_address, user_id, enabled, freq_minutes, last_scan_at, updated_at)
    VALUES ($1,$2,$3,$4,NULL,NOW())
    ON CONFLICT (wallet_address) DO UPDATE
      SET enabled=$3, freq_minutes=$4, updated_at=NOW()
      WHERE wallet_monitors.user_id=$2
  `, [wallet.toLowerCase(), session.user_id, !!enabled, Number(freq_minutes)])
  return NextResponse.json({ ok: true })
}
