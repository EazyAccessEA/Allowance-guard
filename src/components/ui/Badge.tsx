'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Badge — unified Ledger canon (ADR 0007). `dark:` branches stripped;
// off-canon `primary-*` / `green-*` / `red-*` / `slate-*` / `border-default`
// replaced with Ledger tokens and AA-tuned semantic ramps.
// `rounded-full` is permitted on small badges per DESIGN.md — the ban is on
// rounded-full on large *containers*.
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 font-plex text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-deep focus:ring-offset-2 focus:ring-offset-paper',
  {
    variants: {
      variant: {
        default: 'border-ink-rule bg-paper-sub text-ink',
        primary: 'border-amber-deep/40 bg-paper-sub text-amber-deep',
        success: 'border-semantic-success-600/40 bg-paper-sub text-semantic-success-700',
        danger: 'border-crimson-paper/40 bg-paper-sub text-crimson-paper',
        warning: 'border-semantic-warning-600/40 bg-paper-sub text-semantic-warning-700',
        info: 'border-ink-blue/30 bg-paper-sub text-ink-blue',
        outline: 'border-ink-rule text-ink bg-transparent',
        secondary: 'border-ink-rule bg-paper-sub text-ink-soft',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      interactive: {
        true: 'cursor-pointer hover:opacity-80',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    icon, 
    removable, 
    onRemove, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, interactive, className }))}
        ref={ref}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full hover:bg-black/10 p-0.5"
            aria-label="Remove badge"
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

// Specialized Badge Components
export const StatusBadge: React.FC<{
  status: 'safe' | 'risky' | 'unknown' | 'revoked'
  className?: string
}> = ({ status, className }) => {
  const variants = {
    safe: { variant: 'success' as const, text: 'Safe', dot: 'bg-semantic-success-600' },
    risky: { variant: 'danger' as const, text: 'Risky', dot: 'bg-crimson-paper' },
    unknown: { variant: 'warning' as const, text: 'Unknown', dot: 'bg-amber-deep' },
    revoked: { variant: 'secondary' as const, text: 'Revoked', dot: 'bg-ink-whisper' },
  }

  const config = variants[status]

  return (
    <Badge variant={config.variant} className={className}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} aria-hidden="true" />
      {config.text}
    </Badge>
  )
}

export const RiskBadge: React.FC<{
  risk: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}> = ({ risk, className }) => {
  const variants = {
    low: { variant: 'success' as const, text: 'Low Risk', dot: 'bg-semantic-success-600' },
    medium: { variant: 'warning' as const, text: 'Medium Risk', dot: 'bg-semantic-warning-600' },
    high: { variant: 'danger' as const, text: 'High Risk', dot: 'bg-crimson-paper' },
    critical: { variant: 'danger' as const, text: 'Critical Risk', dot: 'bg-crimson-paper animate-pulse' },
  }

  const config = variants[risk]

  return (
    <Badge variant={config.variant} className={className}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} aria-hidden="true" />
      {config.text}
    </Badge>
  )
}

export const ChainBadge: React.FC<{
  chain: string
  className?: string
}> = ({ chain, className }) => {
  // Chain-specific styling
  const getChainStyle = (chainName: string) => {
    const lower = chainName.toLowerCase()
    if (lower.includes('ethereum')) return { variant: 'primary' as const }
    if (lower.includes('base')) return { variant: 'info' as const }
    if (lower.includes('arbitrum')) return { variant: 'secondary' as const }
    return { variant: 'outline' as const }
  }

  const style = getChainStyle(chain)

  return (
    <Badge variant={style.variant} size="sm" className={className}>
      {chain}
    </Badge>
  )
}

export { Badge, badgeVariants }
