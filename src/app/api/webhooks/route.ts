import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { pool } from '@/lib/db'
import { randomBytes, createHash } from 'crypto'
import { secureLogger } from '@/lib/secure-logger'
import type { WebhookEventType } from '@/lib/webhook-dispatcher'

const VALID_EVENTS: WebhookEventType[] = [
  'approval.new', 'approval.changed', 'approval.removed',
  'risk.increased', 'risk.decreased',
  'scan.completed',
  'rule.triggered', 'rule.executed',
  'monitor.alert',
  'team.wallet_added', 'team.wallet_removed',
  'team.member_added', 'team.member_removed',
]

/**
 * GET /api/webhooks
 * List user's webhooks.
 */
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(session.user_id as number, 'webhooks')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Webhooks require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const { rows } = await pool.query(
    `SELECT id, name, url, events, enabled, last_triggered_at, failure_count, team_id, created_at
     FROM webhooks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [session.user_id],
  )
  return NextResponse.json({ webhooks: rows })
}

/**
 * POST /api/webhooks
 * Register a new webhook.
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const access = await checkFeature(session.user_id as number, 'webhooks')
  if (!access.allowed) {
    return NextResponse.json(
      { error: 'Webhooks require the Sentinel plan', requiredPlan: access.requiredPlan },
      { status: 403 },
    )
  }

  const body = await req.json().catch(() => ({}))
  const { name, url, events = [], teamId } = body

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return NextResponse.json({ error: 'Webhook name is required' }, { status: 400 })
  }

  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 })
  }

  // Validate URL format
  try {
    const parsed = new URL(url)
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'URL must use HTTP or HTTPS' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
  }

  // Validate events
  if (events.length > 0) {
    for (const evt of events) {
      if (!VALID_EVENTS.includes(evt)) {
        return NextResponse.json({ error: `Invalid event type: ${evt}` }, { status: 400 })
      }
    }
  }

  // If team-scoped, verify membership
  if (teamId) {
    const mem = await pool.query(
      `SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2`,
      [teamId, session.user_id],
    )
    const role = mem.rows[0]?.role as string | undefined
    if (!role || !['owner', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Only team owner or admin can create team webhooks' }, { status: 403 })
    }
  }

  // Generate signing secret
  const rawSecret = `whsec_${randomBytes(24).toString('hex')}`
  const hashedSecret = createHash('sha256').update(rawSecret).digest('hex')

  // Limit webhooks per user (max 10)
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM webhooks WHERE user_id = $1`,
    [session.user_id],
  )
  if ((countRows[0]?.count as number) >= 10) {
    return NextResponse.json({ error: 'Maximum of 10 webhooks allowed' }, { status: 400 })
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO webhooks (user_id, team_id, name, url, secret, events)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, url, events, enabled, created_at`,
      [session.user_id, teamId ?? null, name.trim(), url, hashedSecret, JSON.stringify(events)],
    )

    secureLogger.info('Webhook created', { webhookId: rows[0]?.id, userId: session.user_id })

    return NextResponse.json({
      webhook: rows[0],
      secret: rawSecret, // Only shown once at creation time
    }, { status: 201 })
  } catch (err) {
    secureLogger.error('Failed to create webhook', { err })
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
  }
}
