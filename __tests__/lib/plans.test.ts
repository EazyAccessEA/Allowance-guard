/**
 * Unit tests for src/lib/plans.ts
 *
 * Pure functions — no external mocking needed.
 */

import {
  ConsumerPlan,
  ApiPlan,
  CONSUMER_PLAN_LIMITS,
  API_PLAN_LIMITS,
  getPlanLimits,
  getApiPlanLimits,
  isPaidPlan,
  isUnlimited,
  getPlanDisplayName,
  formatPrice,
  type GatedFeature,
  type PlanLimits,
} from '@/lib/plans'

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('plans', () => {
  // -----------------------------------------------------------------------
  // CONSUMER_PLAN_LIMITS
  // -----------------------------------------------------------------------

  describe('CONSUMER_PLAN_LIMITS', () => {
    it('free plan has maxWallets: 3, maxChains: 1, all boolean features false', () => {
      const free = CONSUMER_PLAN_LIMITS.free
      expect(free.maxWallets).toBe(3)
      expect(free.maxChains).toBe(1)
      expect(free.monitoring).toBe(false)
      expect(free.batchRevoke).toBe(false)
      expect(free.export).toBe(false)
      expect(free.alerts).toBe(false)
      expect(free.teams).toBe(false)
      expect(free.timeMachine).toBe(false)
      expect(free.automatedRules).toBe(false)
      expect(free.prioritySupport).toBe(false)
      expect(free.webhooks).toBe(false)
    })

    it('pro plan has maxWallets: -1 (unlimited) and pro features true', () => {
      const pro = CONSUMER_PLAN_LIMITS.pro
      expect(pro.maxWallets).toBe(-1)
      expect(pro.monitoring).toBe(true)
      expect(pro.batchRevoke).toBe(true)
      expect(pro.export).toBe(true)
      expect(pro.alerts).toBe(true)
      expect(pro.timeMachine).toBe(true)
      // Pro does NOT have sentinel features
      expect(pro.teams).toBe(false)
      expect(pro.automatedRules).toBe(false)
    })

    it('sentinel plan has all features true and maxMonitoredWallets: 50', () => {
      const sentinel = CONSUMER_PLAN_LIMITS.sentinel
      expect(sentinel.maxWallets).toBe(-1)
      expect(sentinel.monitoring).toBe(true)
      expect(sentinel.batchRevoke).toBe(true)
      expect(sentinel.export).toBe(true)
      expect(sentinel.alerts).toBe(true)
      expect(sentinel.teams).toBe(true)
      expect(sentinel.timeMachine).toBe(true)
      expect(sentinel.automatedRules).toBe(true)
      expect(sentinel.prioritySupport).toBe(true)
      expect(sentinel.webhooks).toBe(true)
      expect(sentinel.maxMonitoredWallets).toBe(50)
    })
  })

  // -----------------------------------------------------------------------
  // API_PLAN_LIMITS
  // -----------------------------------------------------------------------

  describe('API_PLAN_LIMITS', () => {
    it('enterprise has callsPerDay: -1 (unlimited)', () => {
      expect(API_PLAN_LIMITS.api_enterprise.callsPerDay).toBe(-1)
      expect(API_PLAN_LIMITS.api_enterprise.burstPerMinute).toBe(-1)
    })
  })

  // -----------------------------------------------------------------------
  // getPlanLimits
  // -----------------------------------------------------------------------

  describe('getPlanLimits', () => {
    it('returns correct limits for each plan', () => {
      expect(getPlanLimits('free')).toEqual(CONSUMER_PLAN_LIMITS.free)
      expect(getPlanLimits('pro')).toEqual(CONSUMER_PLAN_LIMITS.pro)
      expect(getPlanLimits('sentinel')).toEqual(CONSUMER_PLAN_LIMITS.sentinel)
    })
  })

  // -----------------------------------------------------------------------
  // getApiPlanLimits
  // -----------------------------------------------------------------------

  describe('getApiPlanLimits', () => {
    it('returns correct limits for each API plan', () => {
      expect(getApiPlanLimits('api_free')).toEqual(API_PLAN_LIMITS.api_free)
      expect(getApiPlanLimits('api_developer')).toEqual(API_PLAN_LIMITS.api_developer)
      expect(getApiPlanLimits('api_growth')).toEqual(API_PLAN_LIMITS.api_growth)
      expect(getApiPlanLimits('api_enterprise')).toEqual(API_PLAN_LIMITS.api_enterprise)
    })
  })

  // -----------------------------------------------------------------------
  // isPaidPlan
  // -----------------------------------------------------------------------

  describe('isPaidPlan', () => {
    it('returns false for free', () => {
      expect(isPaidPlan('free')).toBe(false)
    })

    it('returns true for pro', () => {
      expect(isPaidPlan('pro')).toBe(true)
    })

    it('returns true for sentinel', () => {
      expect(isPaidPlan('sentinel')).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // isUnlimited
  // -----------------------------------------------------------------------

  describe('isUnlimited', () => {
    it('returns true for -1', () => {
      expect(isUnlimited(-1)).toBe(true)
    })

    it('returns false for 0', () => {
      expect(isUnlimited(0)).toBe(false)
    })

    it('returns false for 100', () => {
      expect(isUnlimited(100)).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // getPlanDisplayName
  // -----------------------------------------------------------------------

  describe('getPlanDisplayName', () => {
    it('returns correct names for all known plans', () => {
      expect(getPlanDisplayName('free')).toBe('Free')
      expect(getPlanDisplayName('pro')).toBe('Pro')
      expect(getPlanDisplayName('sentinel')).toBe('Sentinel')
      expect(getPlanDisplayName('api_free')).toBe('API Free')
      expect(getPlanDisplayName('api_developer')).toBe('API Developer')
      expect(getPlanDisplayName('api_growth')).toBe('API Growth')
      expect(getPlanDisplayName('api_enterprise')).toBe('API Enterprise')
    })

    it('returns plan string for unknown plans', () => {
      expect(getPlanDisplayName('unknown_plan' as any)).toBe('unknown_plan')
    })
  })

  // -----------------------------------------------------------------------
  // formatPrice
  // -----------------------------------------------------------------------

  describe('formatPrice', () => {
    it('formats 999 as $9.99', () => {
      expect(formatPrice(999)).toBe('$9.99')
    })

    it('formats 4999 as $49.99', () => {
      expect(formatPrice(4999)).toBe('$49.99')
    })

    it('formats 7900 as $79.00', () => {
      expect(formatPrice(7900)).toBe('$79.00')
    })
  })

  // -----------------------------------------------------------------------
  // GatedFeature type coverage
  // -----------------------------------------------------------------------

  describe('GatedFeature type', () => {
    it('covers all 9 boolean features', () => {
      // This test verifies that the type includes all expected features
      // by checking the keys of CONSUMER_PLAN_LIMITS.free that are boolean.
      const free = CONSUMER_PLAN_LIMITS.free
      const booleanFeatures = Object.entries(free)
        .filter(([, v]) => typeof v === 'boolean')
        .map(([k]) => k)

      expect(booleanFeatures).toHaveLength(9)
      expect(booleanFeatures).toEqual(
        expect.arrayContaining([
          'monitoring',
          'batchRevoke',
          'export',
          'alerts',
          'teams',
          'timeMachine',
          'automatedRules',
          'prioritySupport',
          'webhooks',
        ]),
      )
    })
  })

  // -----------------------------------------------------------------------
  // ConsumerPlan / ApiPlan constants
  // -----------------------------------------------------------------------

  describe('plan constants', () => {
    it('ConsumerPlan has correct values', () => {
      expect(ConsumerPlan.FREE).toBe('free')
      expect(ConsumerPlan.PRO).toBe('pro')
      expect(ConsumerPlan.SENTINEL).toBe('sentinel')
    })

    it('ApiPlan has correct values', () => {
      expect(ApiPlan.FREE).toBe('api_free')
      expect(ApiPlan.DEVELOPER).toBe('api_developer')
      expect(ApiPlan.GROWTH).toBe('api_growth')
      expect(ApiPlan.ENTERPRISE).toBe('api_enterprise')
    })
  })
})
