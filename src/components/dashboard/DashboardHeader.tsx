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
    <header className="flex items-center justify-between px-4 lg:px-6 h-16 border-b border-border-primary dark:border-secondary-700 bg-background-primary dark:bg-dark-bg-secondary">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Shield
          className="h-7 w-7 text-primary-500"
          aria-hidden="true"
        />
        <span className="text-lg font-semibold tracking-tight text-text-primary dark:text-secondary-100">
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
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-secondary-500 hover:text-text-primary dark:text-secondary-400 dark:hover:text-secondary-200'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Wallet state */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-800">
          <span
            className="w-2 h-2 rounded-full bg-semantic-success-500"
            aria-hidden="true"
          />
          {chain}
        </span>
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono text-text-primary dark:text-secondary-200 bg-secondary-50 dark:bg-secondary-800 border border-border-primary dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-150"
          aria-label={`Connected wallet ${walletAddress}`}
        >
          {walletAddress}
          <ChevronDown className="h-3.5 w-3.5 text-secondary-400" aria-hidden="true" />
        </button>
        <button
          className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors duration-150"
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
