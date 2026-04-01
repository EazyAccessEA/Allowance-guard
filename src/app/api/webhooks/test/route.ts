/**
 * POST /api/webhooks/test
 *
 * Sends a test event to a specific webhook so the user can verify integration.
 * Requires Sentinel plan and ownership of the webhook.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { checkFeature } from '@/lib/feature-gate'
import { pool } from '@/lib/db'
import { createHmac, randomUUID } from 'crypto'
import { secureLogger } from '@/lib/secure-logger'

export const runtime = 'nodejs'

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
  const { webhookId } = body

  if (!webhookId || typeof webhookId !== 'string') {
    return NextResponse.json({ error: 'webhookId is required' }, { status: 400 })
  }

  // Verify ownership
  const { rows } = await pool.query(
    `SELECT id, url, secret, enabled FROM webhooks WHERE id = $1 AND user_id = $2`,
    [webhookId, session.user_id],
  )

  const webhook = rows[0]
  if (!webhook) {
    return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
  }

  if (!webhook.enabled) {
    return NextResponse.json({ error: 'Webhook is disabled. Enable it before testing.' }, { status: 400 })
  }

  // Build test payload
  const testPayload = {
    id: randomUUID(),
    event: 'test' as const,
    timestamp: new Date().toISOString(),
    data: {
      message: 'This is a test event from AllowanceGuard',
      webhookId: webhook.id,
    },
  }

  const payloadStr = JSON.stringify(testPayload)
  const signature = createHmac('sha256', webhook.secret).update(payloadStr).digest('hex')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch(webhook.url as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AllowanceGuard-Signature': `sha256=${signature}`,
        'X-AllowanceGuard-Event': 'test',
        'X-AllowanceGuard-Delivery': testPayload.id,
      },
      body: payloadStr,
      signal: controller.signal,
    })

    clearTimeout(timeout)

    const responseBody = await res.text().catch(() => '')
    const success = res.status >= 200 && res.status < 300

    // Log the test delivery
    await pool.query(
      `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status_code, response_body, success, attempt)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [webhookId, 'test', payloadStr, res.status, responseBody.slice(0, 1000), success, 1],
    ).catch((err) => secureLogger.error('Failed to log test delivery', { err }))

    return NextResponse.json({
      success,
      statusCode: res.status,
      responseBody: responseBody.slice(0, 500),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    // Log the failed delivery
    await pool.query(
      `INSERT INTO webhook_deliveries (webhook_id, event_type, payload, status_code, response_body, success, attempt)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [webhookId, 'test', payloadStr, null, message.slice(0, 1000), false, 1],
    ).catch(() => {})

    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 502 })
  }
}
