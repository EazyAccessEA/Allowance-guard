'use client'
import { useAccount } from 'wagmi'
import { useMemo, useState } from 'react'
import { useAppKit } from '@reown/appkit/react'

type Variant = 'primary' | 'light' | 'ghost'

export default function ConnectButton({
  variant = 'primary',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const { isConnected, address } = useAccount()
  const { open } = useAppKit()
  const [isConnecting, setIsConnecting] = useState(false)

  const styles = useMemo(() => {
    const base = 'inline-flex items-center rounded-lg px-6 py-3 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    switch (variant) {
      case 'primary':
        return `${base} bg-black text-white hover:bg-gray-800 focus:ring-gray-500/30`
      case 'light':
        return `${base} bg-white text-ink border border-line hover:bg-mist focus:ring-ink/20`
      case 'ghost':
        return `${base} bg-transparent text-ink hover:text-ink/80 focus:ring-ink/20`
      default:
        return base
    }
  }, [variant])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await open()
    } catch (error) {
      // Silently handle connection errors - they're often just user cancellation
      console.warn('Connection cancelled or failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  // If already connected, show truncated address
  if (isConnected && address) {
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    return (
      <div className={`${styles} ${className} cursor-default`}>
        {truncatedAddress}
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className={`${styles} ${className}`}
      disabled={isConnecting}
    >
      {isConnecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  )
}