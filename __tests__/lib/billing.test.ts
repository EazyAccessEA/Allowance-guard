/**
 * Unit tests for src/lib/billing.ts
 *
 * Covers: getOrCreateCustomer, createCheckoutSession, createPortalSession,
 *         syncSubscription, getUserSubscription
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
}))

jest.mock('@/lib/logger', () => ({
  apiLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

const mockCustomersCreate = jest.fn()
const mockCheckoutCreate = jest.fn()
const mockPortalCreate = jest.fn()

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    customers: { create: mockCustomersCreate },
    checkout: { sessions: { create: mockCheckoutCreate } },
    billingPortal: { sessions: { create: mockPortalCreate } },
  }))
})

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import {
  getOrCreateCustomer,
  createCheckoutSession,
  createPortalSession,
  syncSubscription,
  getUserSubscription,
} from '@/lib/billing'
import { pool } from '@/lib/db'
import { apiLogger } from '@/lib/logger'
import type Stripe from 'stripe'

const mockQuery = pool.query as jest.Mock

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('billing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // -----------------------------------------------------------------------
  // getOrCreateCustomer
  // -----------------------------------------------------------------------

  describe('getOrCreateCustomer', () => {
    it('returns existing customer ID from DB', async () => {
      mockQuery.mockResolvedValue({ rows: [{ stripe_customer_id: 'cus_existing' }] })

      const id = await getOrCreateCustomer(1, 'a@b.com')
      expect(id).toBe('cus_existing')
      expect(mockCustomersCreate).not.toHaveBeenCalled()
    })

    it('creates new Stripe customer when not in DB', async () => {
      mockQuery.mockResolvedValue({ rows: [] })
      mockCustomersCreate.mockResolvedValue({ id: 'cus_new' })

      const id = await getOrCreateCustomer(1, 'a@b.com')
      expect(id).toBe('cus_new')
      expect(mockCustomersCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'a@b.com',
          metadata: { ag_user_id: '1' },
        }),
      )
      expect(apiLogger.info).toHaveBeenCalledWith(
        'stripe.customer.created',
        expect.objectContaining({ userId: 1, customerId: 'cus_new' }),
      )
    })
  })

  // -----------------------------------------------------------------------
  // createCheckoutSession
  // -----------------------------------------------------------------------

  describe('createCheckoutSession', () => {
    const baseOpts = {
      userId: 1,
      email: 'a@b.com',
      priceId: 'price_123',
      plan: 'pro' as const,
      successUrl: 'https://example.com/success',
      cancelUrl: 'https://example.com/cancel',
    }

    beforeEach(() => {
      // getOrCreateCustomer will query DB
      mockQuery.mockResolvedValue({ rows: [{ stripe_customer_id: 'cus_1' }] })
    })

    it('returns checkout URL', async () => {
      mockCheckoutCreate.mockResolvedValue({ id: 'cs_1', url: 'https://checkout.stripe.com/pay' })

      const url = await createCheckoutSession(baseOpts)
      expect(url).toBe('https://checkout.stripe.com/pay')
      expect(mockCheckoutCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_1',
          mode: 'subscription',
          line_items: [{ price: 'price_123', quantity: 1 }],
        }),
      )
    })

    it('includes trial_period_days when provided', async () => {
      mockCheckoutCreate.mockResolvedValue({ id: 'cs_2', url: 'https://checkout.stripe.com/trial' })

      await createCheckoutSession({ ...baseOpts, trialDays: 14 })

      expect(mockCheckoutCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          subscription_data: expect.objectContaining({
            trial_period_days: 14,
          }),
        }),
      )
    })

    it('omits trial when trialDays is 0', async () => {
      mockCheckoutCreate.mockResolvedValue({ id: 'cs_3', url: 'https://checkout.stripe.com/no-trial' })

      await createCheckoutSession({ ...baseOpts, trialDays: 0 })

      const callArg = mockCheckoutCreate.mock.calls[0][0]
      expect(callArg.subscription_data.trial_period_days).toBeUndefined()
    })
  })

  // -----------------------------------------------------------------------
  // createPortalSession
  // -----------------------------------------------------------------------

  describe('createPortalSession', () => {
    it('throws NO_ACTIVE_SUBSCRIPTION when no sub found', async () => {
      mockQuery.mockResolvedValue({ rows: [] })

      await expect(createPortalSession(1, 'https://example.com')).rejects.toThrow('NO_ACTIVE_SUBSCRIPTION')
    })

    it('returns portal URL', async () => {
      mockQuery.mockResolvedValue({ rows: [{ stripe_customer_id: 'cus_1' }] })
      mockPortalCreate.mockResolvedValue({ url: 'https://billing.stripe.com/portal' })

      const url = await createPortalSession(1, 'https://example.com')
      expect(url).toBe('https://billing.stripe.com/portal')
      expect(mockPortalCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: 'cus_1',
          return_url: 'https://example.com',
        }),
      )
    })
  })

  // -----------------------------------------------------------------------
  // syncSubscription
  // -----------------------------------------------------------------------

  describe('syncSubscription', () => {
    it('upserts with correct SQL params', async () => {
      mockQuery.mockResolvedValue({ rows: [] })

      const sub = {
        id: 'sub_1',
        customer: 'cus_1',
        status: 'active',
        cancel_at_period_end: false,
        metadata: { ag_user_id: '42', ag_plan: 'pro' },
        items: {
          data: [{ current_period_start: 1700000000, current_period_end: 1703000000 }],
        },
      } as unknown as Stripe.Subscription

      await syncSubscription(sub)

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO subscriptions'),
        [
          42,
          'cus_1',
          'sub_1',
          'pro',
          'active',
          1700000000,
          1703000000,
          false,
          JSON.stringify({ ag_user_id: '42', ag_plan: 'pro' }),
        ],
      )
      expect(apiLogger.info).toHaveBeenCalledWith(
        'stripe.subscription.synced',
        expect.objectContaining({ userId: '42', subscriptionId: 'sub_1' }),
      )
    })

    it('warns and returns when no ag_user_id metadata', async () => {
      const sub = {
        id: 'sub_2',
        customer: 'cus_2',
        status: 'active',
        cancel_at_period_end: false,
        metadata: {},
        items: { data: [] },
      } as unknown as Stripe.Subscription

      await syncSubscription(sub)

      expect(apiLogger.warn).toHaveBeenCalledWith(
        'stripe.sync.missing_user_id',
        expect.objectContaining({ subscriptionId: 'sub_2' }),
      )
      expect(mockQuery).not.toHaveBeenCalled()
    })
  })

  // -----------------------------------------------------------------------
  // getUserSubscription
  // -----------------------------------------------------------------------

  describe('getUserSubscription', () => {
    it('returns active subscription', async () => {
      mockQuery.mockResolvedValue({
        rows: [{
          plan: 'pro',
          status: 'active',
          current_period_end: '2025-12-31T00:00:00Z',
          cancel_at_period_end: false,
        }],
      })

      const result = await getUserSubscription(1)
      expect(result.plan).toBe('pro')
      expect(result.status).toBe('active')
      expect(result.currentPeriodEnd).toBeInstanceOf(Date)
      expect(result.cancelAtPeriodEnd).toBe(false)
    })

    it('returns free plan when no active sub', async () => {
      mockQuery.mockResolvedValue({ rows: [] })

      const result = await getUserSubscription(1)
      expect(result.plan).toBe('free')
      expect(result.status).toBe('active')
      expect(result.currentPeriodEnd).toBeNull()
      expect(result.cancelAtPeriodEnd).toBe(false)
    })
  })
})
