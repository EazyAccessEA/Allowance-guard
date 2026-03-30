import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get subscription preferences
    const client = await db.connect()
    try {
      const result = await client.query(
        'SELECT id, email, is_active, daily_digest, risk_alerts, created_at, updated_at FROM alert_subscriptions WHERE email = $1',
        [email]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { 
            message: 'Email not found in our system',
            email: email,
            status: 'not_found'
          },
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

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Get preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, daily_digest, risk_alerts, is_active } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Update subscription preferences
    const client = await db.connect()
    try {
      const result = await client.query(
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
          { 
            message: 'Email not found in our system',
            email: email,
            status: 'not_found'
          },
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

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Update preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
