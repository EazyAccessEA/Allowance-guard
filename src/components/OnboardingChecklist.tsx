'use client'
import { load, save } from '@/lib/storage'
import { useEffect, useState } from 'react'

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

  const Item = ({ done, label, step }: { done: boolean; label: string; step: number }) => (
    <div className={`flex-shrink-0 w-64 border-2 px-4 py-3 text-sm transition-all duration-200 rounded-md ${
      done 
        ? 'bg-emerald/10 text-emerald border-emerald' 
        : 'border-border bg-surface text-text'
    }`}>
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${
          done 
            ? 'bg-emerald text-white' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {done ? '✓' : step}
        </div>
        <span className="font-medium">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="flex space-x-4 min-w-max">
      <Item done={state.connect} label="Connect your wallet" step={1} />
      <Item done={state.scan} label="Run your first scan" step={2} />
      <Item done={state.save} label="Save a wallet address" step={3} />
      <Item done={state.revoke} label="Bulk revoke risky approvals" step={4} />
    </div>
  )
}
