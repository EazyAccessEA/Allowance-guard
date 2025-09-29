'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useState } from 'react'
import { useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/Button'

type Variant = 'primary' | 'secondary' | 'ghost'

// ConnectButton component using AppKit per Reown documentation
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
  const { disconnect } = useDisconnect()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  
  // Use AppKit hook per Reown documentation
  const { open } = useAppKit()

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      console.log('Attempting to open wallet connection...')
      console.log('AppKit open function available:', typeof open)
      console.log('User agent:', navigator.userAgent)
      console.log('Network status:', navigator.onLine)
      
      await open()
      console.log('Wallet connection opened successfully')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        cause: error instanceof Error ? (error as Error & { cause?: unknown }).cause : undefined
      })
      
      // More specific error messages
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('User rejected')) {
        alert('Connection cancelled by user.')
      } else if (errorMessage.includes('network')) {
        alert('Network error. Please check your internet connection and try again.')
      } else {
        alert(`Wallet connection failed: ${errorMessage || 'Unknown error'}. Please try again.`)
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true)
      await disconnect()
    } catch (error) {
      console.warn('Disconnect failed:', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  // If already connected, show wallet info with disconnect option
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size={size}
            onClick={handleConnect}
            className="text-xs"
          >
            Change
          </Button>
          <Button
            variant="ghost"
            size={size}
            onClick={handleDisconnect}
            loading={isDisconnecting}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </div>
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
