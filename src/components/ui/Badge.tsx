'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Badge variants with dark mode and dot indicators
const badgeVariants = cva(
  // Base styles with dark mode
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:focus:ring-offset-secondary-900',
  {
    variants: {
      variant: {
        default: 'border-border-default dark:border-secondary-600 bg-paper-sub text-ink',
        primary: 'border-primary/20 dark:border-primary-700 bg-primary/10 dark:bg-primary-900/30 text-primary dark:text-primary-300',
        success: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        danger: 'border-semantic-danger/20 dark:border-red-800 bg-semanticBg-danger dark:bg-red-900/30 text-semantic-danger dark:text-red-300',
        warning: 'border-semantic-warning/20 dark:border-amber-800 bg-semanticBg-warning dark:bg-amber-900/30 text-semantic-warning dark:text-amber-300',
        info: 'border-semantic-info/20 dark:border-sky-800 bg-semanticBg-info dark:bg-sky-900/30 text-semantic-info dark:text-sky-300',
        outline: 'border-border-default dark:border-secondary-600 text-ink bg-transparent',
        secondary: 'border-slate-200 dark:border-secondary-600 bg-slate-100 dark:bg-paper-sub text-ink-soft dark:text-ink-soft',
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
    safe: { variant: 'success' as const, text: 'Safe', dot: 'bg-green-500' },
    risky: { variant: 'danger' as const, text: 'Risky', dot: 'bg-red-500' },
    unknown: { variant: 'warning' as const, text: 'Unknown', dot: 'bg-amber-500' },
    revoked: { variant: 'secondary' as const, text: 'Revoked', dot: 'bg-slate-400' },
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
    low: { variant: 'success' as const, text: 'Low Risk', dot: 'bg-green-500' },
    medium: { variant: 'warning' as const, text: 'Medium Risk', dot: 'bg-amber-500' },
    high: { variant: 'danger' as const, text: 'High Risk', dot: 'bg-red-500' },
    critical: { variant: 'danger' as const, text: 'Critical Risk', dot: 'bg-red-600 animate-pulse' },
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
