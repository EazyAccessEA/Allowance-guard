'use client'

import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/Button'

// Dynamically import ConnectButton to prevent SSR issues
const ConnectButton = dynamic(() => import('@/components/ConnectButton'), {
  ssr: false,
  loading: () => (
    <Button variant="primary" disabled>
      Connect Wallet
    </Button>
  )
})

type Variant = 'primary' | 'secondary' | 'ghost'

export default function ClientConnectButton({
  variant = 'primary',
  size = 'default',
  className = '',
}: {
  variant?: Variant
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl'
  className?: string
}) {
  return (
    <ConnectButton 
      variant={variant}
      size={size}
      className={className}
    />
  )
}
