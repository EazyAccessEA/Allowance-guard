'use client'

import { wagmiAdapter } from '@/appkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import React, { type ReactNode, useMemo } from 'react'

const queryClient = new QueryClient()

export default function ContextProvider({
  children,
  cookies
}: {
  children: ReactNode
  cookies: string | null
}) {
  const initialState = useMemo(
    () => cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies ?? ''),
    [cookies]
  )

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}