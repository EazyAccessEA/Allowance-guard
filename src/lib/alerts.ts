import { pool } from '@/lib/db'
import { sendMail } from '@/lib/mailer'
import { getPolicy, applyPolicy } from '@/lib/policy'
import { sendSlack } from '@/lib/slack'

type AllowRow = {
  chain_id: number
  token_address: string
  spender_address: string
  standard: string
  allowance_type: string
  amount: string
  is_unlimited: boolean
  last_seen_block: string
  risk_flags: string[]
  risk_score: number
}

async function fetchRisky(wallet: string) {
  const { rows } = await pool.query<AllowRow>(
    `SELECT chain_id, token_address, spender_address, standard, allowance_type, amount, is_unlimited, last_seen_block, risk_flags, risk_score
     FROM allowances
     WHERE wallet_address = $1 AND (is_unlimited = true OR risk_score > 0 OR ARRAY['STALE']::text[] && risk_flags)
     ORDER BY is_unlimited DESC, amount::numeric DESC
     LIMIT 500`,
     [wallet]
  )
  return rows
}

async function fetchRiskRows(wallet: string) {
  const { rows } = await pool.query<AllowRow>(
    `SELECT chain_id, token_address, spender_address, standard, allowance_type, amount,
            is_unlimited, last_seen_block, risk_flags, risk_score
       FROM allowances
      WHERE wallet_address=$1
        AND (is_unlimited=true OR risk_score > 0 OR ARRAY['STALE']::text[] && risk_flags)
      ORDER BY is_unlimited DESC, amount::numeric DESC
      LIMIT 1000`,
    [wallet]
  )
  return rows
}

function renderHtml(wallet: string, rows: AllowRow[]) {
  const items = rows.map(r => `
    <tr>
      <td style="font-family:monospace; font-size:12px; padding:8px; border:1px solid #ddd">${r.token_address}</td>
      <td style="font-family:monospace; font-size:12px; padding:8px; border:1px solid #ddd">${r.spender_address}</td>
      <td style="padding:8px; border:1px solid #ddd">${r.standard}</td>
      <td style="padding:8px; border:1px solid #ddd">${r.allowance_type}</td>
      <td style="font-family:monospace; padding:8px; border:1px solid #ddd">${r.amount}</td>
      <td style="padding:8px; border:1px solid #ddd; color:${r.is_unlimited ? '#dc2626' : (r.risk_flags?.includes('STALE') ? '#d97706' : '#6b7280')}">${r.is_unlimited ? 'UNLIMITED' : (r.risk_flags?.includes('STALE') ? 'STALE' : '')}</td>
    </tr>`).join('')
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Allowance Guard - Daily Risk Summary</title>
    </head>
    <body style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0 0 8px; color: #1e40af; font-size: 24px;">Allowance Guard</h1>
        <h2 style="margin: 0 0 12px; color: #374151; font-size: 18px;">Daily Risk Summary</h2>
        <div style="margin: 0 0 12px; font-size: 14px; color: #6b7280;">
          Wallet: <span style="font-family: monospace; background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${wallet}</span>
        </div>
      </div>
      
      ${rows.length === 0 ? `
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #166534; font-size: 16px;">✅ No risky approvals detected in the last check.</p>
          <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">Your wallet appears to be secure.</p>
        </div>
      ` : `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px; color: #dc2626; font-size: 16px;">⚠️ ${rows.length} risky approval${rows.length > 1 ? 's' : ''} detected</h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Review and revoke these allowances to improve your security.</p>
        </div>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background: #f8fafc;">
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Token</th>
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Spender</th>
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Standard</th>
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Type</th>
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Amount</th>
                <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Risk</th>
              </tr>
            </thead>
            <tbody>
              ${items}
            </tbody>
          </table>
        </div>
      `}
      
      <div style="margin-top: 20px; padding: 16px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;">
        <h3 style="margin: 0 0 8px; color: #0369a1; font-size: 14px;">💡 Security Tips</h3>
        <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 13px;">
          <li>Revoke UNLIMITED approvals first - they pose the highest risk</li>
          <li>Review STALE approvals that haven't been used recently</li>
          <li>Only approve the minimum amount needed for transactions</li>
          <li>Regularly audit your token allowances</li>
        </ul>
      </div>
      
      <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          This email was sent by Allowance Guard. 
          <a href="https://allowanceguard.com" style="color: #2563eb; text-decoration: none;">Visit our website</a> to manage your subscriptions.
        </p>
      </div>
    </body>
    </html>
  `
}

export async function sendDailyDigests() {
  const subs = await pool.query(
    `SELECT email, wallet_address, risk_only FROM alert_subscriptions`
  )
  
  let total = 0
  let errors = 0
  
  for (const s of subs.rows as { email: string; wallet_address: string; risk_only: boolean }[]) {
    try {
      const w = (s.wallet_address as string).toLowerCase()
      const risky = await fetchRisky(w)
      
      // Skip if risk_only is true and no risky items found
      if (s.risk_only && risky.length === 0) continue

      const html = renderHtml(w, risky)
      const subject = risky.length
        ? `Allowance Guard — ${risky.length} risky approval${risky.length > 1 ? 's' : ''} detected`
        : `Allowance Guard — Daily summary (all clear)`
      
      await sendMail(s.email, subject, html)
      
      // Log the send
      await pool.query(
        `INSERT INTO alert_history (email, wallet_address, items_count) VALUES ($1, $2, $3)`,
        [s.email.toLowerCase(), w, risky.length]
      )
      
      total++
    } catch (error) {
      console.error(`Failed to send digest to ${s.email}:`, error)
      errors++
    }
  }
  
  return { sent: total, errors }
}

export async function sendSlackDigests() {
  const subs = await pool.query(`SELECT wallet_address, webhook_url, risk_only FROM slack_subscriptions`)
  let total = 0

  for (const s of subs.rows as any[]) {
    const wallet = (s.wallet_address as string).toLowerCase()
    const rows = await fetchRiskRows(wallet)
    const policy = await getPolicy(wallet)
    const filtered = applyPolicy(rows, policy)

    if (s.risk_only && filtered.length === 0) continue

    const text = filtered.length
      ? `Allowance Guard: ${filtered.length} risky approval${filtered.length>1?'s':''} for ${wallet}`
      : `Allowance Guard: Daily summary for ${wallet} (no risky approvals)`

    const blocks = [
      { type: 'section', text: { type: 'mrkdwn', text } },
      ...(filtered.slice(0, 20).map(r => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
`*${r.standard}* • chain ${r.chain_id}
*Token*: \`${r.token_address}\`
*Spender*: \`${r.spender_address}\`
*Type*: ${r.allowance_type} • *Amount*: ${r.amount}
*Badges*: ${r.is_unlimited ? 'UNLIMITED ' : ''}${r.risk_flags?.includes('STALE') ? 'STALE' : ''}  (score ${r.risk_score})`
        }
      })))
    ]

    await sendSlack(s.webhook_url, { text, blocks })
    total++
  }
  return { sent: total }
}
