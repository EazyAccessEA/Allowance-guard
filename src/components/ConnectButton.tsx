'use client'
import { useConnect } from 'wagmi'
import { useMemo } from 'react'

type Variant = 'primary' | 'light' | 'ghost'

export default function ConnectButton({
  variant = 'primary',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  const { connectors, connect, isPending } = useConnect()

  const styles = useMemo(() => {
    const base = 'inline-flex items-center rounded-md px-5 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
    switch (variant) {
      case 'primary':
        return `${base} bg-ink text-white hover:opacity-90 focus:ring-ink/30`
      case 'light':
        return `${base} bg-white text-ink border border-line hover:bg-mist focus:ring-ink/20`
      case 'ghost':
        return `${base} bg-transparent text-ink hover:text-ink/80 focus:ring-ink/20`
      default:
        return base
    }
  }, [variant])

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className={`${styles} ${className}`}
      disabled={isPending}
    >
      {isPending ? 'Connecting…' : 'Connect Wallet'}
    </button>
  )
}
