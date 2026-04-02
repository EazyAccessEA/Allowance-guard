import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const result = await db.query(
      'SELECT id, email, is_active FROM alert_subscriptions WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email not found in our system', email, status: 'not_found' },
        { status: 404 }
      )
    }

    const subscription = result.rows[0]

    if (!subscription.is_active) {
      return NextResponse.json(
        { message: 'Email is already unsubscribed', email, status: 'already_unsubscribed' },
        { status: 200 }
      )
    }

    await db.query(
      'UPDATE alert_subscriptions SET is_active = false, updated_at = NOW() WHERE email = $1',
      [email]
    )

    return NextResponse.json(
      { message: 'Successfully unsubscribed from Allowance Guard alerts', email, status: 'unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, confirm } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (confirm !== true) {
      return NextResponse.json({ error: 'Confirmation required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const result = await db.query(
      'UPDATE alert_subscriptions SET is_active = false, updated_at = NOW() WHERE email = $1 RETURNING id',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Email not found in our system', email, status: 'not_found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully unsubscribed from Allowance Guard alerts', email, status: 'unsubscribed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
