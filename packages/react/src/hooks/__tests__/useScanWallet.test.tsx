import { describe, expect, it } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { AllowanceGuardProvider } from '../../provider'
import { useScanWallet } from '../useScanWallet'
import { TEST_API_BASE, TEST_PUBLIC_KEY } from '../../test/constants'

const TEST_WALLET = '0x0000000000000000000000000000000000000002' as const

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

describe('useScanWallet', () => {
  it('POSTs /scan and resolves scan metadata', async () => {
    const qc = createTestQueryClient()
    const { result } = renderHook(() => useScanWallet(), {
      wrapper: createWrapper(qc),
    })

    result.current.mutate({ wallet: TEST_WALLET, chains: [1] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.scanId).toBe(42)
    expect(result.current.data?.wallet).toBe(TEST_WALLET)
    expect(result.current.data?.status).toBe('pending')
  })
})
