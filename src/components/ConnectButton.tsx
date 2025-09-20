'use client'

import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/Button'

type Variant = 'primary' | 'secondary' | 'ghost'

// Inner component that uses AppKit hook
function ConnectButtonInner({
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
  
  // Call the hook normally - if AppKit isn't initialized, it will throw an error
  // We'll handle this at the component level by wrapping the entire component
  const appKit = useAppKit()

  const handleConnect = async () => {
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

// Wrapper component that handles AppKit initialization errors
export default function ConnectButton(props: {
  variant?: Variant
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  className?: string
}) {
  try {
    return <ConnectButtonInner {...props} />
  } catch (error) {
    // AppKit not initialized yet, show loading state
    return (
      <Button
        variant={props.variant || 'primary'}
        size={props.size || 'default'}
        disabled
        className={props.className || ''}
      >
        Loading...
      </Button>
    )
  }
}