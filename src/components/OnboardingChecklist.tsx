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

  const Item = ({ done, label }: { done: boolean; label: string }) => (
    <div className={`rounded-lg border px-4 py-3 text-sm transition-all duration-200 ${done ? 'bg-reown-success-50 border-reown-success-200 text-reown-success-700 dark:bg-reown-success-900/20 dark:border-reown-success-800 dark:text-reown-success-300' : 'border-reown-gray-200 bg-white text-reown-gray-700 dark:border-reown-gray-700 dark:bg-reown-gray-800 dark:text-reown-gray-300'}`}>
      <span className="mr-3 text-lg">{done ? '✅' : '⭕'}</span>{label}
    </div>
  )

  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold">Getting started</h2>
      <div className="mt-2 grid gap-2">
        <Item done={state.connect} label="Connect your wallet" />
        <Item done={state.scan} label="Run your first scan" />
        <Item done={state.save} label="Save a wallet address" />
        <Item done={state.revoke} label="Bulk revoke risky approvals (if any)" />
      </div>
    </section>
  )
}
