// src/app/api/contact/route.ts
//
// Public contact endpoint. Accepts a structured message from the
// /contact form, validates it, rate-limits per IP, and:
//   1. Routes the message to the right operator inbox via mailer.sendMail
//      with kind: 'operator'.
//   2. Sends a confirmation email back to the submitter via mailer.sendMail
//      with kind: 'marketing' so the user has a record they wrote in.
//
// Topic routing:
//   - support       -> support@allowanceguard.com
//   - security      -> security@allowanceguard.com
//   - partnerships  -> support@allowanceguard.com   (subject prefixed)
//   - press         -> support@allowanceguard.com   (subject prefixed)
//   - funding       -> support@allowanceguard.com   (subject prefixed)
//   - other         -> support@allowanceguard.com
//
// Both sends go through `mailer.sendMail`. The previous inline
// `sendViaResend` duplication has been removed.

import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { limitOrThrow } from '@/lib/ratelimit'
import { sendMail } from '@/lib/mailer'

export const runtime = 'nodejs'

const TOPIC_ROUTING: Record<
  string,
  { to: string; label: string; ackWindow: string }
> = {
  support:      { to: 'support@allowanceguard.com',  label: 'Support',      ackWindow: 'one business day' },
  security:     { to: 'security@allowanceguard.com', label: 'Security',     ackWindow: 'two hours' },
  partnerships: { to: 'support@allowanceguard.com',  label: 'Partnerships', ackWindow: 'one business day' },
  enterprise:   { to: 'sales@allowanceguard.com',    label: 'Enterprise',   ackWindow: 'one business day' },
  press:        { to: 'support@allowanceguard.com',  label: 'Press',        ackWindow: 'one business day' },
  funding:      { to: 'support@allowanceguard.com',  label: 'Funding',      ackWindow: 'one business day' },
  other:        { to: 'support@allowanceguard.com',  label: 'General',      ackWindow: 'one business day' },
}

const ContactSchema = z.object({
  name:    z.string().trim().min(1, 'Name is required').max(120),
  email:   z.string().trim().email('Valid email is required').max(254),
  topic:   z.enum(['support', 'security', 'partnerships', 'enterprise', 'press', 'funding', 'other']),
  wallet:  z.string().trim().max(64).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(5000),
  // Honeypot — real users leave this blank, bots fill it in.
  company: z.string().max(0).optional().or(z.literal('')),
})

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  try {
    const h = await nextHeaders()
    const ip = h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown'

    try {
      await limitOrThrow(ip, 'contact')
    } catch {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
    }

    const parsed = ContactSchema.safeParse(body)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      return NextResponse.json(
        { error: issue?.message ?? 'Invalid input.' },
        { status: 400 },
      )
    }

    // Honeypot tripped — silently accept so bots get no signal.
    if (parsed.data.company && parsed.data.company.length > 0) {
      return NextResponse.json({ ok: true })
    }

    const { name, email, topic, wallet, message } = parsed.data
    const route = TOPIC_ROUTING[topic]

    const subject = `[${route.label}] ${name} via allowanceguard.com`
    const safeName    = escape(name)
    const safeEmail   = escape(email)
    const safeWallet  = wallet ? escape(wallet) : null
    const safeMessage = escape(message).replace(/\n/g, '<br/>')
    const safeIp      = escape(ip)

    // -------- Operator-inbox email (kind: 'operator') --------
    const operatorContent = `
      <h1>New ${escape(route.label)} message</h1>
      <table>
        <tr><td class="label">From</td><td><strong>${safeName}</strong></td></tr>
        <tr><td class="label">Email</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
        <tr><td class="label">Topic</td><td>${escape(route.label)}</td></tr>
        ${safeWallet ? `<tr><td class="label">Wallet</td><td class="mono">${safeWallet}</td></tr>` : ''}
        <tr><td class="label">IP</td><td class="mono">${safeIp}</td></tr>
      </table>

      <h2>Message</h2>
      <div class="quote">${safeMessage}</div>

      <p class="reply-hint">Reply directly to this email to respond to ${safeName}.</p>
    `

    await sendMail(route.to, subject, operatorContent, undefined, { kind: 'operator' })

    // -------- User confirmation email (kind: 'marketing') --------
    // Fire-and-forget — operator notification is the load-bearing send;
    // a confirmation failure shouldn't break the form. Logged for triage.
    const userContent = `
      <h1>Message received.</h1>
      <p>Thanks for reaching out, ${escape(name)}. We'll respond within <strong>${escape(route.ackWindow)}</strong>.</p>

      <div class="success-box">
        <h3>What you sent</h3>
        <p style="margin-bottom: 6px;"><strong>Topic:</strong> ${escape(route.label)}</p>
        <div style="font-size: 14px; color: inherit; white-space: pre-wrap;">${safeMessage}</div>
      </div>

      <p>If you need to add anything, just reply to this email — it goes to the same inbox.</p>
    `

    sendMail(
      email,
      `We got your ${route.label.toLowerCase()} message — AllowanceGuard`,
      userContent,
      undefined,
      { kind: 'marketing' },
    ).catch((err) => {
      console.error('[contact] confirmation email failed', err)
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] failed', err)
    return NextResponse.json(
      { error: 'Something went wrong sending your message. Please email support@allowanceguard.com directly.' },
      { status: 500 },
    )
  }
}
