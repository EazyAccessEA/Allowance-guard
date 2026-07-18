'use client'
import { useEffect, useState, useRef } from 'react'

export default function RpcStatusBanner() {
  const [bad, setBad] = useState(false)
  const failCount = useRef(0)

  useEffect(() => {
    let t: NodeJS.Timeout
    const MAX_CONSECUTIVE_FAILS = 10 // stop after ~30min of backoff
    const BASE_INTERVAL = 60000 // 60s — this runs in every visitor tab

    const ping = async () => {
      try {
        // checks=rpc probes chain RPCs WITHOUT the database check. Hitting the
        // default (deep) endpoint would run SELECT 1 against Neon on every poll
        // in every open tab, which kept the free-plan compute awake 24/7.
        // See docs/ops-monitoring.md "Neon compute guardrails".
        const r = await fetch('/api/healthz?checks=rpc', { cache: 'no-store' })
        if (r.ok) {
          const j = await r.json()
          // healthz reports per-chain results under `services` keyed `rpc_<id>`,
          // plus `services.rpc` when the RPC modules can't load at all.
          const services: Record<string, { status?: string }> = j.services || {}
          const rpcBad = Object.entries(services)
            .filter(([key]) => key.startsWith('rpc'))
            .some(([, v]) => {
              const s = String(v?.status || '')
              return s === 'degraded' || s === 'error' || s === 'unavailable'
            })
          setBad(rpcBad)
          failCount.current = rpcBad ? failCount.current + 1 : 0
        } else if (r.status === 403 || r.status === 401) {
          // Auth error (e.g. Vercel preview deployment protection).
          // Don't show degraded banner — this isn't a network issue.
          // Stop polling entirely.
          return
        } else {
          failCount.current++
          setBad(true)
        }
      } catch {
        failCount.current++
        setBad(true)
      }

      // Give up after too many consecutive failures
      if (failCount.current >= MAX_CONSECUTIVE_FAILS) return

      // Back off: 60s → 120s → 240s → max 5min
      const delay = Math.min(BASE_INTERVAL * Math.pow(2, Math.min(failCount.current, 4)), 300000)
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
