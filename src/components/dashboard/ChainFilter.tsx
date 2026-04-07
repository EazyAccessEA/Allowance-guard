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
                ? 'bg-primary-500 text-white border-primary-500 shadow-sm dark:bg-primary-600 dark:border-primary-600'
                : 'bg-background-primary dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400'
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
                    ? 'bg-white/20 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400'
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
