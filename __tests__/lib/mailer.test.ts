/**
 * Smoke tests for src/lib/mailer.ts after nodemailer 7→8 bump.
 *
 * Exercises the two paths that don't require real SMTP/Resend:
 *   1. E2E_FAKE_EMAIL short-circuit
 *   2. dev log-only transport (jsonTransport)
 */

import { getTransport, sendMail } from '@/lib/mailer'

jest.mock('@/lib/metrics', () => ({
  incrEmail: jest.fn(),
}))

describe('mailer (nodemailer 8)', () => {
  const originalEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('sendMail short-circuits with E2E_FAKE_EMAIL=1', async () => {
    process.env.E2E_FAKE_EMAIL = '1'
    delete process.env.RESEND_API_KEY

    const result = await sendMail('ops@example.com', 'Test', '<p>hi</p>')
    expect(result).toEqual({ ok: true, id: 'fake' })
  })

  it('getTransport falls back to jsonTransport when SMTP/Postmark unset (non-prod)', () => {
    delete process.env.POSTMARK_SERVER_TOKEN
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
    ;(process.env as Record<string, string>).NODE_ENV = 'test'

    const transporter = getTransport()
    expect(transporter).toBeDefined()
    expect(typeof transporter.sendMail).toBe('function')
  })

  it('getTransport throws in production when no provider is configured', () => {
    delete process.env.POSTMARK_SERVER_TOKEN
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS
    ;(process.env as Record<string, string>).NODE_ENV = 'production'

    expect(() => getTransport()).toThrow('Email service not configured')
  })
})
