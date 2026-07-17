/**
 * Cron endpoint for rule evaluation.
 *
 * Evaluates all enabled revocation rules for Sentinel-tier users.
 * Called every 15 minutes via Vercel Cron (vercel.json), aligned with the
 * other crons so Neon compute wakes in one shared window — see
 * docs/ops-monitoring.md "Neon compute guardrails".
 */
import { NextRequest, NextResponse } from 'next/server'
import { evaluateRules, executeRuleMatches } from '@/lib/rule-engine'
import { dispatchWebhookEvent } from '@/lib/webhook-dispatcher'
import { secureLogger } from '@/lib/secure-logger'
import { pool } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  return handleEvaluate(req)
}

export async function POST(req: NextRequest) {
  return handleEvaluate(req)
}

async function handleEvaluate(_req: NextRequest) {
  try {
    // Find all Sentinel users with enabled rules (plan-gated)
    const { rows: sentinelUsers } = await pool.query(
      `SELECT DISTINCT rr.user_id
       FROM revocation_rules rr
       JOIN subscriptions s ON s.user_id = rr.user_id
       WHERE rr.enabled = TRUE
         AND s.status = 'active'
         AND s.plan IN ('sentinel', 'sentinel_yearly')
       LIMIT 100`,
    )

    if (sentinelUsers.length === 0) {
      return NextResponse.json({ ok: true, message: 'No Sentinel users with active rules', evaluated: 0 })
    }

    const results: Array<{ userId: number; matches: number; errors: number }> = []

    for (const row of sentinelUsers) {
      const userId = row.user_id as number
      try {
        const matches = await evaluateRules(userId)

        if (matches.length > 0) {
          await executeRuleMatches(matches)

          // Dispatch webhook events for triggered rules
          for (const match of matches) {
            await dispatchWebhookEvent(userId, 'rule.triggered', {
              ruleId: match.rule.id,
              ruleName: match.rule.name,
              action: match.rule.action,
              wallet: match.allowance.wallet_address,
              chainId: match.allowance.chain_id,
              tokenAddress: match.allowance.token_address,
              spenderAddress: match.allowance.spender_address,
            }).catch((err) =>
              secureLogger.error('Failed to dispatch rule.triggered webhook', { err }),
            )
          }
        }

        results.push({ userId, matches: matches.length, errors: 0 })
      } catch (err) {
        secureLogger.error('Rule evaluation failed for user', { userId, err })
        results.push({ userId, matches: 0, errors: 1 })
      }
    }

    const totalMatches = results.reduce((sum, r) => sum + r.matches, 0)
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0)

    secureLogger.info('Rule evaluation cron completed', {
      usersEvaluated: sentinelUsers.length,
      totalMatches,
      totalErrors,
    })

    return NextResponse.json({
      ok: true,
      usersEvaluated: sentinelUsers.length,
      totalMatches,
      totalErrors,
      details: results,
    })
  } catch (error) {
    secureLogger.error('Rule evaluation cron failed', { error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
