import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { sendMail } from '@/lib/mailer'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  const { email, redirect = '/' } = await req.json().catch(() => ({}))
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const token = randomBytes(32).toString('hex')
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/api/auth/magic/verify?token=${token}&redirect=${encodeURIComponent(redirect)}`
  await pool.query(
    `INSERT INTO magic_links (email, token, purpose, meta, expires_at)
     VALUES ($1,$2,'signin',$3, NOW() + INTERVAL '20 minutes')`,
    [email.toLowerCase(), token, { redirect }]
  )
  const html = `<p>Sign in to Allowance Guard:</p><p><a href="${url}">Click here</a> (valid 20 minutes)</p>`
  await sendMail(email, 'Sign in — Allowance Guard', html)
  return NextResponse.json({ ok: true })
}
