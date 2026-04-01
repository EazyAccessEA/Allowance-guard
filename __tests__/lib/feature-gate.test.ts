/**
 * Unit tests for src/lib/feature-gate.ts
 *
 * Covers: checkFeature, checkWalletQuota, checkApiQuota, checkChainAccess,
 *         isFeatureAllowed, getUserPlanLimits
 */

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock('@/lib/db', () => ({
  pool: { query: jest.fn() },
}))

jest.mock('@/lib/billing', () => ({
  getUserSubscription: jest.fn(),
}))

// plans.ts is NOT mocked — we use real plan limits so tests verify real behaviour.

// ---------------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------------

import {
  checkFeature,
  checkWalletQuota,
  checkApiQuota,
  checkChainAccess,
  isFeatureAllowed,
  getUserPlanLimits,
} from '@/lib/feature-gate'
import { getUserSubscription } from '@/lib/billing'
import { pool } from '@/lib/db'

const mockGetSub = getUserSubscription as jest.Mock
const mockQuery = pool.query as jest.Mock

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function subOf(plan: string) {
  return { plan, status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('feature-gate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // -----------------------------------------------------------------------
  // checkFeature
  // -----------------------------------------------------------------------

  describe('checkFeature', () => {
    it('denies monitoring for free user with requiredPlan: pro', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))

      const result = await checkFeature(1, 'monitoring')
      expect(result.allowed).toBe(false)
      expect(result.requiredPlan).toBe('pro')
      expect(result.plan).toBe('free')
    })

    it('allows monitoring for pro user', async () => {
      mockGetSub.mockResolvedValue(subOf('pro'))

      const result = await checkFeature(1, 'monitoring')
      expect(result.allowed).toBe(true)
      expect(result.requiredPlan).toBeUndefined()
    })

    it('allows teams for sentinel user', async () => {
      mockGetSub.mockResolvedValue(subOf('sentinel'))

      const result = await checkFeature(1, 'teams')
      expect(result.allowed).toBe(true)
    })

    it('denies teams for free user with requiredPlan: sentinel', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))

      const result = await checkFeature(1, 'teams')
      expect(result.allowed).toBe(false)
      expect(result.requiredPlan).toBe('sentinel')
    })
  })

  // -----------------------------------------------------------------------
  // checkWalletQuota
  // -----------------------------------------------------------------------

  describe('checkWalletQuota', () => {
    it('denies free user with 3 wallets (at limit)', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))
      mockQuery.mockResolvedValue({ rows: [{ count: 3 }] })

      const result = await checkWalletQuota(1)
      expect(result.allowed).toBe(false)
      expect(result.limit).toBe(3)
      expect(result.used).toBe(3)
      expect(result.requiredPlan).toBe('pro')
    })

    it('allows pro user (unlimited wallets)', async () => {
      mockGetSub.mockResolvedValue(subOf('pro'))

      const result = await checkWalletQuota(1)
      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(-1)
      // DB should NOT be queried for unlimited plans
      expect(mockQuery).not.toHaveBeenCalled()
    })

    it('allows free user with 2 wallets (under limit)', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))
      mockQuery.mockResolvedValue({ rows: [{ count: 2 }] })

      const result = await checkWalletQuota(1)
      expect(result.allowed).toBe(true)
      expect(result.used).toBe(2)
    })
  })

  // -----------------------------------------------------------------------
  // checkApiQuota
  // -----------------------------------------------------------------------

  describe('checkApiQuota', () => {
    it('allows free user under limit', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))
      mockQuery.mockResolvedValue({ rows: [{ count: 10 }] })

      const result = await checkApiQuota(1)
      expect(result.allowed).toBe(true)
      expect(result.used).toBe(10)
      expect(result.limit).toBe(50) // free maxApiCallsPerDay
    })

    it('denies free user at limit', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))
      mockQuery.mockResolvedValue({ rows: [{ count: 50 }] })

      const result = await checkApiQuota(1)
      expect(result.allowed).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // checkChainAccess
  // -----------------------------------------------------------------------

  describe('checkChainAccess', () => {
    it('allows free user requesting 1 chain', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))

      const result = await checkChainAccess(1, 1)
      expect(result.allowed).toBe(true)
    })

    it('denies free user requesting 2 chains', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))

      const result = await checkChainAccess(1, 2)
      expect(result.allowed).toBe(false)
      expect(result.requiredPlan).toBe('pro')
    })
  })

  // -----------------------------------------------------------------------
  // isFeatureAllowed
  // -----------------------------------------------------------------------

  describe('isFeatureAllowed', () => {
    it('returns true for pro user with monitoring', async () => {
      mockGetSub.mockResolvedValue(subOf('pro'))

      const result = await isFeatureAllowed(1, 'monitoring')
      expect(result).toBe(true)
    })

    it('returns false for free user with monitoring', async () => {
      mockGetSub.mockResolvedValue(subOf('free'))

      const result = await isFeatureAllowed(1, 'monitoring')
      expect(result).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // getUserPlanLimits
  // -----------------------------------------------------------------------

  describe('getUserPlanLimits', () => {
    it('returns merged plan + limits for pro user', async () => {
      mockGetSub.mockResolvedValue(subOf('pro'))

      const result = await getUserPlanLimits(1)
      expect(result.plan).toBe('pro')
      expect(result.maxWallets).toBe(-1)
      expect(result.monitoring).toBe(true)
      expect(result.teams).toBe(false)
    })
  })
})
