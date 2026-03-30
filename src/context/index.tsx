'use client'

import { wagmiAdapter } from '../../appkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, type Config } from 'wagmi'
import React, { type ReactNode } from 'react'

const queryClient = new QueryClient()

export default function ContextProvider({
  children
}: {
  children: ReactNode
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}