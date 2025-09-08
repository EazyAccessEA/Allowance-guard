// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import React, { type ReactNode, useMemo } from 'react'

const queryClient = new QueryClient()

// Initialize the AppKit modal once
createAppKit({
  adapters: [wagmiAdapter],
  projectId: projectId!,
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet,
  metadata: {
    name: 'Allowance Guard',
    description: 'Allowance monitoring & revocation',
    url: 'https://allowanceguard.com',
    icons: ['https://allowanceguard.com/icon.png']
  },
  features: { analytics: true },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#3b82f6',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#14b8a6',
    '--w3m-border-radius-master': '8px',
    '--w3m-font-size-master': '14px',
    '--w3m-font-family': 'Inter, ui-sans-serif, system-ui',
  }
})

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
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
