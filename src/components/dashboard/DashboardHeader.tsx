'use client'

import React from 'react'
import { Shield, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardHeaderProps {
 walletAddress?: string
 chain?: string
}

export default function DashboardHeader({
 walletAddress = '0x1a2B...3c4D',
 chain = 'Ethereum',
}: DashboardHeaderProps) {
 return (
 <header className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-ink-rule bg-paper">
 {/* Logo */}
 <div className="flex items-center gap-2">
 <Shield
 className="h-7 w-7 text-amber-deep"
 aria-hidden="true"
 />
 <span className="text-lg font-semibold tracking-tight text-ink">
 AllowanceGuard
 </span>
 </div>

 {/* Nav links */}
 <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
 {['Dashboard', 'Features', 'Docs', 'Pricing'].map((item) => (
 <button
 key={item}
 className={cn(
 'text-sm font-medium transition-colors duration-150',
 item === 'Dashboard'
 ? 'text-amber-deep '
 : 'text-ink-whisper hover:text-ink-muted '
 )}
 >
 {item}
 </button>
 ))}
 </nav>

 {/* Wallet state */}
 <div className="flex items-center gap-3">
 <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-paper-sub text-amber-deep border border-amber-deep/40">
 <span
 className="w-2 h-2 rounded-full bg-semantic-success-500"
 aria-hidden="true"
 />
 {chain}
 </span>
 <button
 className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono text-ink bg-paper-sub border border-ink-rule hover:border-amber-deep/40 transition-colors duration-150"
 aria-label={`Connected wallet ${walletAddress}`}
 >
 {walletAddress}
 <ChevronDown className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
 </button>
 <button
 className="p-2 rounded-lg text-ink-muted hover:text-ink-muted hover:bg-paper-sub transition-colors duration-150"
 aria-label="Disconnect wallet"
 >
 <LogOut className="h-4 w-4" />
 </button>
 </div>
 </header>
 )
}
