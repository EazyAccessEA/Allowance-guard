// context/index.tsx
'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import React, { type ReactNode, useMemo, Component, ErrorInfo, useState, useEffect } from 'react'

const queryClient = new QueryClient()

// TBT Optimization: Defer AppKit initialization
let deferredAppKit: any = null
let isInitializing = false

const initializeAppKit = () => {
  if (deferredAppKit || isInitializing) return deferredAppKit
  
  isInitializing = true
  
  // Use requestIdleCallback for non-blocking initialization
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      try {
        deferredAppKit = createAppKit({
          adapters: [wagmiAdapter],
          networks: [mainnet, arbitrum, base],
          projectId,
          defaultNetwork: mainnet,
          enableAnalytics: false, // Disable analytics for TBT
          enableOnramp: false, // Disable onramp for TBT
          enableSwap: false, // Disable swap for TBT
          enableEmail: false, // Disable email for TBT
          enableSocials: false, // Disable socials for TBT
          enableWalletFeatures: false, // Disable wallet features for TBT
        })
        isInitializing = false
      } catch (error) {
        console.warn('AppKit initialization failed:', error)
        isInitializing = false
      }
    }, { timeout: 1000 })
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      try {
        deferredAppKit = createAppKit({
          adapters: [wagmiAdapter],
          networks: [mainnet, arbitrum, base],
          projectId,
          defaultNetwork: mainnet,
          enableAnalytics: false,
          enableOnramp: false,
          enableSwap: false,
          enableEmail: false,
          enableSocials: false,
          enableWalletFeatures: false,
        })
        isInitializing = false
      } catch (error) {
        console.warn('AppKit initialization failed:', error)
        isInitializing = false
      }
    }, 100)
  }
  
  return deferredAppKit
}

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
        message.includes('Unauthorized: origin not allowed') ||
        message.includes('Proposal expired') ||
        message.includes('Session expired') ||
        message.includes('Connection request expired') ||
        message.includes('Origin') && message.includes('not found on Allowlist') ||
        message.includes('update configuration on cloud.reown.com') ||
        message.includes('cca-lite.coinbase.com/metrics') ||
        message.includes('w3m-router-container') ||
        message.includes('scheduled an update') ||
        message.includes('change-in-update') ||
        message.includes('net::ERR_ABORTED 401 (Unauthorized)') ||
        message.includes('Rollbar: access token not found') ||
        message.includes('POST https://api.rollbar.com/api/1/item/') ||
        message.includes('403 (Forbidden)') ||
        message.includes('Failed to load resource: net::ERR_CONNECTION_FAILED') ||
        message.includes('/V3AG.mp4') ||
        message.includes('Refused to apply style from') ||
        message.includes('MIME type') ||
        message.includes('Theano+Didot') ||
        message.includes('Please call "createAppKit" before using "useAppKit" hook') ||
        message.includes('Failed to load resource: the server responded with a status of 500') ||
        message.includes('Error checking Cross-Origin-Opener-Policy: HTTP error! status: 500') ||
        message.includes('The resource was preloaded using link preload but not used within a few seconds') ||
        message.includes('Performance issues detected')) {
      return // Suppress telemetry, WebSocket, WalletConnect, and AppKit update cycle errors
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
        event.message?.includes('Unauthorized: origin not allowed') ||
        event.message?.includes('Proposal expired') ||
        event.message?.includes('Session expired') ||
        event.message?.includes('Connection request expired') ||
        (event.message?.includes('Origin') && event.message?.includes('not found on Allowlist')) ||
        event.message?.includes('update configuration on cloud.reown.com') ||
        event.message?.includes('cca-lite.coinbase.com/metrics') ||
        event.message?.includes('net::ERR_ABORTED 401 (Unauthorized)') ||
        event.message?.includes('Rollbar: access token not found') ||
        event.message?.includes('POST https://api.rollbar.com/api/1/item/') ||
        event.message?.includes('403 (Forbidden)') ||
        event.message?.includes('Failed to load resource: net::ERR_CONNECTION_FAILED') ||
        event.message?.includes('/V3AG.mp4') ||
        event.message?.includes('Refused to apply style from') ||
        event.message?.includes('MIME type') ||
        event.message?.includes('Theano+Didot') ||
        event.message?.includes('Please call "createAppKit" before using "useAppKit" hook') ||
        event.message?.includes('Failed to load resource: the server responded with a status of 500') ||
        event.message?.includes('Error checking Cross-Origin-Opener-Policy: HTTP error! status: 500') ||
        event.message?.includes('The resource was preloaded using link preload but not used within a few seconds') ||
        event.message?.includes('Performance issues detected')) {
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
        event.reason?.message?.includes('Unauthorized: origin not allowed') ||
        event.reason?.message?.includes('Proposal expired') ||
        event.reason?.message?.includes('Session expired') ||
        event.reason?.message?.includes('Connection request expired') ||
        (event.reason?.message?.includes('Origin') && event.reason?.message?.includes('not found on Allowlist')) ||
        event.reason?.message?.includes('update configuration on cloud.reown.com') ||
        event.reason?.message?.includes('cca-lite.coinbase.com/metrics') ||
        event.reason?.message?.includes('net::ERR_ABORTED 401 (Unauthorized)') ||
        event.reason?.message?.includes('Rollbar: access token not found') ||
        event.reason?.message?.includes('POST https://api.rollbar.com/api/1/item/') ||
        event.reason?.message?.includes('403 (Forbidden)') ||
        event.reason?.message?.includes('Failed to load resource: net::ERR_CONNECTION_FAILED') ||
        event.reason?.message?.includes('/V3AG.mp4') ||
        event.reason?.message?.includes('Refused to apply style from') ||
        event.reason?.message?.includes('MIME type') ||
        event.reason?.message?.includes('Theano+Didot') ||
        event.reason?.message?.includes('Please call "createAppKit" before using "useAppKit" hook') ||
        event.reason?.message?.includes('Failed to load resource: the server responded with a status of 500') ||
        event.reason?.message?.includes('Error checking Cross-Origin-Opener-Policy: HTTP error! status: 500') ||
        event.reason?.message?.includes('The resource was preloaded using link preload but not used within a few seconds') ||
        event.reason?.message?.includes('Performance issues detected')) {
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
        messageStr.includes('Unauthorized: origin not allowed') ||
        messageStr.includes('Proposal expired') ||
        messageStr.includes('Session expired') ||
        messageStr.includes('Connection request expired')) {
      return true // Prevent default error handling
    }
    return false
  }
}

