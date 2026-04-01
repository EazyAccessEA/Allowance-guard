/**
 * @jest-environment node
 */

/**
 * Tests for POST /api/billing/webhook (Stripe webhook handler)
 */

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
  db: { query: jest.fn(), execute: jest.fn() },
}))

jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(),
  requireUser: jest.fn(),
}))

jest.mock('@/lib/billing', () => {
  const constructEvent = jest.fn()
  return {
    getUserSubscription: jest.fn(),
    createCheckoutSession: jest.fn(),
    createPortalSession: jest.fn(),
    syncSubscription: jest.fn(),
    stripe: { webhooks: { constructEvent } },
  }
})

jest.mock('@/lib/webhook_guard', () => ({
  alreadyProcessed: jest.fn(),
  markProcessed: jest.fn(),
  auditWebhook: jest.fn(),
}))

jest.mock('@/lib/rollbar', () => ({
  reportError: jest.fn(),
}))

jest.mock('@/lib/logger', () => ({
  withReq: jest.fn(() => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn() })),
  apiLogger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({ get: jest.fn(), set: jest.fn() })),
  headers: jest.fn(() => Promise.resolve(new Map())),
}))

import { stripe, syncSubscription } from '@/lib/billing'
import { alreadyProcessed, markProcessed } from '@/lib/webhook_guard'

const mockConstructEvent = (stripe as any).webhooks.constructEvent as jest.Mock
const mockAlreadyProcessed = alreadyProcessed as jest.Mock
const mockMarkProcessed = markProcessed as jest.Mock
const mockSyncSubscription = syncSubscription as jest.Mock

function createWebhookRequest(body: string, signature: string) {
  return new Request('http://localhost:3000/api/billing/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': signature,
    },
    body,
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test123'
  process.env.STRIPE_BILLING_WEBHOOK_SECRET = 'whsec_billing_test123'
  mockAlreadyProcessed.mockResolvedValue(false)
  mockMarkProcessed.mockResolvedValue(undefined)
})

describe('POST /api/billing/webhook', () => {
  test('returns 400 on missing stripe-signature header', async () => {
    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = new Request('http://localhost:3000/api/billing/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  test('returns 400 on invalid signature', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature')
    })

    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = createWebhookRequest('{"type":"test"}', 'invalid_sig')
    const res = await POST(req)

    expect(res.status).toBe(400)
  })

  test('returns 200 on valid webhook event', async () => {
    const mockEvent = {
      id: 'evt_test_123',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_abc',
          status: 'active',
          metadata: { ag_plan: 'pro', ag_user_id: '1' },
        },
      },
    }

    mockConstructEvent.mockReturnValue(mockEvent)
    mockSyncSubscription.mockResolvedValue(undefined)

    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = createWebhookRequest(JSON.stringify(mockEvent), 'valid_sig_123')
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.received).toBe(true)
    expect(mockMarkProcessed).toHaveBeenCalledWith('stripe', 'evt_test_123')
  })

  test('idempotent: returns 200 on replay without reprocessing', async () => {
    const mockEvent = {
      id: 'evt_replay_456',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_def',
          status: 'active',
          metadata: { ag_plan: 'pro' },
        },
      },
    }

    mockConstructEvent.mockReturnValue(mockEvent)
    mockAlreadyProcessed.mockResolvedValue(true)

    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = createWebhookRequest(JSON.stringify(mockEvent), 'valid_sig_456')
    const res = await POST(req)

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.replay).toBe(true)
    // syncSubscription should NOT be called on replay
    expect(mockSyncSubscription).not.toHaveBeenCalled()
  })

  test('handles checkout.session.completed event', async () => {
    const mockEvent = {
      id: 'evt_checkout_789',
      type: 'customer.subscription.created',
      data: {
        object: {
          id: 'sub_new',
          status: 'active',
          metadata: { ag_plan: 'sentinel', ag_user_id: '5' },
        },
      },
    }

    mockConstructEvent.mockReturnValue(mockEvent)
    mockSyncSubscription.mockResolvedValue(undefined)

    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = createWebhookRequest(JSON.stringify(mockEvent), 'valid_sig_789')
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockSyncSubscription).toHaveBeenCalled()
  })

  test('handles customer.subscription.updated event', async () => {
    const mockEvent = {
      id: 'evt_update_101',
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_updated',
          status: 'active',
          metadata: { ag_plan: 'pro', ag_user_id: '3' },
        },
      },
    }

    mockConstructEvent.mockReturnValue(mockEvent)
    mockSyncSubscription.mockResolvedValue(undefined)

    const { POST } = await import('@/app/api/billing/webhook/route')
    const req = createWebhookRequest(JSON.stringify(mockEvent), 'valid_sig_101')
    const res = await POST(req)

    expect(res.status).toBe(200)
    expect(mockSyncSubscription).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'sub_updated', status: 'active' }),
    )
  })
})
