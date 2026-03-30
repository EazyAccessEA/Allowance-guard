/**
 * Continuous Monitoring Service
 *
 * Core logic for scanning monitored wallets, detecting changes,
 * and dispatching alerts via email / Slack / Telegram.
 */
import { pool } from '@/lib/db'
import { enqueueScan } from '@/lib/jobs'
import { secureLogger } from '@/lib/secure-logger'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MonitoredWallet {
  id: string
  user_id: number
  wallet_address: string
  chains: number[]
  enabled: boolean
  freq_minutes: number
  last_scan_at: string | null
  last_change_at: string | null
  notify_channels: { email?: boolean; slack?: boolean; telegram?: boolean }
}

export interface MonitoringEvent {
  id: string
  monitor_id: string
  wallet_address: string
  chain_id: number
  event_type: 'new_approval' | 'approval_changed' | 'approval_removed' | 'risk_increased'
  payload: Record<string, unknown>
  notified: boolean
  acknowledged: boolean
  created_at: string
}

// ---------------------------------------------------------------------------
// Fetch due monitors
// ---------------------------------------------------------------------------

/**
 * Pick wallets that are enabled and due for a re-scan.
 * Respects the per-wallet freq_minutes setting.
 */
export async function getDueMonitors(limit = 25): Promise<MonitoredWallet[]> {
  const { rows } = await pool.query(
    `SELECT *
     FROM monitored_wallets
     WHERE enabled = TRUE
       AND (last_scan_at IS NULL
            OR (NOW() - last_scan_at) > (freq_minutes || ' minutes')::interval)
     ORDER BY last_scan_at NULLS FIRST
     LIMIT $1`,
    [limit],
  )
  return rows as MonitoredWallet[]
}

// ---------------------------------------------------------------------------
// Enqueue scans for due monitors
// ---------------------------------------------------------------------------

