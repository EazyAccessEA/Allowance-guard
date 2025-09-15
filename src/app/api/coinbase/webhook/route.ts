// /src/app/api/coinbase/webhook/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/db'
// import { coinbaseDonations } from '@/db/schema' // TODO: Implement when needed
import { sql } from 'drizzle-orm'
import { alreadyProcessed, markProcessed, auditWebhook } from '@/lib/webhook_guard'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type CoinbaseEventEnvelope = {
  id: string
  scheduled_for?: string
  attempt_number?: number
  event: {
    id: string
    type: string                   // e.g. "charge:created", "charge:pending", "charge:confirmed", "charge:failed", "charge:resolved"
    api_version: string
    created_at: string
    data: {
      code: string                 // e.g. "66BEOV2A"
      name?: string
      description?: string
      hosted_url?: string
      pricing?: {
        local?: { amount: string; currency: string }
        [k: string]: unknown
      }
      timeline?: Array<{ time?: string; status: string }>
      [k: string]: unknown
    }
  }
}

function toMinorUnits(amountStr?: string) {
  if (!amountStr) return null
  const n = Number(amountStr)
  if (Number.isNaN(n)) return null
  return Math.round(n * 100)
}

function extractStatusFromTimeline(timeline?: Array<{ status: string }>, fallback?: string) {
  if (!timeline || timeline.length === 0) return fallback || 'NEW'
  return (timeline[timeline.length - 1].status || fallback || 'NEW').toUpperCase()
}

export async function POST(req: Request) {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET
  if (!secret) return new NextResponse('Missing COINBASE_COMMERCE_WEBHOOK_SECRET', { status: 500 })

  // 1) Get raw body and signature header
  const raw = await req.text()
  const sigHeader = (await headers()).get('x-cc-webhook-signature') || ''

  // 2) Compute HMAC SHA256 digest of raw body using shared secret
  const digest = createHmac('sha256', secret).update(raw, 'utf8').digest('hex')

  // 3) Constant-time compare
  const isValid =
    sigHeader.length === digest.length &&
    timingSafeEqual(Buffer.from(sigHeader, 'utf8'), Buffer.from(digest, 'utf8'))

  if (!isValid) {
    console.error('❌ Coinbase HMAC verification failed')
    return new NextResponse('Invalid signature', { status: 400 })
  }

  // 4) Parse JSON after signature verification
  let payload: CoinbaseEventEnvelope
  try {
    payload = JSON.parse(raw)
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 })
  }

  const ev = payload.event
  const data = ev?.data
  if (!ev || !data?.code) {
    return NextResponse.json({ received: true }) // nothing actionable
  }

  // Check for replay attacks
  const eventId = ev?.id || payload.id
  if (!eventId) return NextResponse.json({ error: 'No event id' }, { status: 400 })
  if (await alreadyProcessed('coinbase', eventId)) {
    return NextResponse.json({ ok: true, replay: true })
  }

  const chargeCode = data.code
  const localAmountStr = data?.pricing?.local?.amount
  const localCurrency = (data?.pricing?.local?.currency || 'GBP').toUpperCase()
  const localAmountMinor = toMinorUnits(localAmountStr) ?? 0
  const email = ((data?.metadata as { email?: string })?.email) || null

  const status = extractStatusFromTimeline(data.timeline, ev.type.split(':')[1]) // use timeline if present, fallback to event type suffix
  const hostedUrl = data.hosted_url || null
  const lastEventId = ev.id

  try {
    // Upsert by charge_code: insert new or update status/metadata on subsequent events
    await db.execute(sql`
      INSERT INTO coinbase_donations (
        charge_code, last_event_id, status, hosted_url, local_amount, local_currency, metadata, email, created_at, updated_at
      ) VALUES (
        ${chargeCode}, ${lastEventId}, ${status}, ${hostedUrl}, ${localAmountMinor}, ${localCurrency}, ${JSON.stringify(data)}, ${email}, NOW(), NOW()
      )
      ON CONFLICT (charge_code) DO UPDATE
      SET
        last_event_id = EXCLUDED.last_event_id,
        status        = EXCLUDED.status,
        hosted_url    = COALESCE(EXCLUDED.hosted_url, coinbase_donations.hosted_url),
        local_amount  = CASE
                          WHEN EXCLUDED.local_amount > 0 THEN EXCLUDED.local_amount
                          ELSE coinbase_donations.local_amount
                        END,
        local_currency= EXCLUDED.local_currency,
        metadata      = EXCLUDED.metadata,
        email         = COALESCE(EXCLUDED.email, coinbase_donations.email),
        updated_at    = NOW()
    `)

    await auditWebhook('coinbase', ev?.type || 'unknown', chargeCode, { timeline: data.timeline })
    await markProcessed('coinbase', eventId)
    console.log('✅ Coinbase upsert', { chargeCode, status, lastEventId })
    return NextResponse.json({ received: true })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error'
    console.error('❌ Coinbase webhook DB error:', errorMessage)
    return new NextResponse('DB error', { status: 500 })
  }
}
