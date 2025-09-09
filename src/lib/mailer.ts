import nodemailer from 'nodemailer'

const host = process.env.SMTP_HOST
const port = Number(process.env.SMTP_PORT || 587)
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS
const fromEmail = process.env.ALERTS_FROM_EMAIL || 'no-reply@example.com'
const fromName = process.env.ALERTS_FROM_NAME || 'Allowance Guard'

export function getTransport() {
  if (!host || !user || !pass) {
    // Dev fallback: log-only transport
    return nodemailer.createTransport({ jsonTransport: true }) as nodemailer.Transporter
  }
  return nodemailer.createTransport({
    host, 
    port, 
    secure: port === 465,
    auth: { user, pass }
  }) as nodemailer.Transporter
}

export async function sendMail(to: string, subject: string, html: string, text?: string) {
  const transporter = getTransport()
  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to, 
    subject, 
    html, 
    text
  })
  return info
}
