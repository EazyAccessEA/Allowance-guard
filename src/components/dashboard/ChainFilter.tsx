'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { CHAINS, CHAIN_COLORS, type Chain } from './mock-data'

interface ChainFilterProps {
  active: Chain
  onChange: (chain: Chain) => void
  counts?: Record<string, number>
}

export default function ChainFilter({ active, onChange, counts }: ChainFilterProps) {
  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
      aria-label="Filter by chain"
    >
      {CHAINS.map((chain) => {
        const isActive = active === chain
        const count = counts?.[chain]
        const dotColor = chain !== 'All' ? CHAIN_COLORS[chain] : undefined

        return (
          <button
            key={chain}
            onClick={() => onChange(chain)}
            aria-pressed={isActive}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap',
              'transition-all duration-150 border',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-secondary-900',
              isActive
                ? 'bg-primary-500 text-ink border-primary-500 shadow-sm dark:bg-primary-600 dark:border-primary-600'
                : 'bg-paper-sub text-secondary-600 dark:text-ink-soft border-ink-rule hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            {dotColor && !isActive && (
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: dotColor }}
                aria-hidden="true"
              />
            )}
            {chain}
            {count !== undefined && (
              <span
                className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-paper-sub text-ink'
                    : 'bg-secondary-100 dark:bg-paper-sub text-ink-whisper dark:text-ink-muted'
                )}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
