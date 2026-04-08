import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AllowanceGuardProvider } from '../../provider'
import { useAllowances } from '../useAllowances'
import { TEST_API_BASE, TEST_PUBLIC_KEY } from '../../test/constants'

const TEST_WALLET = '0x0000000000000000000000000000000000000001' as const

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function createWrapper(qc: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={qc}>
        <AllowanceGuardProvider apiKey={TEST_PUBLIC_KEY} baseUrl={TEST_API_BASE}>
          {children}
        </AllowanceGuardProvider>
      </QueryClientProvider>
    )
  }
}

describe('useAllowances', () => {
  it('fetches allowances when wallet is set', async () => {
    const qc = createTestQueryClient()
    const { result } = renderHook(
      () => useAllowances({ wallet: TEST_WALLET }),
      { wrapper: createWrapper(qc) },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.allowances).toEqual([])
    expect(result.current.data?.pagination.total).toBe(0)
  })

  it('does not fetch when wallet is missing', () => {
    const qc = createTestQueryClient()
    const { result } = renderHook(
      () => useAllowances({ wallet: undefined }),
      { wrapper: createWrapper(qc) },
    )

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toBeUndefined()
  })
})
