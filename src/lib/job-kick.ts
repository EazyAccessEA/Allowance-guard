// lib/job-kick.ts — on-demand trigger for the scan-job processor.
//
// Why this exists: Neon bills compute for every minute the endpoint is
// awake and autosuspends after 5 idle minutes. Polling the queue on a
// 1-minute cron kept the database awake 24/7 (~180 CU-hours/month against
// a 100 CU-hour free allowance). Instead, routes that enqueue a job call
// kickJobProcessor() and the cron in vercel.json is only a 15-minute
// fallback — so the database sleeps whenever there is no real work.
// See docs/ops-monitoring.md "Neon compute guardrails".
import { after } from 'next/server'
import { apiLogger } from '@/lib/logger'

/**
 * Fire-and-forget trigger of POST /api/jobs/process.
 *
 * Runs via after() so the caller's response is never delayed. Self-fetching
 * (rather than processing in-process) gives the work the dedicated
 * jobs/process function budget (maxDuration 180s) instead of the enqueuing
 * route's 60s. The 30s abort only stops THIS function from waiting on the
 * response — once the request has reached Vercel, the jobs/process
 * invocation runs to completion regardless. If the kick is lost entirely
 * (network failure, missing env), the fallback cron picks the job up
 * within 15 minutes.
 */
export function kickJobProcessor(): void {
  try {
    after(async () => {
      const base = process.env.NEXT_PUBLIC_APP_URL
      if (!base) return
      try {
        await fetch(`${base}/api/jobs/process`, {
          method: 'POST',
          cache: 'no-store',
          signal: AbortSignal.timeout(30_000),
        })
      } catch (e) {
        // Timeout here is expected when the queue has long jobs; anything
        // unprocessed is covered by the fallback cron.
        if (!(e instanceof Error && e.name === 'TimeoutError')) {
          apiLogger.warn('jobs.kick.failed', { error: e instanceof Error ? e.message : String(e) })
        }
      }
    })
  } catch {
    // after() throws outside a request scope (unit tests, scripts). The
    // kick is best-effort — the fallback cron picks the job up instead.
  }
}
