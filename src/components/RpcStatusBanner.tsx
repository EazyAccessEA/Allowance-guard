'use client'
import { useEffect, useState, useRef } from 'react'

export default function RpcStatusBanner() {
  const [bad, setBad] = useState(false)
  const failCount = useRef(0)

  useEffect(() => {
    let t: NodeJS.Timeout

    const ping = async () => {
      try {
        const r = await fetch('/api/healthz', { cache: 'no-store' })
        if (r.ok) {
          const j = await r.json()
          const rpcBad = String(j.checks?.rpc || '').startsWith('fail') ||
                 Object.values(j.checks?.chains || {}).some((status: unknown) => String(status).startsWith('fail'))
          setBad(rpcBad)
          failCount.current = rpcBad ? failCount.current + 1 : 0
        } else {
          failCount.current++
          setBad(true)
        }
      } catch {
        failCount.current++
        setBad(true)
      }
      // Back off: 30s → 60s → 120s → max 5min on repeated failures
      const delay = Math.min(30000 * Math.pow(2, Math.min(failCount.current, 4)), 300000)
      t = setTimeout(ping, delay)
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
