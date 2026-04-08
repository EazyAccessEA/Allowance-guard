import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AllowanceGuardProvider } from '../../provider'
import { useChains } from '../useChains'
import { TEST_API_BASE, TEST_PUBLIC_KEY } from '../../test/constants'

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

describe('useChains', () => {
  it('loads chains via the shared client transport', async () => {
    const qc = createTestQueryClient()
    const { result } = renderHook(() => useChains(), {
      wrapper: createWrapper(qc),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toHaveLength(1)
    expect(result.current.data?.[0].chainId).toBe(1)
    expect(result.current.data?.[0].name).toBe('Ethereum')
  })
})
