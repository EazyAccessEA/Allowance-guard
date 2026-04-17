// src/app/api/subscribe/resend-welcome/route.ts
//
// Self-service "resend my welcome email" endpoint. Used by the
// already-subscribed branch of the waitlist form when a user wants the
// welcome they didn't receive (lost, missed, spam-filtered).
//
// Behaviour:
//   - Per-email rate limit: 1 successful send per 24 hours (Upstash).
//     Spam control — a real human just wants the email; bots can't use
//     this as a mass-mailer.
//   - Per-IP burst limit: 5 requests per minute. Cheap defence against
//     enumeration attempts.
//   - Looks up the email in waitlist_subscribers. If found and active
//     (not unsubscribed), fires sendWaitlistWelcomeEmail.
//   - Returns { ok: true } regardless of whether the email exists, so
//     the endpoint can't be used to enumerate the waitlist.
//
// Council:
//   #4 Security: rate-limit on both email + IP; don't leak existence;
//                no auth (intentional — user can't auth via wallet for
//                an email-only path)
//   #19 Privacy / GDPR: only sends to addresses that already opted in;
//                       not a new consent surface
//   #34 Debug:   structured logging includes whether the address was
//                found, rate-limited, or sent — for triage

import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { db } from '@/db'
import { waitlistSubscribers } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { limitHit } from '@/lib/ratelimit'
import { sendWaitlistWelcomeEmail } from '@/lib/mailer'

export const runtime = 'nodejs'

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

function getIp(): Promise<string> {
  return nextHeaders().then((h) => {
    return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
  })
}

export async function POST(req: Request) {
  try {
    const ip = await getIp()

    // Per-IP burst limit — 5 per minute. Cheap.
    const burst = await limitHit(`resend-welcome:ip:${ip}`, 60, 5)
    if (!burst.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parsed = Schema.parse(body)
    const { email } = parsed

    // Per-email rate limit — 1 successful resend per 24h. We check this
    // BEFORE the DB lookup so a flood of requests for unknown emails
    // doesn't burn DB cycles.
    const emailLimit = await limitHit(`resend-welcome:email:${email}`, 86400, 1)
    if (!emailLimit.allowed) {
      // Don't 429 here — same opaque success the lookup-miss path returns.
      // The user sees "sent" either way; the cooldown is silent.
      console.info('[resend-welcome] rate-limited (per-email)', { email })
      return NextResponse.json({ ok: true })
    }

    // Look up the email. Use lower(email) match so casing doesn't bite.
    const rows = await db
      .select({
        id: waitlistSubscribers.id,
        interest: waitlistSubscribers.interest,
        unsubscribed: waitlistSubscribers.unsubscribed,
      })
      .from(waitlistSubscribers)
      .where(and(eq(sql`lower(${waitlistSubscribers.email})`, email)))
      .limit(1)

    if (rows.length === 0 || rows[0].unsubscribed) {
      // Email not on the list (or opted out). Return ok to avoid leaking.
      console.info('[resend-welcome] no-op', {
        email,
        reason: rows.length === 0 ? 'not_found' : 'unsubscribed',
      })
      return NextResponse.json({ ok: true })
    }

    const row = rows[0]
    sendWaitlistWelcomeEmail(email, row.interest, row.id).catch((err) => {
      console.error('[resend-welcome] welcome email failed', err)
    })

    console.info('[resend-welcome] sent', { email, interest: row.interest })
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      )
    }
    console.error('[resend-welcome] failed', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
