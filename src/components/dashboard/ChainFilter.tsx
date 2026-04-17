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
 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep0 focus-visible:ring-offset-2 ',
 isActive
 ? 'bg-amber-deep text-ink border-amber-deep/40 shadow-sm '
 : 'bg-paper-sub text-ink-muted border-ink-rule hover:border-amber-deep/40 hover:text-amber-deep '
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
 : 'bg-paper-sub text-ink-whisper '
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
