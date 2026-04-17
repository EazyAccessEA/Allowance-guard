import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { db } from '@/db'
import { waitlistSubscribers } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { limitOrThrow } from '@/lib/ratelimit'
import { sendWaitlistWelcomeEmail } from '@/lib/mailer'
import { verifyTurnstileToken } from '@/lib/turnstile'

export const runtime = 'nodejs'

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address.').max(254),
  interest: z.enum(['general', 'mobile', 'sdk', 'api', 'chains']).default('general'),
  referrer: z.string().max(512).optional(),
  // Honeypot — real users leave this blank
  website: z.string().max(0).optional().or(z.literal('')),
  // Cloudflare Turnstile token. Verified server-side before any DB work.
  // Optional so the API stays backward compatible when the key isn't
  // configured yet; verifyTurnstileToken() fails open in that case.
  turnstileToken: z.string().max(4096).nullable().optional(),
})

export async function POST(req: Request) {
  try {
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown'

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parsed = SubscribeSchema.safeParse(body)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return NextResponse.json(
        { error: issue?.message ?? 'Invalid input.' },
        { status: 400 },
      )
    }

    // Turnstile first — before rate-limit and DB work, so bots get
    // rejected at the cheapest possible point. In dev (no secret set)
    // this short-circuits to true.
    const verified = await verifyTurnstileToken(parsed.data.turnstileToken, ip)
    if (!verified) {
      return NextResponse.json(
        { error: 'Bot verification failed. Refresh the page and try again.' },
        { status: 403 },
      )
    }

    try {
      await limitOrThrow(ip, 'subscribe')
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    // Honeypot tripped — silently accept, mimic new-signup response shape
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true, status: 'new' as const })
    }

    const { email, interest, referrer } = parsed.data

    // Check for existing subscriber (case-insensitive)
    const existing = await db
      .select({ id: waitlistSubscribers.id, unsubscribed: waitlistSubscribers.unsubscribed })
      .from(waitlistSubscribers)
      .where(
        and(
          eq(sql`lower(${waitlistSubscribers.email})`, email),
          eq(waitlistSubscribers.interest, interest),
        ),
      )
      .limit(1)

    if (existing.length > 0) {
      const row = existing[0]
      if (row.unsubscribed) {
        // Re-subscribe
        await db
          .update(waitlistSubscribers)
          .set({ unsubscribed: false, updatedAt: new Date() })
          .where(eq(waitlistSubscribers.id, row.id))

        // Send welcome email again
        sendWaitlistWelcomeEmail(email, interest, row.id).catch((err) => {
          console.error('[subscribe] welcome email failed (resubscribe)', err)
        })

        return NextResponse.json({ ok: true, status: 'resubscribed' as const })
      }
      // Already subscribed — tell the user honestly. A marketing waitlist
      // is not an authentication surface; the "don't leak info" pattern
      // belongs on login / password-reset endpoints, not here.
      return NextResponse.json({ ok: true, status: 'already_subscribed' as const })
    }

    // Insert new subscriber
    const [inserted] = await db
      .insert(waitlistSubscribers)
      .values({ email, interest, referrer: referrer || null })
      .returning({ id: waitlistSubscribers.id })

    // Fire-and-forget welcome email
    sendWaitlistWelcomeEmail(email, interest, inserted.id).catch((err) => {
      console.error('[subscribe] welcome email failed', err)
    })

    return NextResponse.json({ ok: true, status: 'new' as const })
  } catch (err) {
    console.error('[subscribe] failed', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
