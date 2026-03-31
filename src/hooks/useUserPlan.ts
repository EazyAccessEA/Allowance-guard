'use client'

import { useQuery } from '@tanstack/react-query'
import type { ConsumerPlan, PlanLimits } from '@/lib/plans'

interface UserPlanResponse {
  plan: ConsumerPlan
  status: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  limits: PlanLimits
}

const FREE_DEFAULTS: UserPlanResponse = {
  plan: 'free',
  status: 'active',
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  limits: {
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
}

async function fetchUserPlan(): Promise<UserPlanResponse> {
  const res = await fetch('/api/user/plan')
  if (!res.ok) return FREE_DEFAULTS
  return res.json()
}

/**
 * Fetches the current user's plan from /api/user/plan.
 * Returns free plan for unauthenticated users (no error).
 * Caches for 60 seconds via react-query stale time.
 */
export function useUserPlan() {
  const { data, isLoading, error } = useQuery<UserPlanResponse>({
    queryKey: ['user-plan'],
    queryFn: fetchUserPlan,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    placeholderData: FREE_DEFAULTS,
  })

  return {
    plan: data?.plan ?? 'free' as ConsumerPlan,
    limits: data?.limits ?? FREE_DEFAULTS.limits,
    status: data?.status ?? 'active',
    currentPeriodEnd: data?.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: data?.cancelAtPeriodEnd ?? false,
    isLoading,
    error,
  }
}
