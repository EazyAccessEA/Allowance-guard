// src/app/api/contact/route.ts
//
// Public contact endpoint. Accepts a structured message from the
// /contact form, validates it, rate-limits per IP, and routes the
// email to the right inbox via Resend.
//
// Required env:
//   RESEND_API_KEY        — Resend API key (re_…)
//   CONTACT_FROM_EMAIL    — verified sender (e.g. "AllowanceGuard <noreply@allowanceguard.com>")
//
// Topics:
//   - support       -> support@allowanceguard.com
//   - security      -> security@allowanceguard.com
//   - partnerships  -> support@allowanceguard.com   (subject prefixed)
//   - press         -> support@allowanceguard.com   (subject prefixed)
//   - funding       -> support@allowanceguard.com   (subject prefixed)
//   - other         -> support@allowanceguard.com

import { NextResponse } from 'next/server'
import { headers as nextHeaders } from 'next/headers'
import { z } from 'zod'
import { limitOrThrow } from '@/lib/ratelimit'

export const runtime = 'nodejs'

const TOPIC_ROUTING: Record<
  string,
  { to: string; label: string }
> = {
  support:      { to: 'support@allowanceguard.com',  label: 'Support'      },
  security:     { to: 'security@allowanceguard.com', label: 'Security'     },
  partnerships: { to: 'support@allowanceguard.com',  label: 'Partnerships' },
  press:        { to: 'support@allowanceguard.com',  label: 'Press'        },
  funding:      { to: 'support@allowanceguard.com',  label: 'Funding'      },
  other:        { to: 'support@allowanceguard.com',  label: 'General'      },
}

const ContactSchema = z.object({
  name:    z.string().trim().min(1, 'Name is required').max(120),
  email:   z.string().trim().email('Valid email is required').max(254),
  topic:   z.enum(['support', 'security', 'partnerships', 'press', 'funding', 'other']),
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

async function sendViaResend(opts: {
  to: string
  replyTo: string
  subject: string
  html: string
  text: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM_EMAIL || 'AllowanceGuard <noreply@allowanceguard.com>'
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      reply_to: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Resend API error ${res.status}: ${body}`)
  }
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

    const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:32px">
    <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a">New ${escape(route.label)} message</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1e293b;margin-bottom:20px">
      <tr><td style="padding:6px 0;width:120px;color:#64748b">From</td><td style="padding:6px 0"><strong>${safeName}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Email</td><td style="padding:6px 0"><a href="mailto:${safeEmail}" style="color:#f59e0b;text-decoration:none">${safeEmail}</a></td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Topic</td><td style="padding:6px 0">${escape(route.label)}</td></tr>
      ${safeWallet ? `<tr><td style="padding:6px 0;color:#64748b">Wallet</td><td style="padding:6px 0;font-family:monospace;font-size:12px">${safeWallet}</td></tr>` : ''}
      <tr><td style="padding:6px 0;color:#64748b">IP</td><td style="padding:6px 0;font-family:monospace;font-size:12px">${safeIp}</td></tr>
    </table>
    <div style="padding:16px;background:#f8fafc;border-left:3px solid #f59e0b;border-radius:4px;font-size:14px;line-height:1.6;color:#0f172a;white-space:pre-wrap">${safeMessage}</div>
    <p style="margin-top:20px;font-size:12px;color:#94a3b8">Reply directly to this email to respond to ${safeName}.</p>
  </div>
</body></html>`

    const text = `New ${route.label} message from ${name} <${email}>${wallet ? `\nWallet: ${wallet}` : ''}\n\n${message}\n\n---\nIP: ${ip}`

    await sendViaResend({
      to: route.to,
      replyTo: email,
      subject,
      html,
      text,
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
