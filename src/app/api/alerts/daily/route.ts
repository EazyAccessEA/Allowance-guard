import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { alertSlack, alertEmail, fmtBlock } from '@/lib/ops_alert'
import { readToday } from '@/lib/metrics'
import { sendDailyDigests, sendSlackDigests } from '@/lib/alerts'

export const runtime = 'nodejs'

function gb(n: number){ return n / (1024*1024*1024) }

export async function GET() {
  try {
    // 1. Send user digests (original functionality)
    const emailResult = await sendDailyDigests()
    const slackResult = await sendSlackDigests()

    // 2. Generate ops report
    const db = await pool.query(`SELECT pg_database_size(current_database()) AS bytes`)
    const dbBytes = Number(db.rows[0].bytes)
    const warnDb = Number(process.env.OPS_DB_WARN_GB || '1')

    // usage today (from Redis counters)
    const today = await readToday()
    const rpcTotal = Object.values(today.rpc).reduce((a,b)=>a+b,0)
    const emailTotal = today.email

    // thresholds
    const rpcWarn = Number(process.env.OPS_RPC_WARN_DAY || '75000')
    const emailWarn = Number(process.env.OPS_EMAIL_WARN_DAY || '500')

    const summary = {
      db_gb: gb(dbBytes).toFixed(2),
      rpc_counts: today.rpc,
      rpc_total: rpcTotal,
      emails_sent: emailTotal,
      scans: today.scan,
      thresholds: { db_gb_warn: warnDb, rpc_warn_day: rpcWarn, email_warn_day: emailWarn },
      user_digests: {
        email: emailResult,
        slack: slackResult
      },
      timestamp: new Date().toISOString()
    }

    const lines = [
      '📊 Daily Ops Report — Allowance Guard',
      `• DB size: ${gb(dbBytes).toFixed(2)} GB`,
      `• RPC today: ${rpcTotal} (by chain: ${Object.entries(today.rpc).map(([c,v])=>`${c}:${v}`).join(', ') || 'none'})`,
      `• Emails today: ${emailTotal}`,
      `• Scans today: ${today.scan}`,
      `• User digests: ${emailResult.sent} emails, ${slackResult.sent} Slack`
    ]
    
    // Send alerts in parallel
    await Promise.all([
      alertSlack(lines.join('\n') + '\n' + fmtBlock(summary)),
      alertEmail('Daily Ops Report — Allowance Guard', `<pre>${JSON.stringify(summary, null, 2)}</pre>`)
    ])

    // soft warnings
    if (gb(dbBytes) > warnDb || rpcTotal > rpcWarn || emailTotal > emailWarn) {
      await alertSlack('⚠️ Threshold exceeded')
    }

    return NextResponse.json({ 
      ok: true, 
      message: `Sent ${emailResult.sent} email digests and ${slackResult.sent} Slack digests`,
      email: emailResult,
      slack: slackResult,
      ops: summary
    })
    
  } catch (error) {
    console.error('Daily alert failed:', error)
    
    const errorMsg = {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
    
    // Try to alert about the failure
    await Promise.all([
      alertSlack(`🚨 Daily alert failed: ${errorMsg.error}`),
      alertEmail('Daily alert failed', `<pre>${JSON.stringify(errorMsg, null, 2)}</pre>`)
    ])
    
    return NextResponse.json(errorMsg, { status: 500 })
  }
}