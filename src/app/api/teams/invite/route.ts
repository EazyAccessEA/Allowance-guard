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
  const content = `
    <h1>Team invitation</h1>
    <p>You've been invited to join a team on AllowanceGuard with <strong>${role}</strong> permissions.</p>

    <div class="success-box">
      <h3>Your role: ${role.charAt(0).toUpperCase() + role.slice(1)}</h3>
      <ul style="margin-bottom: 0;">
        ${role === 'owner' ? '<li>Full control over the team and all settings</li>' : ''}
        ${role === 'admin' ? '<li>Manage team members and invite users</li>' : ''}
        ${role === 'editor' ? '<li>Add wallets and revoke approvals</li>' : ''}
        ${role === 'viewer' ? '<li>View team dashboards and approval data</li>' : ''}
        <li>Access shared wallet monitoring and alerts</li>
      </ul>
    </div>

    <p><a href="${url}" class="button">Accept invitation</a></p>

    <p><strong>This invitation expires in 7 days.</strong> If you don't recognise it, ignore this email.</p>

    <p>If the button doesn't work, copy this link:</p>
    <div class="address">${url}</div>
  `
  await sendMail(email, 'Team invitation — AllowanceGuard', content, undefined, {
    kind: 'operational',
  })
  return NextResponse.json({ ok: true })
}
