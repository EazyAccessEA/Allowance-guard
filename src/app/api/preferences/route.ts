import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const email = session.email

    const result = await db.query(
      'SELECT id, email, is_active, daily_digest, risk_alerts, created_at, updated_at FROM alert_subscriptions WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email not found in our system', email, status: 'not_found' },
        { status: 404 }
      )
    }

    const subscription = result.rows[0]

    return NextResponse.json({
      email: subscription.email,
      is_active: subscription.is_active,
      daily_digest: subscription.daily_digest,
      risk_alerts: subscription.risk_alerts,
      created_at: subscription.created_at,
      updated_at: subscription.updated_at,
      status: 'found'
    })
  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { daily_digest, risk_alerts, is_active } = body
    const email = session.email

    const result = await db.query(
      `UPDATE alert_subscriptions
       SET is_active = COALESCE($2, is_active),
           daily_digest = COALESCE($3, daily_digest),
           risk_alerts = COALESCE($4, risk_alerts),
           updated_at = NOW()
       WHERE email = $1
       RETURNING id, email, is_active, daily_digest, risk_alerts, updated_at`,
      [email, is_active, daily_digest, risk_alerts]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email not found in our system', email, status: 'not_found' },
        { status: 404 }
      )
    }

    const subscription = result.rows[0]

    return NextResponse.json({
      message: 'Preferences updated successfully',
      email: subscription.email,
      is_active: subscription.is_active,
      daily_digest: subscription.daily_digest,
      risk_alerts: subscription.risk_alerts,
      updated_at: subscription.updated_at,
      status: 'updated'
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
