// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import React, { type ReactNode, useMemo, Component, ErrorInfo } from 'react'

const queryClient = new QueryClient()

// Global error handler for wallet SDK telemetry errors
if (typeof window !== 'undefined') {
  // Override console.error to suppress telemetry and WebSocket errors
  const originalConsoleError = console.error
  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('telemetry') || 
        message.includes('coinbase') || 
        message.includes('loadTelemetryScript') ||
        message.includes('WebSocket connection closed') ||
        message.includes('Unauthorized: origin not allowed')) {
      return // Suppress telemetry and WebSocket-related errors
    }
    originalConsoleError.apply(console, args)
  }
  
  // Enhanced error event listener
  window.addEventListener('error', (event) => {
    if (event.message?.includes('telemetry') || 
        event.filename?.includes('coinbase') || 
        event.message?.includes('loadTelemetryScript') ||
        event.error?.stack?.includes('coinbase') ||
        event.message?.includes('WebSocket connection closed') ||
        event.message?.includes('Unauthorized: origin not allowed')) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }, true)
  
  // Enhanced unhandled rejection listener
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('telemetry') || 
        event.reason?.stack?.includes('coinbase') ||
        event.reason?.message?.includes('loadTelemetryScript') ||
        event.reason?.message?.includes('WebSocket connection closed') ||
        event.reason?.message?.includes('Unauthorized: origin not allowed')) {
      event.preventDefault()
      event.stopPropagation()
      return false
    }
  }, true)
  
  // Additional global error suppression
  window.onerror = (message, source) => {
    const messageStr = typeof message === 'string' ? message : ''
    const sourceStr = typeof source === 'string' ? source : ''
    
    if (messageStr.includes('telemetry') || 
        sourceStr.includes('coinbase') || 
        messageStr.includes('loadTelemetryScript') ||
        messageStr.includes('WebSocket connection closed') ||
        messageStr.includes('Unauthorized: origin not allowed')) {
      return true // Prevent default error handling
    }
    return false
  }
}

// Initialize the AppKit modal once with comprehensive error handling
try {
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
    features: { 
      analytics: false, // Disable analytics to prevent telemetry errors
      email: false,
      socials: false,
      onramp: false,
      swaps: false
    },
    themeMode: 'dark', // Match the new Reown-style dark theme
    themeVariables: {
      '--w3m-color-mix': '#1f2937',
      '--w3m-color-mix-strength': 40,
      '--w3m-accent': '#3b82f6',
      '--w3m-border-radius-master': '12px',
      '--w3m-font-size-master': '14px',
      '--w3m-font-family': 'Inter, ui-sans-serif, system-ui',
    },
    // Additional configuration to prevent telemetry
    enableNetworkView: false,
    enableAccountView: false,
    enableExplorer: false
  })
} catch (error) {
  // Silently handle AppKit initialization errors
  if (process.env.NODE_ENV === 'development') {
    console.warn('AppKit initialization warning:', error)
  }
}

// Error Boundary for wallet-related errors
class WalletErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    // Check if it's a telemetry or WebSocket-related error
    if (error.message?.includes('telemetry') || 
        error.stack?.includes('coinbase') ||
        error.message?.includes('loadTelemetryScript') ||
        error.message?.includes('WebSocket connection closed') ||
        error.message?.includes('Unauthorized: origin not allowed')) {
      return { hasError: false } // Don't show error boundary for these errors
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log non-telemetry and non-WebSocket errors
    if (!error.message?.includes('telemetry') && 
        !error.stack?.includes('coinbase') &&
        !error.message?.includes('loadTelemetryScript') &&
        !error.message?.includes('WebSocket connection closed') &&
        !error.message?.includes('Unauthorized: origin not allowed')) {
      console.error('Wallet Error Boundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-4">Please refresh the page to try again</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

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
    <WalletErrorBoundary>
      <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </WagmiProvider>
    </WalletErrorBoundary>
  )
}
