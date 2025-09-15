'use client'
import { useEffect, useState } from 'react'

export default function RpcStatusBanner() {
  const [bad, setBad] = useState(false)
  
  useEffect(() => {
    let t: NodeJS.Timeout
    
    const ping = async () => {
      try { 
        const r = await fetch('/api/healthz', { cache: 'no-store' })
        const j = await r.json()
        setBad(!j.ok || String(j.checks?.rpc || '').startsWith('fail'))
      } catch { 
        setBad(true) 
      }
      t = setTimeout(ping, 30000) // Check every 30 seconds
    }
    
    ping()
    return () => clearTimeout(t)
  }, [])
  
  if (!bad) return null
  
  return (
    <div className="bg-amber-50 text-amber-800 text-sm px-3 py-2 border-b border-amber-200">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <span className="font-medium">⚠️ Network is degraded (RPC problems).</span>
        <span className="ml-2">Scans/reads may be slow; we&apos;ll retry automatically.</span>
      </div>
    </div>
  )
}
