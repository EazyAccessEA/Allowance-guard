'use client'

import React from 'react'
import { Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanBadgeProps {
  plan: 'free' | 'pro' | 'sentinel'
  size?: 'sm' | 'md'
  className?: string
}

const planConfig = {
  free: {
    label: 'Free',
    icon: null,
    classes: 'border-slate-600 bg-paper-sub text-ink-muted',
  },
  pro: {
    label: 'Pro',
    icon: Sparkles,
    classes: 'border-amber-500/30 bg-amber-500/10 text-amber-deep',
  },
  sentinel: {
    label: 'Sentinel',
    icon: Crown,
    classes: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
  },
} as const

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
} as const

const iconSizes = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
} as const

export const PlanBadge: React.FC<PlanBadgeProps> = ({
  plan,
  size = 'sm',
  className,
}) => {
  const config = planConfig[plan]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors duration-150',
        config.classes,
        sizeClasses[size],
        className
      )}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  )
}

export default PlanBadge
