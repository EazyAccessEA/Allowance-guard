/**
 * End-to-end hook tests for @allowance-guard/react.
 *
 * Uses MSW to mock the /api/v1 transport so the full stack (hook →
 * TanStack Query → AllowanceGuardClient → fetch → handler) is exercised
 * deterministically. Assertions focus on:
 *   - provider context enforcement
 *   - secret-key hard-fail in browser context
 *   - successful read/query flows
 *   - error propagation to { error, isError }
 *   - query-key invalidation from mutations
 *   - useRevokeApproval calldata encoding (ERC-20 approve(spender, 0))
 */
import React from 'react'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AllowanceGuardProvider, useAllowanceGuardClient } from '../provider'
import { useChains } from '../hooks/useChains'
import { useAllowances } from '../hooks/useAllowances'
import { useRiskScore } from '../hooks/useRiskScore'
import { useScanWallet } from '../hooks/useScanWallet'
import { useRevokeApproval } from '../hooks/useRevokeApproval'
import { allowanceGuardQueryKeys } from '../query-keys'
import { server } from './setup'
import { TEST_BASE_URL } from './handlers'

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AllowanceGuardProvider apiKey="ag_pub_test" baseUrl={TEST_BASE_URL}>
          {children}
        </AllowanceGuardProvider>
      </QueryClientProvider>
    )
  }
}

function freshClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  })
}

describe('provider context', () => {
  it('throws a clear error when used without AllowanceGuardProvider', () => {
    expect(() => renderHook(() => useAllowanceGuardClient())).toThrow(
      /useAllowanceGuardClient must be used inside/,
    )
  })

  it('rejects a secret key in browser (jsdom) context', () => {
    const queryClient = freshClient()
    function Wrapper({ children }: { children: React.ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          <AllowanceGuardProvider apiKey="ag_live_secret" baseUrl={TEST_BASE_URL}>
            {children}
          </AllowanceGuardProvider>
        </QueryClientProvider>
      )
    }
    expect(() => renderHook(() => useAllowanceGuardClient(), { wrapper: Wrapper })).toThrow(
      /secret keys \(ag_live_\*\) cannot be used in the browser/,
    )
  })
})

describe('useChains', () => {
  it('returns the chain list on success', async () => {
    const queryClient = freshClient()
    const { result } = renderHook(() => useChains(), { wrapper: wrapper(queryClient) })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(2)
    expect(result.current.data?.[0]?.name).toBe('Ethereum')
  })

  it('propagates 401 errors as isError with an AuthError', async () => {
    server.use(
      http.get(`${TEST_BASE_URL}/chains`, () =>
        HttpResponse.json({ error: { message: 'bad key' } }, { status: 401 }),
      ),
    )
    const queryClient = freshClient()
    const { result } = renderHook(() => useChains(), { wrapper: wrapper(queryClient) })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.name).toBe('AuthError')
  })
})

describe('useAllowances', () => {
  it('skips the query when no wallet is provided', () => {
    const queryClient = freshClient()
    const { result } = renderHook(
      () => useAllowances({ wallet: undefined }),
      { wrapper: wrapper(queryClient) },
    )
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('fetches when wallet is provided and returns the page', async () => {
    const queryClient = freshClient()
    const wallet = '0x1111111111111111111111111111111111111111' as const
    const { result } = renderHook(
      () => useAllowances({ wallet, riskOnly: true }),
      { wrapper: wrapper(queryClient) },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.allowances).toHaveLength(1)
    expect(result.current.data?.allowances[0]?.is_unlimited).toBe(true)
  })
})

describe('useRiskScore', () => {
  it('returns a risk score for a wallet', async () => {
    const queryClient = freshClient()
    const { result } = renderHook(
      () => useRiskScore({ wallet: '0x2222222222222222222222222222222222222222' }),
      { wrapper: wrapper(queryClient) },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.riskLevel).toBe('high')
    expect(result.current.data?.riskScore).toBe(72)
  })
})

describe('useScanWallet mutation', () => {
  it('invalidates allowances + risk + portfolio queries on success', async () => {
    const queryClient = freshClient()
    const wallet = '0x3333333333333333333333333333333333333333' as const

    // Prime the cache so invalidation has something to invalidate
    queryClient.setQueryData(
      allowanceGuardQueryKeys.allowances({ wallet }),
      { allowances: [], pagination: { page: 1, pageSize: 25, total: 0, totalPages: 0 } },
    )
    queryClient.setQueryData(
      allowanceGuardQueryKeys.riskScore({ wallet }),
      { riskScore: 0 },
    )

    const { result } = renderHook(() => useScanWallet(), { wrapper: wrapper(queryClient) })

    result.current.mutate({ wallet })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.scanId).toBe(42)
    // After invalidation the cached entries should be marked stale
    const allowancesState = queryClient.getQueryState(
      allowanceGuardQueryKeys.allowances({ wallet }),
    )
    const riskState = queryClient.getQueryState(
      allowanceGuardQueryKeys.riskScore({ wallet }),
    )
    expect(allowancesState?.isInvalidated).toBe(true)
    expect(riskState?.isInvalidated).toBe(true)
  })
})

describe('useRevokeApproval', () => {
  it('encodes approve(spender, 0) with the correct selector and padding', async () => {
    const queryClient = freshClient()
    const { result } = renderHook(() => useRevokeApproval(), { wrapper: wrapper(queryClient) })

    result.current.mutate({
      wallet: '0x4444444444444444444444444444444444444444',
      token: '0x5555555555555555555555555555555555555555',
      spender: '0x6666666666666666666666666666666666666666',
      chainId: 1,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const tx = result.current.data!
    expect(tx.to).toBe('0x5555555555555555555555555555555555555555')
    expect(tx.chainId).toBe(1)
    expect(tx.value).toBe('0x0')

    // Selector for approve(address,uint256)
    expect(tx.data.slice(0, 10)).toBe('0x095ea7b3')
    // Next 32 bytes = padded spender
    expect(tx.data.slice(10, 10 + 64)).toBe(
      '0000000000000000000000006666666666666666666666666666666666666666',
    )
    // Final 32 bytes = padded zero (revoke amount)
    expect(tx.data.slice(10 + 64)).toBe(
      '0000000000000000000000000000000000000000000000000000000000000000',
    )
  })
})
