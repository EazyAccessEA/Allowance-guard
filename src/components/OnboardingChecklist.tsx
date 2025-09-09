'use client'
import { load, save } from '@/lib/storage'
import { useEffect, useState } from 'react'
import { Wallet, Search, Save, Shield } from 'lucide-react'

type State = { connect: boolean; scan: boolean; save: boolean; revoke: boolean }
const KEY = 'ag.onboarding'

export default function OnboardingChecklist({
  isConnected,
  hadScan,
  hasSavedWallet,
  hadRevoke
}: {
  isConnected: boolean
  hadScan: boolean
  hasSavedWallet: boolean
  hadRevoke: boolean
}) {
  const [state, setState] = useState<State>(() => load<State>(KEY, { connect:false, scan:false, save:false, revoke:false }))

  useEffect(() => {
    const next: State = {
      connect: state.connect || isConnected,
      scan: state.scan || hadScan,
      save: state.save || hasSavedWallet,
      revoke: state.revoke || hadRevoke
    }
    setState(next); save(KEY, next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, hadScan, hasSavedWallet, hadRevoke])

  const Item = ({ done, label, step, icon: Icon }: { done: boolean; label: string; step: number; icon: React.ComponentType<{ className?: string }> }) => (
    <div className={`flex-shrink-0 w-56 sm:w-64 border-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm transition-all duration-200 rounded-full ${
      done 
        ? 'bg-emerald/10 text-emerald border-emerald' 
        : 'border-border bg-surface text-text'
    }`}>
      <div className="flex items-center">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
          done 
            ? 'bg-emerald text-white' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {done ? <Icon className="w-3 h-3 sm:w-4 sm:h-4" /> : <span className="text-xs font-bold">{step}</span>}
        </div>
        <span className="font-medium truncate">{label}</span>
      </div>
    </div>
  )

  const items = [
    { done: state.connect, label: "Connect your wallet", step: 1, icon: Wallet },
    { done: state.scan, label: "Run your first scan", step: 2, icon: Search },
    { done: state.save, label: "Save a wallet address", step: 3, icon: Save },
    { done: state.revoke, label: "Bulk revoke risky approvals", step: 4, icon: Shield }
  ]

  return (
    <div className="flex space-x-4 min-w-max">
      {/* First set of items */}
      {items.map((item, index) => (
        <Item key={`first-${index}`} {...item} />
      ))}
      {/* Duplicate set for continuous scroll */}
      {items.map((item, index) => (
        <Item key={`second-${index}`} {...item} />
      ))}
      {/* Third set to ensure seamless loop */}
      {items.map((item, index) => (
        <Item key={`third-${index}`} {...item} />
      ))}
    </div>
  )
}
