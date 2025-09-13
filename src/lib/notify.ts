import { sendSlack } from './slack'

export async function notifySlackDonation({ 
  amount, 
  currency, 
  email, 
  sessionId 
}: { 
  amount: number
  currency: string
  email: string | null
  sessionId: string 
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    console.log('ℹ️ No Slack webhook configured; skipping notification')
    return
  }

  const amountFormatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)

  const payload = {
    text: `🎉 New donation received!`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🎉 New Donation Received!'
        }
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Amount:* ${amountFormatted}`
          },
          {
            type: 'mrkdwn',
            text: `*Email:* ${email || 'Not provided'}`
          },
          {
            type: 'mrkdwn',
            text: `*Session ID:* \`${sessionId}\``
          }
        ]
      }
    ]
  }

  try {
    await sendSlack(webhookUrl, payload)
    console.log('✅ Slack notification sent for donation:', sessionId)
  } catch (error) {
    console.error('❌ Failed to send Slack notification:', error)
  }
}
