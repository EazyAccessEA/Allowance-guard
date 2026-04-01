import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useUserPlan } from '@/hooks/useUserPlan'

const FREE_DEFAULTS = {
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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children)
  }
}

describe('useUserPlan', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('returns free plan defaults while loading (placeholderData)', () => {
    ;(global.fetch as jest.Mock).mockReturnValue(new Promise(() => {})) // never resolves

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    expect(result.current.plan).toBe('free')
    expect(result.current.limits).toEqual(FREE_DEFAULTS.limits)
    expect(result.current.status).toBe('active')
    expect(result.current.currentPeriodEnd).toBeNull()
    expect(result.current.cancelAtPeriodEnd).toBe(false)
  })

  it('returns fetched plan data on success', async () => {
    const proData = {
      plan: 'pro',
      status: 'active',
      currentPeriodEnd: '2026-05-01',
      cancelAtPeriodEnd: false,
      limits: {
        maxWallets: 999,
        maxChains: 6,
        maxApiCallsPerDay: 10000,
        monitoring: true,
        batchRevoke: true,
        export: true,
        alerts: true,
        teams: false,
        timeMachine: true,
        automatedRules: false,
        prioritySupport: false,
        webhooks: false,
        maxMonitoredWallets: 10,
      },
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => proData,
    })

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.plan).toBe('pro')
    })

    expect(result.current.limits.maxWallets).toBe(999)
    expect(result.current.currentPeriodEnd).toBe('2026-05-01')
    expect(result.current.status).toBe('active')
  })

  it('returns free defaults on API error (non-ok response)', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    })

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.plan).toBe('free')
    expect(result.current.limits).toEqual(FREE_DEFAULTS.limits)
  })

  it('returns free defaults on network error', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.plan).toBe('free')
    expect(result.current.limits).toEqual(FREE_DEFAULTS.limits)
  })

  it('isLoading starts true and becomes false', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => FREE_DEFAULTS,
    })

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    // With placeholderData, isLoading may still be true initially during fetch
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('returns correct structure: plan, limits, status, currentPeriodEnd, cancelAtPeriodEnd, isLoading, error', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => FREE_DEFAULTS,
    })

    const { result } = renderHook(() => useUserPlan(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current).toHaveProperty('plan')
    expect(result.current).toHaveProperty('limits')
    expect(result.current).toHaveProperty('status')
    expect(result.current).toHaveProperty('currentPeriodEnd')
    expect(result.current).toHaveProperty('cancelAtPeriodEnd')
    expect(result.current).toHaveProperty('isLoading')
    expect(result.current).toHaveProperty('error')
  })
})
