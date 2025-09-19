'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Professional badge variants following design system
const badgeVariants = cva(
  // Base styles - clean, minimal, status indicators
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-border-default bg-background-light text-text-primary',
        primary: 'border-primary/20 bg-primary/10 text-primary',
        success: 'border-semantic-success/20 bg-semanticBg-success text-semantic-success',
        danger: 'border-semantic-danger/20 bg-semanticBg-danger text-semantic-danger',
        warning: 'border-semantic-warning/20 bg-semanticBg-warning text-semantic-warning',
        info: 'border-semantic-info/20 bg-semanticBg-info text-semantic-info',
        outline: 'border-border-default text-text-primary bg-transparent',
        secondary: 'border-slate-200 bg-slate-100 text-slate-700',
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
    safe: { variant: 'success' as const, text: 'Safe' },
    risky: { variant: 'danger' as const, text: 'Risky' },
    unknown: { variant: 'warning' as const, text: 'Unknown' },
    revoked: { variant: 'secondary' as const, text: 'Revoked' },
  }

  const config = variants[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.text}
    </Badge>
  )
}

export const RiskBadge: React.FC<{
  risk: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}> = ({ risk, className }) => {
  const variants = {
    low: { variant: 'success' as const, text: 'Low Risk' },
    medium: { variant: 'warning' as const, text: 'Medium Risk' },
    high: { variant: 'danger' as const, text: 'High Risk' },
    critical: { variant: 'danger' as const, text: 'Critical Risk' },
  }

  const config = variants[risk]

  return (
    <Badge variant={config.variant} className={className}>
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