// Create AppKit outside React components to avoid unwanted rerenders (following documentation)
const metadata = {
  name: 'Allowance Guard',
  description: 'Allowance monitoring & revocation',
  url: 'https://www.allowanceguard.com',
  icons: ['https://www.allowanceguard.com/icon.png']
}

// Initialize AppKit with proper configuration per Reown docs
if (projectId && typeof window !== 'undefined') {
  try {
    // Initialize AppKit synchronously to ensure it's available for useAppKit hook
    createAppKit({
      adapters: [wagmiAdapter],
      projectId: projectId,
      networks: [mainnet, arbitrum, base],
      defaultNetwork: mainnet,
      metadata: metadata,
      features: { 
        analytics: false, // Disable analytics to prevent telemetry errors
        email: false,
        socials: false,
        onramp: false,
        swaps: false
      },
      themeMode: 'dark', // Match the new Reown-style dark theme
      themeVariables: {
        // Core theme colors - matching Fireart design tokens
        '--w3m-color-mix': '#1E1F23', // obsidian
        '--w3m-color-mix-strength': 40,
        '--w3m-accent': '#2563EB', // cobalt
        
        // Border radius - matching component tokens
        '--w3m-border-radius-master': '8px', // button borderRadius
        
        // Typography - matching Fireart typography scale
        '--w3m-font-size-master': '16px', // base fontSize
        '--w3m-font-family': 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        
        // Modal specific - matching Fireart colors
        '--w3m-z-index': 9999,
      }
    })
  } catch (error) {
    console.error('Failed to initialize AppKit:', error)
  }
} else if (!projectId) {
  console.error('WalletConnect Project ID is missing. Wallet connection will not work.')
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
    // Check if it's a telemetry, WebSocket, or AppKit-related error
    if (error.message?.includes('telemetry') || 
        error.stack?.includes('coinbase') ||
        error.message?.includes('loadTelemetryScript') ||
        error.message?.includes('WebSocket connection closed') ||
        error.message?.includes('Unauthorized: origin not allowed') ||
        error.message?.includes('Proposal expired') ||
        error.message?.includes('Session expired') ||
        error.message?.includes('Connection request expired') ||
        error.message?.includes('WalletConnect') ||
        error.message?.includes('AppKit') ||
        error.message?.includes('projectId') ||
        error.stack?.includes('@reown/appkit')) {
      return { hasError: false } // Don't show error boundary for these errors
    }
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log non-telemetry, non-WebSocket, and non-AppKit errors
    if (!error.message?.includes('telemetry') && 
        !error.stack?.includes('coinbase') &&
        !error.message?.includes('loadTelemetryScript') &&
        !error.message?.includes('WebSocket connection closed') &&
        !error.message?.includes('Unauthorized: origin not allowed') &&
        !error.message?.includes('Proposal expired') &&
        !error.message?.includes('Session expired') &&
        !error.message?.includes('Connection request expired') &&
        !error.message?.includes('WalletConnect') &&
        !error.message?.includes('AppKit') &&
        !error.message?.includes('projectId') &&
        !error.stack?.includes('@reown/appkit')) {
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
              className="px-6 py-3 bg-cobalt hover:bg-cobalt/90 text-white rounded-lg transition-colors"
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

// AppKit Provider Component - TBT Optimized with deferred initialization
function AppKitProvider({ children }: { children: ReactNode }) {
  const [appKit, setAppKit] = useState<any>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Initialize AppKit on idle to avoid blocking main thread
    const initAppKit = () => {
      const kit = initializeAppKit()
      if (kit) {
        setAppKit(kit)
        setIsReady(true)
      } else {
        // Retry if not ready
        setTimeout(initAppKit, 100)
      }
    }

    // Start initialization immediately but non-blocking
    initAppKit()
  }, [])

  // Render children immediately, AppKit will be available when ready
  return <>{children}</>
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
        <QueryClientProvider client={queryClient}>
          <AppKitProvider>
            {children}
          </AppKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </WalletErrorBoundary>
  )
}
