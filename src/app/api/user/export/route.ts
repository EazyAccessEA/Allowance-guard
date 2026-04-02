import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { pool } from '@/lib/db'
import { auditUser } from '@/lib/audit'

/**
 * GET /api/user/export
 * GDPR Article 20 — Right to Data Portability
 * Exports all personal data associated with the authenticated user as JSON.
 */
export async function GET(req: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user_id as number

  try {
    // Gather all user data in parallel
    const [
      profileResult,
      subscriptionsResult,
      apiKeysResult,
      monitoredWalletsResult,
      monitoringEventsResult,
      walletEventsResult,
      riskSnapshotsResult,
      revocationRulesResult,
      ruleExecutionsResult,
      webhooksResult,
      usageRecordsResult,
      auditLogsResult,
      teamMembershipsResult,
      teamActivityResult,
      sessionsResult,
    ] = await Promise.all([
      // Profile
      pool.query(
        `SELECT id, email, name, created_at FROM users WHERE id = $1`,
        [userId],
      ),
      // Subscriptions
      pool.query(
        `SELECT id, plan, status, stripe_customer_id, stripe_subscription_id,
                current_period_start, current_period_end, cancel_at_period_end,
                created_at, updated_at
         FROM subscriptions WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      ),
      // API keys (exclude hash for security)
      pool.query(
        `SELECT id, prefix, name, plan, rate_limit, last_used_at, expires_at,
                revoked_at, created_at
         FROM api_keys WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      ),
      // Monitored wallets
      pool.query(
        `SELECT id, wallet_address, chains, enabled, freq_minutes,
                last_scan_at, last_change_at, notify_channels, created_at, updated_at
         FROM monitored_wallets WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      ),
      // Monitoring events (last 90 days)
      pool.query(
        `SELECT me.id, me.wallet_address, me.chain_id, me.event_type,
                me.payload, me.notified, me.acknowledged, me.created_at
         FROM monitoring_events me
         JOIN monitored_wallets mw ON mw.id = me.monitor_id
         WHERE mw.user_id = $1 AND me.created_at > NOW() - INTERVAL '90 days'
         ORDER BY me.created_at DESC
         LIMIT 1000`,
        [userId],
      ),
      // Wallet events (last 90 days)
      pool.query(
        `SELECT id, wallet_address, chain_id, token_address, spender_address,
                event_type, previous_amount, new_amount, risk_score, tx_hash,
                token_symbol, spender_label, created_at
         FROM wallet_events
         WHERE wallet_address IN (
           SELECT wallet_address FROM monitored_wallets WHERE user_id = $1
         ) AND created_at > NOW() - INTERVAL '90 days'
         ORDER BY created_at DESC
         LIMIT 1000`,
        [userId],
      ),
      // Risk snapshots (last 90 days)
      pool.query(
        `SELECT id, wallet_address, risk_score, total_allowances,
                unlimited_count, high_risk_count, chain_breakdown, snapshot_at
         FROM risk_snapshots
         WHERE wallet_address IN (
           SELECT wallet_address FROM monitored_wallets WHERE user_id = $1
         ) AND snapshot_at > NOW() - INTERVAL '90 days'
         ORDER BY snapshot_at DESC
         LIMIT 500`,
        [userId],
      ),
      // Revocation rules
      pool.query(
        `SELECT id, name, description, enabled, wallets, chains, conditions,
                action, max_executions_per_day, trigger_count, last_triggered_at,
                created_at, updated_at
         FROM revocation_rules WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      ),
      // Rule executions (last 90 days)
      pool.query(
        `SELECT re.id, re.rule_id, re.wallet_address, re.chain_id,
                re.token_address, re.spender_address, re.action, re.success,
                re.tx_hash, re.created_at
         FROM rule_executions re
         WHERE re.user_id = $1 AND re.created_at > NOW() - INTERVAL '90 days'
         ORDER BY re.created_at DESC
         LIMIT 500`,
        [userId],
      ),
      // Webhooks (exclude secrets)
      pool.query(
        `SELECT id, name, url, events, enabled, last_triggered_at,
                failure_count, created_at, updated_at
         FROM webhooks WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      ),
      // Usage records (last 90 days)
      pool.query(
        `SELECT id, endpoint, method, response_status, duration_ms,
                timestamp
         FROM usage_records WHERE user_id = $1
         AND timestamp > NOW() - INTERVAL '90 days'
         ORDER BY timestamp DESC
         LIMIT 2000`,
        [userId],
      ),
      // Audit logs (last 90 days, own actions)
      pool.query(
        `SELECT id, at, action, subject, path, created_at
         FROM audit_logs WHERE actor_id = $1
         AND created_at > NOW() - INTERVAL '90 days'
         ORDER BY created_at DESC
         LIMIT 1000`,
        [String(userId)],
      ),
      // Team memberships
      pool.query(
        `SELECT tm.team_id, t.name as team_name, tm.role, tm.created_at
         FROM team_members tm
         JOIN teams t ON t.id = tm.team_id
         WHERE tm.user_id = $1
         ORDER BY tm.created_at DESC`,
        [userId],
      ),
      // Team activity (last 90 days)
      pool.query(
        `SELECT id, team_id, action, subject, details, created_at
         FROM team_activity WHERE user_id = $1
         AND created_at > NOW() - INTERVAL '90 days'
         ORDER BY created_at DESC
         LIMIT 500`,
        [userId],
      ),
      // Active sessions (count only, no tokens)
      pool.query(
        `SELECT COUNT(*) as session_count FROM sessions
         WHERE user_id = $1 AND expires_at > NOW()`,
        [userId],
      ),
    ])

    const exportData = {
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0',
      userId: userId,
      profile: profileResult.rows[0] || null,
      subscriptions: subscriptionsResult.rows,
      apiKeys: apiKeysResult.rows,
      monitoredWallets: monitoredWalletsResult.rows,
      monitoringEvents: monitoringEventsResult.rows,
      walletEvents: walletEventsResult.rows,
      riskSnapshots: riskSnapshotsResult.rows,
      revocationRules: revocationRulesResult.rows,
      ruleExecutions: ruleExecutionsResult.rows,
      webhooks: webhooksResult.rows,
      usageRecords: usageRecordsResult.rows,
      auditLogs: auditLogsResult.rows,
      teamMemberships: teamMembershipsResult.rows,
      teamActivity: teamActivityResult.rows,
      activeSessions: Number(sessionsResult.rows[0]?.session_count ?? 0),
    }

    // Log the export for audit
    await auditUser(
      'gdpr.data_export',
      userId,
      `user:${userId}`,
      { exportVersion: '1.0' },
      req.headers.get('x-forwarded-for'),
      '/api/user/export',
    )

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="allowanceguard-data-export-${userId}-${Date.now()}.json"`,
        'X-Export-Version': '1.0',
      },
    })
  } catch (error) {
    console.error('Data export failed:', error)
    return NextResponse.json(
      { error: 'Failed to export data. Please try again or contact support.' },
      { status: 500 },
    )
  }
}
