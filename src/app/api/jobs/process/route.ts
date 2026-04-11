import { NextRequest, NextResponse } from 'next/server'
import { claimPending, finishJob, JobRow } from '@/lib/jobs'
import { scanWalletOnChain } from '@/lib/scanner'
import { apiLogger } from '@/lib/logger'
import { refreshRiskForWallet } from '@/lib/risk'
import { enrichWallet } from '@/lib/enrich'
import { driftCheckAndNotify } from '@/lib/drift'
import { pool } from '@/lib/db'
import { withTimeout } from '@/lib/retry'
import { cacheDel } from '@/lib/cache'
import { reportError } from '@/lib/rollbar'

async function handle(job: JobRow) {
  if (job.type !== 'scan_wallet') throw new Error(`Unknown job type: ${job.type}`)
  const { wallet, chains } = job.payload as { wallet: string; chains: number[] }

  apiLogger.info('Processing scan job', { jobId: job.id, wallet, chainCount: chains.length })

  // Process chains sequentially. Per-chain failures are NON-FATAL —
  // one broken RPC must not kill a 27-chain scan. Partial results
  // are better than no results. (#3 Web3 council, #15 Architect)
  const failed: { chainId: number; error: string }[] = []
  let scanned = 0

  for (const chainId of chains) {
    try {
      await withTimeout(
        scanWalletOnChain(wallet, chainId as Parameters<typeof scanWalletOnChain>[1]),
        15_000 // 15s per chain — skip slow RPCs fast; function has 180s total
      )
      scanned++
    } catch (e) {
      const msg = e instanceof Error ? e.message.slice(0, 200) : String(e)
      apiLogger.warn('chain.scan.failed', { jobId: job.id, chainId, error: msg })
      failed.push({ chainId, error: msg })
    }
  }

  apiLogger.info('chain.scan.summary', {
    jobId: job.id, wallet, scanned, failed: failed.length, total: chains.length
  })

  // Post-scan: risk, enrich, drift — run even on partial results
  try {
    await refreshRiskForWallet(wallet)
    await enrichWallet(wallet)
    await driftCheckAndNotify(wallet)
  } catch (e) {
    apiLogger.warn('post-scan.failed', { jobId: job.id, error: e instanceof Error ? e.message : String(e) })
  }

  // Update monitor's last_scan_at if it exists
  await pool.query(
    `UPDATE wallet_monitors SET last_scan_at=NOW(), updated_at=NOW()
     WHERE wallet_address=$1`,
    [wallet.toLowerCase()]
  )

  // Invalidate cache after scan → risk → enrich operations
  await cacheDel(`allow:${wallet.toLowerCase()}:*`)

  // If ALL chains failed, throw so the job is marked failed
  if (scanned === 0 && failed.length > 0) {
    throw new Error(`All ${failed.length} chains failed. First: ${failed[0].error}`)
  }

  apiLogger.info('Scan job completed', {
    jobId: job.id, wallet, scanned, failed: failed.length
  })
}

/**
 * Reset jobs stuck in 'running' for more than 3 minutes.
 * These are jobs where the function timed out before finishJob ran.
 */
async function resetStuckJobs() {
  const { rows } = await pool.query(
    `UPDATE jobs SET status='pending'::job_status, started_at=NULL, updated_at=NOW()
     WHERE status='running'::job_status AND started_at < NOW() - INTERVAL '3 minutes'
     RETURNING id`
  )
  if (rows.length > 0) {
    apiLogger.info('reset.stuck.jobs', { count: rows.length, ids: rows.map((r: Record<string, unknown>) => r.id) })
  }
}

export async function POST(_req: NextRequest) {
  try {
    // Reset jobs stuck in 'running' from previous timed-out invocations
    await resetStuckJobs()

    // Debug: count pending jobs so we can see if the queue has work
    const { rows: debugRows } = await pool.query(
      `SELECT COUNT(*)::int as cnt FROM jobs WHERE status='pending'::job_status`
    )
    const pendingCount = debugRows[0]?.cnt ?? 0
    apiLogger.info('jobs.process.start', { pendingCount })

    const jobs = await claimPending(1) // one job at a time — each scans 27 chains
    let done = 0
    
    for (const j of jobs) {
      try { 
        await handle(j)
        await finishJob(j.id, true)
        done++
        apiLogger.info('Job succeeded', { jobId: j.id })
      } catch (e: unknown) { 
        const errorMessage = e instanceof Error ? e.message : String(e)
        reportError(e instanceof Error ? e : new Error(String(e)), { jobId: j.id })
        await finishJob(j.id, false, errorMessage)
        apiLogger.error('Job failed', { jobId: j.id, error: errorMessage })
      }
    }
    
    return NextResponse.json({ ok: true, pending: pendingCount, claimed: jobs.length, processed: done })
  } catch (error) {
    reportError(error instanceof Error ? error : new Error(String(error)))
    apiLogger.error('Job processor error', { error: error instanceof Error ? error.message : 'Unknown error' })
    return NextResponse.json({ error: 'Job processing failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req as NextRequest)
}
