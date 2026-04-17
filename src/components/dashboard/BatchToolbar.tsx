'use client'

import React from 'react'
import { Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BatchToolbarProps {
 count: number
 onRevoke: () => void
 onClear: () => void
}

export default function BatchToolbar({ count, onRevoke, onClear }: BatchToolbarProps) {
 if (count === 0) return null

 return (
 <div
 className={cn(
 'fixed bottom-4 left-1/2 -translate-x-1/2 z-40',
 'flex items-center gap-3 px-4 py-3 rounded-xl',
 'bg-paper-deep text-ink ',
 'shadow-large border border-ink-rule ',
 'animate-in slide-in-from-bottom-4 duration-200'
 )}
 role="toolbar"
 aria-label="Batch actions"
 >
 <span className="text-sm font-medium whitespace-nowrap">
 <span className="font-mono font-semibold">{count}</span> selected
 </span>

 <div className="w-px h-5 bg-paper-sub" aria-hidden="true" />

 <button
 onClick={onRevoke}
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-semantic-error-500 text-ink hover:bg-semantic-error-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-error-400 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-900"
 >
 <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
 Revoke Selected
 </button>

 <button
 onClick={onClear}
 className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-paper-sub transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-rule"
 aria-label="Clear selection"
 >
 <X className="h-4 w-4" />
 </button>
 </div>
 )
}
