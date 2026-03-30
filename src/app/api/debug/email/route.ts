import { NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const { to, subject = 'Test from Allowance Guard', html = '<p>Hello from Postmark ✅</p>' } =
    await req.json().catch(() => ({}))
  if (!to) return NextResponse.json({ error: 'Missing "to"' }, { status: 400 })
  const r = await sendMail(to, subject, html)
  return NextResponse.json(r, { status: r.ok ? 200 : 500 })
}
