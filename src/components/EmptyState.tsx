'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  /** Primary action button */
  action?: {
    label: string
    onClick?: () => void
    href?: string
  } | null
  /** Show an upgrade prompt for locked features */
  upgradePlan?: 'pro' | 'sentinel'
  className?: string
  /** Positive empty state (e.g., "No approvals found — you're safe!") */
  positive?: boolean
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  upgradePlan,
  className,
  positive = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-2xl mb-5',
          positive
            ? 'bg-paper-sub border border-semantic-success-600/40 text-semantic-success-700'
            : 'bg-paper-sub border border-ink-rule text-ink-whisper',
        )}
      >
        {icon}
      </div>

      <h3
        className={cn(
          'text-lg font-semibold mb-2',
          positive
            ? 'text-semantic-success-700'
            : 'text-ink',
        )}
      >
        {title}
      </h3>

      <p className="text-sm text-ink-muted max-w-sm mb-6">
        {description}
      </p>

      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-deep px-4 py-2 text-sm font-medium text-paper shadow-sm hover:bg-amber-deep/90 transition-colors"
          >
            {action.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : action.onClick ? (
          <Button onClick={action.onClick} variant="primary" size="sm">
            {action.label}
          </Button>
        ) : null
      )}

      {upgradePlan && (
        <Link
          href="/pricing"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-amber-deep hover:underline transition-colors"
        >
          Upgrade to {upgradePlan === 'sentinel' ? 'Sentinel' : 'Pro'} to unlock
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}
