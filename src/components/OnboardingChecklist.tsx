'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { Wallet, Search, Save, Shield, Loader2 } from 'lucide-react'

interface OnboardingState {
  hadScan: boolean
  hasSavedWallet: boolean
  hadRevoke: boolean
}

export default function OnboardingChecklist() {
  const { isConnected } = useAccount()

  const { data: onboardingState, isLoading } = useQuery<OnboardingState>({
    queryKey: ['onboarding'],
    queryFn: () => fetch('/api/user/onboarding').then((r) => r.json()),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: { hadScan: false, hasSavedWallet: false, hadRevoke: false },
  })

  const state = {
    connect: isConnected,
    scan: onboardingState?.hadScan ?? false,
    save: onboardingState?.hasSavedWallet ?? false,
    revoke: onboardingState?.hadRevoke ?? false,
  }

  const Item = ({
    done,
    label,
    step,
    icon: Icon,
    description,
  }: {
    done: boolean
    label: string
    step: number
    icon: React.ComponentType<{ className?: string }>
    description: string
  }) => (
    <div
      className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
        done
          ? 'bg-emerald/10 text-emerald border-emerald dark:bg-emerald-900/20 dark:border-emerald-500'
          : 'border-border bg-background text-foreground dark:border-secondary-700 dark:bg-secondary-800'
      }`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            done
              ? 'bg-emerald text-white dark:bg-emerald-600'
              : 'bg-muted text-muted-foreground dark:bg-secondary-700 dark:text-secondary-400'
          }`}
        >
          {done ? (
            <Icon className="w-5 h-5" />
          ) : (
            <span className="text-sm font-bold">{step}</span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{label}</h3>
          <p className="text-muted-foreground text-sm dark:text-secondary-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  )

  const items = [
    {
      done: state.connect,
      label: 'Connect your wallet',
      step: 1,
      icon: Wallet,
      description:
        'Connect your wallet to start monitoring token approvals across all your addresses.',
    },
    {
      done: state.scan,
      label: 'Run your first scan',
      step: 2,
      icon: Search,
      description:
        'Scan your wallet to discover all existing token approvals and identify potential risks.',
    },
    {
      done: state.save,
      label: 'Save wallet addresses',
      step: 3,
      icon: Save,
      description:
        'Save frequently used wallet addresses for quick access and monitoring.',
    },
    {
      done: state.revoke,
      label: 'Revoke risky approvals',
      step: 4,
      icon: Shield,
      description:
        'Bulk revoke unlimited or stale approvals to secure your tokens.',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl border-2 border-border bg-background animate-pulse"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </div>
  )
}
