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
 ? 'bg-paper-sub border-amber-deep/40 '
 : 'bg-paper border-ink-rule'
 )}
 >
 <button
 onClick={onToggle}
 role="switch"
 aria-checked={enabled}
 aria-label="Toggle Time Machine simulation"
 className={cn(
 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-deep0 focus-visible:ring-offset-2 ',
 enabled
 ? 'bg-amber-deep'
 : 'bg-ink '
 )}
 >
 <span
 className={cn(
 'inline-block h-4 w-4 transform rounded-full bg-paper shadow-sm transition-transform duration-200',
 enabled ? 'translate-x-6' : 'translate-x-1'
 )}
 />
 </button>

 <div className="flex items-center gap-2">
 {enabled ? (
 <Zap className="h-4 w-4 text-amber-deep" aria-hidden="true" />
 ) : (
 <Clock className="h-4 w-4 text-ink-muted" aria-hidden="true" />
 )}
 <span className="text-sm font-medium text-ink">
 Time Machine
 </span>
 </div>

 {enabled && (
 <span className="ml-auto text-xs font-medium text-amber-deep bg-paper-sub px-2 py-0.5 rounded-full">
 Simulation Active
 </span>
 )}
 </div>
 )
}
