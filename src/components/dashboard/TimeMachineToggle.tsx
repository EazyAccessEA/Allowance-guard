'use client'

import React from 'react'
import { Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimeMachineToggleProps {
  enabled: boolean
  onToggle: () => void
}

export default function TimeMachineToggle({
  enabled,
  onToggle,
}: TimeMachineToggleProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-250',
        enabled
          ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
          : 'bg-background-primary dark:bg-dark-bg-secondary border-border-primary dark:border-secondary-700'
      )}
    >
      <button
        onClick={onToggle}
        role="switch"
        aria-checked={enabled}
        aria-label="Toggle Time Machine simulation"
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900',
          enabled
            ? 'bg-primary-500'
            : 'bg-secondary-300 dark:bg-secondary-600'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
            enabled ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>

      <div className="flex items-center gap-2">
        {enabled ? (
          <Zap className="h-4 w-4 text-primary-500" aria-hidden="true" />
        ) : (
          <Clock className="h-4 w-4 text-secondary-400" aria-hidden="true" />
        )}
        <span className="text-sm font-medium text-text-primary dark:text-secondary-200">
          Time Machine
        </span>
      </div>

      {enabled && (
        <span className="ml-auto text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
          Simulation Active
        </span>
      )}
    </div>
  )
}
