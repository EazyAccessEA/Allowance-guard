/**
 * Scan-job processor endpoint.
 *
 * Invoked two ways:
 * 1. ON-DEMAND — kicked by routes that enqueue a scan (lib/job-kick.ts),
 *    so jobs start within seconds of being queued.
 * 2. FALLBACK — Vercel Cron every 15 minutes (vercel.json), aligned with
 *    the other crons so Neon compute wakes in one shared window. This
 *    only matters when an on-demand kick was lost.
 *
 * Do NOT tighten the cron schedule below 15 minutes: a frequent poll keeps
 * the Neon endpoint awake around the clock and exhausts the compute
 * allowance. See docs/ops-monitoring.md "Neon compute guardrails".
 */
import { NextRequest, NextResponse } from 'next/server'
import { processPendingJobs } from '@/lib/job-runner'
import { kickJobProcessor } from '@/lib/job-kick'
import { apiLogger } from '@/lib/logger'
import { reportError } from '@/lib/rollbar'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest) {
  try {
    // Leave headroom under this function's 180s maxDuration (vercel.json)
    const result = await processPendingJobs({ deadlineMs: 150_000 })

    // Self-chain: if the deadline hit with CLAIMABLE work still queued, hand
    // the remainder to a fresh invocation with its own full time budget.
    // Bounded: a job that keeps failing is marked 'failed' once attempts >=
    // max_attempts (in finishJob, or in resetStuckJobs for jobs killed before
    // finishing), and `remaining` excludes jobs still in their retry cooldown,
    // so the chain drains and stops rather than spinning.
    if (result.remaining > 0) {
      apiLogger.info('jobs.process.chain', { remaining: result.remaining })
      kickJobProcessor()
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    reportError(error instanceof Error ? error : new Error(String(error)))
    apiLogger.error('Job processor error', { error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json({ error: 'Job processing failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req as NextRequest)
}
