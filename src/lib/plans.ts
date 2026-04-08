/**
 * AllowanceGuard Plan Definitions
 *
 * Consumer tiers: free, pro, sentinel
 * API tiers: api_free, api_developer, api_growth, api_enterprise
 */

// ---------------------------------------------------------------------------
// Consumer plans
// ---------------------------------------------------------------------------

export const ConsumerPlan = {
  FREE: 'free',
  PRO: 'pro',
  SENTINEL: 'sentinel',
} as const

export type ConsumerPlan = (typeof ConsumerPlan)[keyof typeof ConsumerPlan]

// ---------------------------------------------------------------------------
// API plans
// ---------------------------------------------------------------------------

export const ApiPlan = {
  FREE: 'api_free',
  /**
   * Browser-safe read-only tier. Used by public API keys (`ag_pub_*`) issued
   * to dApp integrators via `@allowance-guard/react`. See migration 027 and
   * `docs/architecture/allowance-guard-react-hooks.md` §4.
   */
  PUBLIC: 'api_public',
  DEVELOPER: 'api_developer',
  GROWTH: 'api_growth',
  ENTERPRISE: 'api_enterprise',
} as const

export type ApiPlan = (typeof ApiPlan)[keyof typeof ApiPlan]

// ---------------------------------------------------------------------------
// Feature flags
// ---------------------------------------------------------------------------

export interface PlanLimits {
  /** Max wallets the user can scan / save */
  maxWallets: number
  /** Max chains visible at once (1 = single-chain view) */
  maxChains: number
  /** Max API calls per day (consumer dashboard, not B2B API) */
  maxApiCallsPerDay: number
  /** Continuous monitoring enabled */
  monitoring: boolean
  /** Batch / bulk revoke enabled */
  batchRevoke: boolean
  /** CSV / PDF export enabled */
  export: boolean
  /** Email / Telegram alert subscriptions */
  alerts: boolean
  /** Team dashboard access */
  teams: boolean
  /** Historical risk timeline ("Time Machine") */
  timeMachine: boolean
  /** Automated revocation rule engine */
  automatedRules: boolean
  /** Priority support */
  prioritySupport: boolean
  /** Webhook integrations */
  webhooks: boolean
  /** Max monitored wallets (Sentinel feature) */
  maxMonitoredWallets: number
}

export const CONSUMER_PLAN_LIMITS: Record<ConsumerPlan, PlanLimits> = {
  free: {
    maxWallets: 3,
    maxChains: 1,
    maxApiCallsPerDay: 50,
    monitoring: false,
    batchRevoke: false,
    export: false,
    alerts: false,
    teams: false,
    timeMachine: false,
    automatedRules: false,
    prioritySupport: false,
    webhooks: false,
    maxMonitoredWallets: 0,
  },
  pro: {
    maxWallets: -1, // unlimited
    maxChains: 15,
    maxApiCallsPerDay: 500,
    monitoring: true,
    batchRevoke: true,
    export: true,
    alerts: true,
    teams: false,
    timeMachine: true,
    automatedRules: false,
    prioritySupport: false,
    webhooks: false,
    maxMonitoredWallets: 5,
  },
  sentinel: {
    maxWallets: -1,
    maxChains: 15,
    maxApiCallsPerDay: 2000,
    monitoring: true,
    batchRevoke: true,
    export: true,
    alerts: true,
    teams: true,
    timeMachine: true,
    automatedRules: true,
    prioritySupport: true,
    webhooks: true,
    maxMonitoredWallets: 50,
  },
}

// ---------------------------------------------------------------------------
// API plan rate limits (calls per day)
// ---------------------------------------------------------------------------

export interface ApiPlanLimits {
  callsPerDay: number
  burstPerMinute: number
  webhooksEnabled: boolean
  priorityProcessing: boolean
}

