import { pool } from '@/lib/db'
import { getPolicy, applyPolicy } from '@/lib/policy'
import { sendMail } from '@/lib/mailer'
import { sendSlack } from '@/lib/slack'

type AllowRow = {
  chain_id: number
  token_address: string
  spender_address: string
  allowance_type: 'per-token'|'all-assets'|string
  standard: string
  amount: string
  is_unlimited: boolean
  risk_score: number
  risk_flags: string[]
}

type Drift = AllowRow & { prev_amount: string, prev_unlimited: boolean }

async function listCurrent(wallet: string): Promise<AllowRow[]> {
  const { rows } = await pool.query<AllowRow>(
    `SELECT chain_id, token_address, spender_address, allowance_type, amount, is_unlimited, risk_score, risk_flags
       FROM allowances WHERE wallet_address=$1`,
    [wallet]
  )
  return rows
}

async function loadAlertState(wallet: string) {
  const { rows } = await pool.query(
    `SELECT chain_id, token_address, spender_address, allowance_type, last_amount, last_unlimited
       FROM alert_state WHERE wallet_address=$1`,
    [wallet]
  )
  const m = new Map<string, {amt:string; unlim:boolean}>()
  for (const r of rows) {
    const key = `${r.chain_id}:${r.token_address}:${r.spender_address}:${r.allowance_type}`
    m.set(key, { amt: String(r.last_amount), unlim: !!r.last_unlimited })
  }
  return m
}

function keyOf(r: AllowRow) {
  return `${r.chain_id}:${r.token_address}:${r.spender_address}:${r.allowance_type}`
}

function computeDrift(rows: AllowRow[], prev: Map<string,{amt:string; unlim:boolean}>) {
  const out: Drift[] = []
  for (const r of rows) {
    const p = prev.get(keyOf(r))
    const nowAmt = r.amount
    const nowUnl = !!r.is_unlimited
    const prevAmt = p?.amt ?? '0'
    const prevUnl = p?.unlim ?? false

    const becameUnlimited = nowUnl && !prevUnl
    const grewFromZero = BigInt(prevAmt) === BigInt(0) && BigInt(nowAmt) > BigInt(0)
    const newEntry = !p && (BigInt(nowAmt) > BigInt(0) || nowUnl)

    if (becameUnlimited || grewFromZero || newEntry) {
      out.push({ ...r, prev_amount: prevAmt, prev_unlimited: prevUnl })
    }
  }
  return out
}

async function updateAlertState(wallet: string, drifts: Drift[]) {
  if (!drifts.length) return
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    for (const d of drifts) {
      await client.query(
        `INSERT INTO alert_state (wallet_address, chain_id, token_address, spender_address, allowance_type, last_amount, last_unlimited, last_notified_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
         ON CONFLICT (wallet_address,chain_id,token_address,spender_address,allowance_type)
         DO UPDATE SET last_amount=$6, last_unlimited=$7, last_notified_at=NOW()`,
        [wallet, d.chain_id, d.token_address, d.spender_address, d.allowance_type, d.amount, d.is_unlimited]
      )
    }
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK'); throw e
  } finally {
    client.release()
  }
}

function renderEmail(wallet: string, items: Drift[]) {
  const rows = items.map(i => `
    <tr>
      <td style="font-family:monospace">${i.token_address}</td>
      <td style="font-family:monospace">${i.spender_address}</td>
      <td>${i.allowance_type}</td>
      <td>${i.prev_unlimited ? '∞' : i.prev_amount}</td>
      <td>→</td>
      <td>${i.is_unlimited ? 'UNLIMITED' : i.amount}</td>
    </tr>`).join('')
  return `
    <div style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial">
      <h3 style="margin:0 0 8px">Allowance drift detected</h3>
      <div style="font-size:14px;margin-bottom:8px">Wallet: <span style="font-family:monospace">${wallet}</span></div>
      <table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;font-size:13px">
        <thead><tr><th>Token</th><th>Spender</th><th>Type</th><th>Prev</th><th></th><th>Now</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="font-size:12px;color:#666">Tip: Revoke UNLIMITED approvals immediately.</p>
    </div>
  `
}

function renderSlackText(wallet: string, n: number) {
  return `*Allowance Guard*: detected ${n} approval change${n>1?'s':''} on \`${wallet}\``
}

export async function driftCheckAndNotify(wallet: string) {
  wallet = wallet.toLowerCase()

  // Current allowances
  const rows = await listCurrent(wallet)

  // Apply per-wallet policy
  const policy = await getPolicy(wallet)
  const filtered = applyPolicy(
    rows.map(r => ({
      chain_id: r.chain_id,
      token_address: r.token_address,
      spender_address: r.spender_address,
      risk_score: r.risk_score,
      standard: r.standard,
      is_unlimited: r.is_unlimited
    })) as AllowRow[],
    policy
  )
  const allowSet = new Set(filtered.map((r: AllowRow)=>`${r.chain_id}:${r.token_address}:${r.spender_address}`))
  const rowsForPolicy = rows.filter(r => allowSet.has(`${r.chain_id}:${r.token_address}:${r.spender_address}`))

  // Compute drift against last notified state
  const prev = await loadAlertState(wallet)
  const drifts = computeDrift(rowsForPolicy, prev)
  if (!drifts.length) return { notified: 0 }

  // Destinations
  const [emailsQ, hooksQ] = await Promise.all([
    pool.query(`SELECT email, risk_only FROM alert_subscriptions WHERE wallet_address=$1`, [wallet]),
    pool.query(`SELECT webhook_url, risk_only FROM slack_subscriptions WHERE wallet_address=$1`, [wallet])
  ])

  // Email
  const html = renderEmail(wallet, drifts)
  const emailSubs = emailsQ.rows as Array<{email: string, risk_only: boolean}>
  for (const s of emailSubs) {
    if (s.risk_only && drifts.length === 0) continue
    await sendMail(s.email, 'Allowance Guard — Drift detected', html)
  }

  // Slack
  const text = renderSlackText(wallet, drifts.length)
  const blocks = [
    { type: 'section', text: { type: 'mrkdwn', text } },
    ...drifts.slice(0, 20).map(d => ({
      type: 'section',
      text: { type:'mrkdwn', text:
`*Chain* ${d.chain_id}  *Type* ${d.allowance_type}
*Token* \`${d.token_address}\`
*Spender* \`${d.spender_address}\`
*Prev* ${d.prev_unlimited ? 'UNLIMITED' : d.prev_amount} → *Now* ${d.is_unlimited ? 'UNLIMITED' : d.amount}` }
    }))
  ]
  const slackSubs = hooksQ.rows as Array<{webhook_url: string, risk_only: boolean}>
  for (const s of slackSubs) {
    if (s.risk_only && drifts.length === 0) continue
    await sendSlack(s.webhook_url, { text, blocks })
  }

  // Remember what we alerted
  await updateAlertState(wallet, drifts)

  return { notified: drifts.length }
}
