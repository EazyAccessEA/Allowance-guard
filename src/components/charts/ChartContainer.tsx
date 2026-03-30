'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  height?: string
  loading?: boolean
  error?: string
  actions?: React.ReactNode
}

export function ChartContainer({
  children,
  title,
  subtitle,
  className,
  height = 'h-64',
  loading = false,
  error,
  actions
}: ChartContainerProps) {
  if (loading) {
    return (
      <div className={cn('mobbin-card', className)}>
        <div className="p-6">
          <div className="animate-pulse">
            {title && <div className="h-5 bg-neutral-200 rounded w-48 mb-2" />}
            {subtitle && <div className="h-4 bg-neutral-100 rounded w-64 mb-4" />}
            <div className={cn('bg-neutral-100 rounded-lg', height)} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('mobbin-card border-semantic-error-200 bg-semantic-error-50', className)}>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-semantic-error-500 rounded-full" />
            <h3 className="mobbin-heading-4 text-semantic-error-700">Chart Error</h3>
          </div>
          <p className="mobbin-body-small text-semantic-error-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('mobbin-card', className)}>
      <div className="p-6">
        {(title || subtitle || actions) && (
          <div className="flex items-start justify-between mb-6">
            <div>
              {title && <h3 className="mobbin-heading-4 text-text-primary mb-1">{title}</h3>}
              {subtitle && <p className="mobbin-body-small text-text-secondary">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        )}
        <div className={cn('relative', height)}>
          {children}
        </div>
      </div>
    </div>
  )
}
