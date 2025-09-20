'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/Button'

type Variant = 'primary' | 'secondary' | 'ghost'

export default function ConnectButton({
  variant = 'primary',
  size = 'default',
  className = '',
}: {
  variant?: Variant
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  className?: string
}) {
  const { isConnected, address } = useAccount()
  const [isConnecting, setIsConnecting] = useState(false)
  const [appKitReady, setAppKitReady] = useState(false)
  
  // Always call the hook, but handle errors gracefully
  let appKit = null
  try {
    appKit = useAppKit()
    if (appKit && !appKitReady) {
      setAppKitReady(true)
    }
  } catch (error) {
    // AppKit not initialized yet, will show loading state
    if (appKitReady) {
      setAppKitReady(false)
    }
  }

  const handleConnect = async () => {
    if (!appKit?.open) {
      console.warn('AppKit not ready for connection')
      return
    }
    
    try {
      setIsConnecting(true)
      await appKit.open()
    } catch (error) {
      // Silently handle connection errors - they're often just user cancellation
      console.warn('Connection cancelled or failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // If already connected, show wallet info
  if (isConnected && address) {
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-background-light rounded-base border border-border-default">
          <div className="w-2 h-2 bg-semantic-success rounded-full" />
          <span className="text-sm font-medium text-text-primary">
            {truncatedAddress}
          </span>
        </div>
        <Button
          variant="ghost"
          size={size}
          onClick={handleConnect}
          className="text-xs"
        >
          Change
        </Button>
      </div>
    )
  }

  // Show loading state if AppKit isn't ready
  if (!appKitReady || !appKit) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled
        className={className}
      >
        Loading...
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      loading={isConnecting}
      className={className}
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}