import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { requireUser } from '@/lib/auth'
import { randomBytes } from 'crypto'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  const s = await requireUser()
  const { teamId, email, role = 'viewer' } = await req.json().catch(() => ({}))
  if (!teamId || !email) return NextResponse.json({ error: 'Missing' }, { status: 400 })
  // Only owner/admin can invite; editors can invite viewers (your choice). We'll allow owner/admin/editor.
  const mem = await pool.query(`SELECT role FROM team_members WHERE team_id=$1 AND user_id=$2`, [teamId, s.user_id])
  const myRole = mem.rows[0]?.role as string | undefined
  if (!myRole || !['owner','admin','editor'].includes(myRole)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const token = randomBytes(32).toString('hex')
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/invite/${token}`
  await pool.query(
    `INSERT INTO team_invites (team_id, email, role, token, invited_by, expires_at)
     VALUES ($1,$2,$3,$4,$5,NOW() + INTERVAL '7 days')`,
    [teamId, email.toLowerCase(), role, token, s.user_id]
  )
  const html = `<p>You've been invited to join a team on Allowance Guard as <b>${role}</b>.</p>
                <p><a href="${url}">Accept invite</a> (valid 7 days)</p>`
  await sendMail(email, 'Allowance Guard — Team invite', html)
  return NextResponse.json({ ok: true })
}