export const API_PLAN_LIMITS: Record<ApiPlan, ApiPlanLimits> = {
  api_free: {
    callsPerDay: 100,
    burstPerMinute: 10,
    webhooksEnabled: false,
    priorityProcessing: false,
  },
  api_public: {
    // Browser-embeddable keys get a tighter daily budget than api_free
    // because they are shared across every visitor of a dApp. The intent
    // is "enough for a small integration"; teams with real traffic must
    // upgrade to api_developer+ or proxy through their own backend.
    callsPerDay: 500,
    burstPerMinute: 30,
    webhooksEnabled: false,
    priorityProcessing: false,
  },
  api_developer: {
    callsPerDay: 10_000,
    burstPerMinute: 60,
    webhooksEnabled: true,
    priorityProcessing: false,
  },
  api_growth: {
    callsPerDay: 100_000,
    burstPerMinute: 300,
    webhooksEnabled: true,
    priorityProcessing: true,
  },
  api_enterprise: {
    callsPerDay: -1, // unlimited
    burstPerMinute: -1,
    webhooksEnabled: true,
    priorityProcessing: true,
  },
}

// ---------------------------------------------------------------------------
// Pricing (amounts in minor units — pence / cents)
// ---------------------------------------------------------------------------

export interface PlanPrice {
  monthlyPence: number
  yearlyPence: number
  currency: string
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
}

export const CONSUMER_PRICES: Record<Exclude<ConsumerPlan, 'free'>, PlanPrice> = {
  pro: {
    monthlyPence: 999,
    yearlyPence: 7900,
    currency: 'usd',
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
    stripePriceIdYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
  },
  sentinel: {
    monthlyPence: 4999,
    yearlyPence: 49900,
    currency: 'usd',
    stripePriceIdMonthly: process.env.STRIPE_PRICE_SENTINEL_MONTHLY ?? '',
    stripePriceIdYearly: process.env.STRIPE_PRICE_SENTINEL_YEARLY ?? '',
  },
}

export const API_PRICES: Record<Exclude<ApiPlan, 'api_free' | 'api_public' | 'api_enterprise'>, PlanPrice> = {
  api_developer: {
    monthlyPence: 3900,
    yearlyPence: 37400, // $374/yr — 20% off vs monthly ($468)
    currency: 'usd',
    stripePriceIdMonthly: process.env.STRIPE_PRICE_API_DEVELOPER ?? '',
    stripePriceIdYearly: process.env.STRIPE_PRICE_API_DEVELOPER_YEARLY ?? '',
  },
  api_growth: {
    monthlyPence: 14900,
    yearlyPence: 149000, // $1,490/yr — 17% off vs monthly ($1,788)
    currency: 'usd',
    stripePriceIdMonthly: process.env.STRIPE_PRICE_API_GROWTH ?? '',
    stripePriceIdYearly: process.env.STRIPE_PRICE_API_GROWTH_YEARLY ?? '',
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getPlanLimits(plan: ConsumerPlan): PlanLimits {
  return CONSUMER_PLAN_LIMITS[plan]
}

export function getApiPlanLimits(plan: ApiPlan): ApiPlanLimits {
  return API_PLAN_LIMITS[plan]
}

export function isPaidPlan(plan: ConsumerPlan): boolean {
  return plan !== ConsumerPlan.FREE
}

export function isUnlimited(value: number): boolean {
  return value === -1
}

export function getPlanDisplayName(plan: ConsumerPlan | ApiPlan): string {
  const names: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    sentinel: 'Sentinel',
    api_free: 'API Free',
    api_public: 'API Public (browser)',
    api_developer: 'API Developer',
    api_growth: 'API Growth',
    api_enterprise: 'API Enterprise',
  }
  return names[plan] ?? plan
}

export function formatPrice(pence: number, currency = 'usd'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(pence / 100)
}

/** All features that can be gated */
export type GatedFeature = keyof Omit<PlanLimits, 'maxWallets' | 'maxChains' | 'maxApiCallsPerDay' | 'maxMonitoredWallets'>
