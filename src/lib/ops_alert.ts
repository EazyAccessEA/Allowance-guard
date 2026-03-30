import { sendMail } from '@/lib/mailer'

export async function alertSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL
  if (!url) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack alert')
    return
  }
  
  try {
    const response = await fetch(url, { 
      method:'POST', 
      headers:{'content-type':'application/json'}, 
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!response.ok) {
      console.error('Slack webhook failed:', response.status, response.statusText)
    }
  } catch (error) {
    console.error('Slack alert failed:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function alertEmail(subject: string, html: string) {
  const to = process.env.OPS_ALERT_EMAIL
  if (!to) {
    console.warn('OPS_ALERT_EMAIL not configured, skipping email alert')
    return
  }
  
  try {
    await sendMail(to, subject, html)
  } catch (error) {
    console.error('Email alert failed:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export function fmtBlock(obj: unknown) {
  return '```' + JSON.stringify(obj, null, 2) + '```'
}