export async function enqueueMonitorScans(
  monitors: MonitoredWallet[],
): Promise<Array<{ walletAddress: string; jobId: number }>> {
  const queued: Array<{ walletAddress: string; jobId: number }> = []

  for (const m of monitors) {
    const chains: number[] = Array.isArray(m.chains) && m.chains.length > 0
      ? m.chains
      : [] // empty = use all enabled chains; the scan job resolver handles this

    const jobId = await enqueueScan(m.wallet_address, chains)
    queued.push({ walletAddress: m.wallet_address, jobId })

    // Mark last_scan_at so we don't re-enqueue on the next cron tick
    await pool.query(
      `UPDATE monitored_wallets SET last_scan_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [m.id],
    )
  }

  return queued
}

// ---------------------------------------------------------------------------
// Detect changes (compare current allowances to previous snapshot)
// ---------------------------------------------------------------------------

export async function detectChanges(
  walletAddress: string,
  monitorId: string,
): Promise<MonitoringEvent[]> {
  // Compare current allowances to the snapshot stored in monitoring_snapshots
  // New approvals = rows in allowances not in snapshot
  // Changed approvals = rows where amount differs
  // Removed approvals = rows in snapshot not in allowances

  const events: MonitoringEvent[] = []

  // Get current allowances
  const { rows: current } = await pool.query(
    `SELECT chain_id, token_address, spender_address, amount, is_unlimited, risk_score
     FROM allowances WHERE wallet_address = $1`,
    [walletAddress.toLowerCase()],
  )

  // Get previous snapshot
  const { rows: snapshot } = await pool.query(
    `SELECT chain_id, token_address, spender_address, amount, is_unlimited, risk_score
     FROM monitoring_snapshots WHERE wallet_address = $1`,
    [walletAddress.toLowerCase()],
  )

  const snapshotMap = new Map(
    snapshot.map((s: Record<string, unknown>) => [
      `${s.chain_id}:${s.token_address}:${s.spender_address}`,
      s,
    ]),
  )

  const currentMap = new Map(
    current.map((c: Record<string, unknown>) => [
      `${c.chain_id}:${c.token_address}:${c.spender_address}`,
      c,
    ]),
  )

  // Detect new approvals and changes
  for (const [key, row] of currentMap) {
    const prev = snapshotMap.get(key) as Record<string, unknown> | undefined
    const cur = row as Record<string, unknown>
    if (!prev) {
      events.push(makeEvent(monitorId, walletAddress, cur, 'new_approval'))
    } else if (prev.amount !== cur.amount || prev.is_unlimited !== cur.is_unlimited) {
      events.push(makeEvent(monitorId, walletAddress, cur, 'approval_changed'))
    } else if (
      typeof cur.risk_score === 'number' &&
      typeof prev.risk_score === 'number' &&
      cur.risk_score > prev.risk_score + 10
    ) {
      events.push(makeEvent(monitorId, walletAddress, cur, 'risk_increased'))
    }
  }

  // Detect removed approvals
  for (const [key] of snapshotMap) {
    if (!currentMap.has(key)) {
      const prev = snapshotMap.get(key) as Record<string, unknown>
      events.push(makeEvent(monitorId, walletAddress, prev, 'approval_removed'))
    }
  }

  // Persist events
  for (const evt of events) {
    await pool.query(
      `INSERT INTO monitoring_events (id, monitor_id, wallet_address, chain_id, event_type, payload, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [evt.monitor_id, evt.wallet_address, evt.chain_id, evt.event_type, JSON.stringify(evt.payload)],
    )
  }

  // Update snapshot to current state
  await pool.query(`DELETE FROM monitoring_snapshots WHERE wallet_address = $1`, [walletAddress.toLowerCase()])
  if (current.length > 0) {
    const values = current.map(
      (r: Record<string, unknown>, i: number) =>
        `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`,
    )
    const params = current.flatMap((r: Record<string, unknown>) => [
      walletAddress.toLowerCase(), r.chain_id, r.token_address, r.spender_address, r.amount, r.is_unlimited,
    ])
    await pool.query(
      `INSERT INTO monitoring_snapshots (wallet_address, chain_id, token_address, spender_address, amount, is_unlimited)
       VALUES ${values.join(', ')}`,
      params,
    )
  }

  // Update last_change_at if events detected
  if (events.length > 0) {
    await pool.query(
      `UPDATE monitored_wallets SET last_change_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [monitorId],
    )
  }

  return events
}

// ---------------------------------------------------------------------------
// Alert dispatch
// ---------------------------------------------------------------------------

export async function dispatchAlerts(
  events: MonitoringEvent[],
  channels: { email?: boolean; slack?: boolean; telegram?: boolean },
  walletAddress: string,
): Promise<void> {
  if (events.length === 0) return

  const summary = buildAlertSummary(events, walletAddress)

  if (channels.email) {
    await sendEmailAlert(walletAddress, summary).catch((err) =>
      secureLogger.error('Failed to send email alert', { err }),
    )
  }

  if (channels.slack) {
    await sendSlackAlert(walletAddress, summary).catch((err) =>
      secureLogger.error('Failed to send Slack alert', { err }),
    )
  }

  // Mark events as notified
  const ids = events.map((e) => e.id).filter(Boolean)
  if (ids.length > 0) {
    await pool.query(
      `UPDATE monitoring_events SET notified = TRUE WHERE id = ANY($1::uuid[])`,
      [ids],
    )
  }
}

// ---------------------------------------------------------------------------
// Alert helpers
// ---------------------------------------------------------------------------

interface AlertSummary {
  walletAddress: string
  newApprovals: number
  changedApprovals: number
  removedApprovals: number
  riskIncreases: number
  details: string[]
}

function buildAlertSummary(events: MonitoringEvent[], walletAddress: string): AlertSummary {
  const summary: AlertSummary = {
    walletAddress,
    newApprovals: 0,
    changedApprovals: 0,
    removedApprovals: 0,
    riskIncreases: 0,
    details: [],
  }

  for (const evt of events) {
    switch (evt.event_type) {
      case 'new_approval':
        summary.newApprovals++
        summary.details.push(`New approval on chain ${evt.chain_id}`)
        break
      case 'approval_changed':
        summary.changedApprovals++
        summary.details.push(`Approval changed on chain ${evt.chain_id}`)
        break
      case 'approval_removed':
        summary.removedApprovals++
        summary.details.push(`Approval removed on chain ${evt.chain_id}`)
        break
      case 'risk_increased':
        summary.riskIncreases++
        summary.details.push(`Risk increased on chain ${evt.chain_id}`)
        break
    }
  }

  return summary
}

async function sendEmailAlert(walletAddress: string, summary: AlertSummary): Promise<void> {
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN
  if (!postmarkToken) {
    secureLogger.warn('POSTMARK_SERVER_TOKEN not set, skipping email alert')
    return
  }

  // Look up user email from the monitor's user_id
  const { rows } = await pool.query(
    `SELECT u.email FROM users u
     JOIN monitored_wallets mw ON mw.user_id = u.id
     WHERE mw.wallet_address = $1 AND mw.enabled = TRUE
     LIMIT 1`,
    [walletAddress.toLowerCase()],
  )

  const email = rows[0]?.email
  if (!email) return

  const body = [
    `AllowanceGuard detected changes on wallet ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}:`,
    '',
    summary.newApprovals > 0 ? `• ${summary.newApprovals} new approval(s)` : null,
    summary.changedApprovals > 0 ? `• ${summary.changedApprovals} changed approval(s)` : null,
    summary.removedApprovals > 0 ? `• ${summary.removedApprovals} removed approval(s)` : null,
    summary.riskIncreases > 0 ? `• ${summary.riskIncreases} risk increase(s)` : null,
    '',
    'Review your wallet: https://www.allowanceguard.com',
  ].filter(Boolean).join('\n')

  await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': postmarkToken,
    },
    body: JSON.stringify({
      From: process.env.EMAIL_FROM ?? 'alerts@allowanceguard.com',
      To: email,
      Subject: `[AllowanceGuard] ${summary.newApprovals + summary.changedApprovals + summary.riskIncreases} change(s) detected`,
      TextBody: body,
    }),
  })
}

async function sendSlackAlert(walletAddress: string, summary: AlertSummary): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const text = [
    `🔔 *AllowanceGuard Monitor*`,
    `Wallet: \`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}\``,
    summary.newApprovals > 0 ? `• ${summary.newApprovals} new approval(s)` : null,
    summary.changedApprovals > 0 ? `• ${summary.changedApprovals} changed approval(s)` : null,
    summary.riskIncreases > 0 ? `• ${summary.riskIncreases} risk increase(s)` : null,
  ].filter(Boolean).join('\n')

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeEvent(
  monitorId: string,
  walletAddress: string,
  row: Record<string, unknown>,
  eventType: MonitoringEvent['event_type'],
): MonitoringEvent {
  return {
    id: '', // generated by DB
    monitor_id: monitorId,
    wallet_address: walletAddress,
    chain_id: row.chain_id as number,
    event_type: eventType,
    payload: {
      token_address: row.token_address,
      spender_address: row.spender_address,
      amount: row.amount,
      is_unlimited: row.is_unlimited,
      risk_score: row.risk_score,
    },
    notified: false,
    acknowledged: false,
    created_at: new Date().toISOString(),
  }
}

// ---------------------------------------------------------------------------
// User-facing queries
// ---------------------------------------------------------------------------

export async function getUserMonitors(userId: number): Promise<MonitoredWallet[]> {
  const { rows } = await pool.query(
    `SELECT * FROM monitored_wallets WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  )
  return rows as MonitoredWallet[]
}

export async function getMonitorEvents(
  walletAddress: string,
  limit = 50,
  offset = 0,
): Promise<{ events: MonitoringEvent[]; total: number }> {
  const [{ rows: events }, { rows: countRows }] = await Promise.all([
    pool.query(
      `SELECT * FROM monitoring_events
       WHERE wallet_address = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [walletAddress.toLowerCase(), limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*)::int AS count FROM monitoring_events WHERE wallet_address = $1`,
      [walletAddress.toLowerCase()],
    ),
  ])

  return {
    events: events as MonitoringEvent[],
    total: (countRows[0]?.count as number) ?? 0,
  }
}

export async function acknowledgeEvent(eventId: string): Promise<void> {
  await pool.query(
    `UPDATE monitoring_events SET acknowledged = TRUE WHERE id = $1`,
    [eventId],
  )
}
