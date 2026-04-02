/**
 * Cron endpoint for lifecycle emails.
 *
 * Designed to be called by Vercel Cron (or external scheduler) once per day.
 * Currently handles:
 * - Re-engagement emails: sent ~7 days after subscription cancellation
 *
 * Security: protected by CRON_SECRET or CRON_JOBS_API_KEY header.
 */
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { sendReEngagementEmail } from '@/lib/mailer'
import { secureLogger } from '@/lib/secure-logger'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  return handleCron(req)
}

export async function POST(req: NextRequest) {
  return handleCron(req)
}

async function handleCron(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET || process.env.CRON_JOBS_API_KEY
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find users who cancelled ~7 days ago and haven't received re-engagement email
    // Window: 6-8 days ago to handle cron timing variance
    const { rows: cancelledUsers } = await pool.query(
      `SELECT s.id, s.user_id, s.plan, s.stripe_subscription_id, u.email
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       WHERE s.status = 'canceled'
         AND s.re_engagement_email_sent = FALSE
         AND s.cancelled_at IS NOT NULL
         AND s.cancelled_at >= NOW() - INTERVAL '8 days'
         AND s.cancelled_at <= NOW() - INTERVAL '6 days'
         AND u.email IS NOT NULL
       LIMIT 50`,
    )

    let sent = 0
    const errors: Array<{ userId: number; error: string }> = []

    for (const user of cancelledUsers) {
      try {
        await sendReEngagementEmail(user.email as string, user.plan as string)

        await pool.query(
          `UPDATE subscriptions SET re_engagement_email_sent = TRUE WHERE id = $1`,
          [user.id],
        )

        sent++
        secureLogger.info('Re-engagement email sent', {
          userId: user.user_id,
          plan: user.plan,
        })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        errors.push({ userId: user.user_id as number, error: errorMsg })
        secureLogger.error('Re-engagement email failed', {
          userId: user.user_id,
          error: errorMsg,
        })
      }
    }

    secureLogger.info('Email cron completed', {
      eligible: cancelledUsers.length,
      sent,
      errors: errors.length,
    })

    return NextResponse.json({
      ok: true,
      reEngagement: {
        eligible: cancelledUsers.length,
        sent,
        errors: errors.length,
      },
    })
  } catch (error) {
    secureLogger.error('Email cron failed', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
