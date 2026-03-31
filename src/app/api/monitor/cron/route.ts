/**
 * Cron endpoint for continuous monitoring.
 *
 * Designed to be called by Vercel Cron (or external scheduler) every ~15 minutes.
 * Picks wallets due for re-scan, enqueues scan jobs, then runs change detection
 * and dispatches alerts for any completed scans.
 *
 * Security: protected by CRON_SECRET or CRON_JOBS_API_KEY header.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getDueMonitors, enqueueMonitorScans, detectChanges, dispatchAlerts } from '@/lib/monitoring'
import { secureLogger } from '@/lib/secure-logger'

export const runtime = 'nodejs'
export const maxDuration = 60 // seconds

export async function GET(req: NextRequest) {
  return handleCron(req)
}

export async function POST(req: NextRequest) {
  return handleCron(req)
}

async function handleCron(req: NextRequest) {
  // Verify cron secret — fail CLOSED if not configured
  // Supports both CRON_SECRET and CRON_JOBS_API_KEY for backwards compatibility
  const cronSecret = process.env.CRON_SECRET || process.env.CRON_JOBS_API_KEY
  if (!cronSecret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Find wallets due for re-scan
    const dueMonitors = await getDueMonitors(25)

    if (dueMonitors.length === 0) {
      return NextResponse.json({ ok: true, message: 'No wallets due for scan', queued: 0 })
    }

    // 2. Enqueue scan jobs
    const queued = await enqueueMonitorScans(dueMonitors)

    // 3. Run change detection on recently completed scans
    //    (wallets whose last scan completed since the last cron run)
    const alertResults: Array<{ wallet: string; eventsDetected: number }> = []

    for (const monitor of dueMonitors) {
      try {
        const events = await detectChanges(monitor.wallet_address, monitor.id)
        if (events.length > 0) {
          await dispatchAlerts(
            events,
            monitor.notify_channels as { email?: boolean; slack?: boolean; telegram?: boolean },
            monitor.wallet_address,
          )
          alertResults.push({ wallet: monitor.wallet_address, eventsDetected: events.length })
        }
      } catch (err) {
        secureLogger.error('Change detection failed for wallet', {
          wallet: monitor.wallet_address,
          err,
        })
      }
    }

    secureLogger.info('Monitoring cron completed', {
      scanned: queued.length,
      alertsSent: alertResults.length,
    })

    return NextResponse.json({
      ok: true,
      queued: queued.length,
      alerts: alertResults,
    })
  } catch (error) {
    secureLogger.error('Monitoring cron failed', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
