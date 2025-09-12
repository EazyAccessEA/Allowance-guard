import nodemailer from 'nodemailer'
import { emailLogger } from './logger'

// Microsoft SMTP Configuration from .env.local
const host = process.env.SMTP_HOST || 'smtp-mail.outlook.com'
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const fromEmail = process.env.ALERTS_FROM_EMAIL || 'no_reply@allowanceguard.com'
const fromName = process.env.ALERTS_FROM_NAME || 'Allowance Guard'

// Legal footer template for all emails
const LEGAL_FOOTER = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; line-height: 1.5;">
  <p><strong>Legal Disclaimer:</strong> This email is for informational purposes only. Allowance Guard does not provide financial, legal, or investment advice. Always conduct your own research and consult with qualified professionals before making financial decisions.</p>
  
  <p><strong>Risk Warning:</strong> Cryptocurrency and DeFi activities involve substantial risk of loss. Past performance does not guarantee future results. You should carefully consider whether trading cryptocurrencies is suitable for you in light of your circumstances, knowledge, and financial resources.</p>
  
  <p><strong>Privacy Policy:</strong> We respect your privacy. Read our full privacy policy at <a href="https://allowanceguard.com/privacy" style="color: #3b82f6;">https://allowanceguard.com/privacy</a></p>
  
  <p><strong>Terms of Service:</strong> By using Allowance Guard, you agree to our terms of service at <a href="https://allowanceguard.com/terms" style="color: #3b82f6;">https://allowanceguard.com/terms</a></p>
  
  <p style="margin-top: 15px;">
    <a href="https://allowanceguard.com/unsubscribe?email={{EMAIL}}" style="color: #ef4444; text-decoration: underline;">Unsubscribe from these alerts</a> | 
    <a href="https://allowanceguard.com/preferences?email={{EMAIL}}" style="color: #3b82f6; text-decoration: underline;">Manage Email Preferences</a>
  </p>
  
  <p style="margin-top: 10px;">
    © ${new Date().getFullYear()} Allowance Guard. All rights reserved.<br>
    This email was sent from a no-reply address. Please do not reply to this email.
  </p>
</div>
`

// Generate complete email HTML with legal footer
export function createEmailHTML(content: string, recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Allowance Guard Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: white; padding: 30px 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .footer { background-color: #f9fafb; padding: 20px; }
    h1 { margin: 0; font-size: 24px; font-weight: 600; }
    h2 { color: #1e40af; font-size: 20px; margin-top: 30px; margin-bottom: 15px; }
    p { margin-bottom: 15px; }
    .alert-box { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .success-box { background-color: #d1fae5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0; }
    .button { display: inline-block; background-color: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 10px 0; }
    .button:hover { background-color: #1d4ed8; }
    .button-danger { background-color: #dc2626; }
    .button-danger:hover { background-color: #b91c1c; }
    .address { font-family: 'Courier New', monospace; background-color: #f3f4f6; padding: 8px; border-radius: 4px; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ Allowance Guard</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Security alerts for your token approvals</p>
    </div>
    
    <div class="content">
      ${content}
    </div>
    
    <div class="footer">
      ${LEGAL_FOOTER.replace(/\{\{EMAIL\}\}/g, recipientEmail)}
    </div>
  </div>
</body>
</html>
  `.trim()
}

export function getTransport() {
  if (!host || !user || !pass) {
    emailLogger.warn('SMTP configuration missing, using log-only transport')
    // Dev fallback: log-only transport
    return nodemailer.createTransport({ jsonTransport: true }) as nodemailer.Transporter
  }
  
  // Microsoft SMTP optimized configuration
  return nodemailer.createTransport({
    host, 
    port, 
    secure: false, // Microsoft uses STARTTLS, not SSL
    auth: { 
      user, 
      pass 
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    // Additional Microsoft-specific options
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
  }) as nodemailer.Transporter
}

export async function sendMail(to: string, subject: string, html: string, text?: string) {
  const transporter = getTransport()
  
  try {
    // Verify connection before sending
    await transporter.verify()
    
    // Use the createEmailHTML function to wrap content with legal footer
    const fullHTML = createEmailHTML(html, to)
    
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to, 
      subject, 
      html: fullHTML,
      text: text || fullHTML.replace(/<[^>]*>/g, '') // Auto-generate text from HTML if not provided
    })
    
    emailLogger.info('Email sent successfully', {
      messageId: info.messageId,
      to: to,
      subject: subject,
      from: fromEmail
    })
    
    return info
  } catch (error) {
    emailLogger.error('Email send failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      to: to,
      subject: subject,
      from: fromEmail
    })
    throw error
  }
}

