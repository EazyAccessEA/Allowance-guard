// src/app/api/unsubscribe/by-email/route.ts
//
// User-driven unsubscribe by email address. Used by the /unsubscribe
// page (which the email-template footer links to with ?email=…).
//
// Marks every matching waitlist_subscribers row as unsubscribed.
// Returns { ok: true } regardless of whether the email exists, to
// avoid enumeration. Honoring the opt-out is a hard PECR/GDPR
// requirement (#24 VETO territory) — the previous /unsubscribe page
// silently did nothing, which was a real legal exposure.
//
// Per-IP rate limit prevents brute-force enumeration. No auth — opt-out
// must always work without a wallet sign-in (PECR consent withdrawal).

import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { db } from '@/db'
import { waitlistSubscribers } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { limitHit } from '@/lib/ratelimit'

export const runtime = 'nodejs'

const Schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
})

export async function POST(req: Request) {
  try {
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'

    const burst = await limitHit(`unsub-by-email:ip:${ip}`, 60, 10)
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

    // Mark every matching row as unsubscribed. Lowercase compare so
    // capitalisation differences don't leak rows back into the marketing
    // sends.
    const updated = await db
      .update(waitlistSubscribers)
      .set({ unsubscribed: true, updatedAt: new Date() })
      .where(eq(sql`lower(${waitlistSubscribers.email})`, email))
      .returning({ id: waitlistSubscribers.id })

    console.info('[unsub-by-email] processed', {
      email,
      rowsUpdated: updated.length,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      )
    }
    console.error('[unsub-by-email] failed', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
