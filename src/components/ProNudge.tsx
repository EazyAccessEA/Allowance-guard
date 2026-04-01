'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Bell, Layers, FileDown, Mail, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProNudgeProps {
  variant: 'monitoring' | 'batch-revoke' | 'export' | 'alerts'
  className?: string
}

const nudgeConfig = {
  monitoring: {
    icon: Bell,
    message: 'Get notified when new approvals appear',
    borderColor: 'border-l-primary-500',
    iconColor: 'text-primary-600 dark:text-primary-400',
    bgColor: 'bg-primary-50 dark:bg-primary-900/20',
  },
  'batch-revoke': {
    icon: Layers,
    message: 'Revoke multiple approvals in one click',
    borderColor: 'border-l-semantic-info-500',
    iconColor: 'text-semantic-info-600 dark:text-semantic-info-400',
    bgColor: 'bg-semantic-info-50 dark:bg-semantic-info-900/20',
  },
  export: {
    icon: FileDown,
    message: 'Export your security audit as PDF/CSV',
    borderColor: 'border-l-semantic-success-500',
    iconColor: 'text-semantic-success-600 dark:text-semantic-success-400',
    bgColor: 'bg-semantic-success-50 dark:bg-semantic-success-900/20',
  },
  alerts: {
    icon: Mail,
    message: 'Set up email alerts for risky approvals',
    borderColor: 'border-l-semantic-warning-500',
    iconColor: 'text-semantic-warning-600 dark:text-semantic-warning-400',
    bgColor: 'bg-semantic-warning-50 dark:bg-semantic-warning-900/20',
  },
} as const

export const ProNudge: React.FC<ProNudgeProps> = ({ variant, className }) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return null
  }

  const config = nudgeConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-md border border-l-4 px-4 py-3',
        config.borderColor,
        config.bgColor,
        'border-neutral-200 dark:border-secondary-700',
        className
      )}
      role="complementary"
      aria-label={`Pro feature: ${config.message}`}
    >
      <Icon className={cn('h-5 w-5 shrink-0', config.iconColor)} />

      <p className="flex-1 text-sm text-neutral-700 dark:text-secondary-200">{config.message}</p>

      <Link
        href="/pricing"
        className="shrink-0 text-sm font-medium text-primary-700 dark:text-primary-400 transition-colors duration-150 hover:text-primary-800 dark:hover:text-primary-300 hover:underline"
      >
        Learn more
      </Link>

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-full p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-400 dark:text-secondary-500 transition-colors duration-150 hover:bg-neutral-200 dark:hover:bg-secondary-700 hover:text-neutral-600 dark:hover:text-secondary-300"
        aria-label="Dismiss nudge"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default ProNudge
