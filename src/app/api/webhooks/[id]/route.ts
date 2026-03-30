import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { pool } from '@/lib/db'
import { getWebhookDeliveries } from '@/lib/webhook-dispatcher'
import { secureLogger } from '@/lib/secure-logger'

/**
 * GET /api/webhooks/[id]
 * Get webhook details with recent delivery history.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id } = await params

  const { rows } = await pool.query(
    `SELECT id, name, url, events, enabled, last_triggered_at, failure_count, team_id, created_at, updated_at
     FROM webhooks WHERE id = $1 AND user_id = $2`,
    [id, session.user_id],
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }

  const deliveries = await getWebhookDeliveries(id, 20)

  return NextResponse.json({
    webhook: rows[0],
    deliveries: deliveries.deliveries,
    totalDeliveries: deliveries.total,
  })
}

/**
 * PUT /api/webhooks/[id]
 * Update webhook (enable/disable, change events, update URL).
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const { name, url, events, enabled } = body

  // Verify ownership
  const { rows: existing } = await pool.query(
    `SELECT id FROM webhooks WHERE id = $1 AND user_id = $2`,
    [id, session.user_id],
  )
  if (existing.length === 0) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }

  const updates: string[] = []
  const values: unknown[] = []
  let paramIdx = 1

  if (name !== undefined) {
    updates.push(`name = $${paramIdx}`)
    values.push(name.trim())
    paramIdx++
  }
  if (url !== undefined) {
    try {
      const parsed = new URL(url)
      if (!['https:', 'http:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'URL must use HTTP or HTTPS' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }
    updates.push(`url = $${paramIdx}`)
    values.push(url)
    paramIdx++
  }
  if (events !== undefined) {
    updates.push(`events = $${paramIdx}`)
    values.push(JSON.stringify(events))
    paramIdx++
  }
  if (enabled !== undefined) {
    updates.push(`enabled = $${paramIdx}`)
    values.push(Boolean(enabled))
    paramIdx++
    // Reset failure count when re-enabling
    if (enabled) {
      updates.push('failure_count = 0')
    }
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  }

  updates.push('updated_at = NOW()')
  values.push(id)
  values.push(session.user_id)

  const { rows } = await pool.query(
    `UPDATE webhooks SET ${updates.join(', ')} WHERE id = $${paramIdx} AND user_id = $${paramIdx + 1}
     RETURNING id, name, url, events, enabled, failure_count, updated_at`,
    values,
  )

  return NextResponse.json({ webhook: rows[0] })
}

/**
 * DELETE /api/webhooks/[id]
 * Delete a webhook.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const { id } = await params

  const { rowCount } = await pool.query(
    `DELETE FROM webhooks WHERE id = $1 AND user_id = $2`,
    [id, session.user_id],
  )

  if (rowCount === 0) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }

  secureLogger.info('Webhook deleted', { webhookId: id, userId: session.user_id })

  return NextResponse.json({ ok: true })
}