// Convenience function for sending alert emails
export async function sendAlertEmail(to: string, subject: string, content: string) {
  return sendMail(to, subject, content)
}

// Convenience function for sending welcome emails
export async function sendWelcomeEmail(to: string, walletAddress?: string) {
  const content = `
    <h2>Welcome to Allowance Guard! 🎉</h2>
    <p>Thank you for subscribing to our security alerts. We'll help you monitor and manage your token approvals across multiple blockchain networks.</p>
    
    ${walletAddress ? `
    <div class="success-box">
      <strong>Wallet Connected:</strong><br>
      <span class="address">${walletAddress}</span>
    </div>
    ` : ''}
    
    <h2>What happens next?</h2>
    <ul>
      <li>We'll scan your wallet for existing token approvals</li>
      <li>You'll receive alerts about risky or unlimited approvals</li>
      <li>Get daily summaries of your approval status</li>
      <li>Access one-click revocation tools</li>
    </ul>
    
    <p><a href="https://allowanceguard.com" class="button">Visit Allowance Guard</a></p>
    
    <p>If you have any questions, please visit our <a href="https://allowanceguard.com/docs">documentation</a> or contact our support team.</p>
  `
  
  return sendMail(to, 'Welcome to Allowance Guard - Your Security Journey Begins', content)
}

// Convenience function for sending risk alerts
export async function sendRiskAlert(to: string, walletAddress: string, riskData: {
  token?: string
  spender?: string
  amount?: string
  riskLevel?: string
}) {
  const content = `
    <div class="alert-box">
      <h2>⚠️ High Risk Approval Detected</h2>
      <p>We've detected a potentially risky token approval in your wallet that requires immediate attention.</p>
    </div>
    
    <h2>Wallet Address</h2>
    <span class="address">${walletAddress}</span>
    
    <h2>Risk Details</h2>
    <ul>
      <li><strong>Token:</strong> ${riskData.token || 'Unknown'}</li>
      <li><strong>Spender:</strong> <span class="address">${riskData.spender || 'Unknown'}</span></li>
      <li><strong>Amount:</strong> ${riskData.amount || 'Unlimited'}</li>
      <li><strong>Risk Level:</strong> ${riskData.riskLevel || 'High'}</li>
    </ul>
    
    <p><a href="https://allowanceguard.com/revoke" class="button button-danger">Revoke This Approval</a></p>
    
    <p><strong>Recommended Action:</strong> Review this approval immediately and revoke it if you don't recognize the spender or if the amount seems excessive.</p>
  `
  
  return sendMail(to, '🚨 High Risk Token Approval Alert', content)
}

// Convenience function for sending thank you emails for donations
export async function sendThankYouEmail({
  to,
  donorName,
  amount,
  currency
}: {
  to: string
  donorName: string
  amount: string
  currency: string
}) {
  const content = `
    <h2>Thank You, ${donorName}! 💝</h2>
    <p>Your generous donation of <strong>$${amount} ${currency}</strong> helps us keep Allowance Guard free and secure for everyone.</p>
    
    <div class="success-box">
      <h3>How Your Support Helps:</h3>
      <ul>
        <li>Keep Allowance Guard free for all users</li>
        <li>Add support for more blockchain networks</li>
        <li>Improve security features and monitoring</li>
        <li>Provide better user experience</li>
      </ul>
    </div>
    
    <h2>Receipt Details</h2>
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>Donation Amount:</strong> $${amount} ${currency}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      <p><strong>Transaction ID:</strong> Available in your Coinbase Commerce dashboard</p>
    </div>
    
    <p>Thank you for supporting the future of DeFi security! Your contribution makes a real difference in keeping the crypto ecosystem safe.</p>
    
    <p><a href="https://allowanceguard.com" class="button">Continue Using Allowance Guard</a></p>
  `
  
  return sendMail(to, 'Thank you for supporting Allowance Guard! 💝', content)
}

// Test function for SMTP configuration
export async function testSMTPConnection() {
  try {
    const transporter = getTransport()
    await transporter.verify()
    emailLogger.info('SMTP connection successful')
    return true
  } catch (error) {
    emailLogger.error('SMTP connection failed', { error: error instanceof Error ? error.message : 'Unknown error' })
    return false
  }
}
