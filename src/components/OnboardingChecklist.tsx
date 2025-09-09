'use client'
import { load, save } from '@/lib/storage'
import { useEffect, useState } from 'react'
import { Wallet, Search, Save, Shield } from 'lucide-react'

type State = { connect: boolean; scan: boolean; save: boolean; revoke: boolean }
const KEY = 'ag.onboarding'

export default function OnboardingChecklist() {
  const [state, setState] = useState<State>(() => load<State>(KEY, { connect:false, scan:false, save:false, revoke:false }))

  // For now, we'll use mock data since the component is used in the new page structure
  // In a real implementation, you'd pass these props from the parent
  const isConnected = false
  const hadScan = false
  const hasSavedWallet = false
  const hadRevoke = false

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

  const Item = ({ done, label, step, icon: Icon, description }: { done: boolean; label: string; step: number; icon: React.ComponentType<{ className?: string }>; description: string }) => (
    <div className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
      done 
        ? 'bg-emerald/10 text-emerald border-emerald' 
        : 'border-border bg-background text-foreground'
    }`}>
      <div className="flex items-start space-x-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          done 
            ? 'bg-emerald text-white' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {done ? <Icon className="w-5 h-5" /> : <span className="text-sm font-bold">{step}</span>}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{label}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </div>
  )

  const items = [
    { 
      done: state.connect, 
      label: "Connect your wallet", 
      step: 1, 
      icon: Wallet,
      description: "Connect your wallet to start monitoring token approvals across all your addresses."
    },
    { 
      done: state.scan, 
      label: "Run your first scan", 
      step: 2, 
      icon: Search,
      description: "Scan your wallet to discover all existing token approvals and identify potential risks."
    },
    { 
      done: state.save, 
      label: "Save wallet addresses", 
      step: 3, 
      icon: Save,
      description: "Save frequently used wallet addresses for quick access and monitoring."
    },
    { 
      done: state.revoke, 
      label: "Revoke risky approvals", 
      step: 4, 
      icon: Shield,
      description: "Bulk revoke unlimited or stale approvals to secure your tokens."
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((item, index) => (
        <Item key={index} {...item} />
      ))}
    </div>
  )
}
