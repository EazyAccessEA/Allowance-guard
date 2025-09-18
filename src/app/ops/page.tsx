'use client'
import { useEffect, useState } from 'react'

interface MetricsData {
  dbBytes: number
  topTables: Array<{ table: string; bytes: number; rows: number }>
  counts: Record<string, number>
  today: {
    rpc: Record<string, number>
    email: number
    scan: number
  }
  timestamp: string
}

interface HealthData {
  ok: boolean
  checks: Record<string, string | Record<string, string>>
}

export default function OpsPage() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [health, setHealth] = useState<HealthData | null>(null)
  const [token, setToken] = useState('')

  async function load() {
    const qs = token ? `?token=${encodeURIComponent(token)}` : ''
    const m = await fetch(`/api/ops/metrics${qs}`, { cache: 'no-store' })
    const h = await fetch('/api/healthz', { cache: 'no-store' })
    setData(m.ok ? await m.json() : { error: await m.text() })
    setHealth(h.ok ? await h.json() : { ok: false })
  }

  useEffect(() => {
    const t = localStorage.getItem('ops_token') || ''
    setToken(t)
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-xl font-semibold">Ops Dashboard</h1>
      <div className="mt-3 flex gap-2">
        <input className="rounded border px-2 py-1 text-sm w-80" placeholder="OPS_DASH_TOKEN"
               value={token} onChange={e=>setToken(e.target.value)} />
        <button onClick={()=>{ localStorage.setItem('ops_token', token); load() }} className="rounded border px-3 py-1 text-sm">Load</button>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Health</h2>
        <pre className="mt-2 rounded border bg-gray-50 p-3 text-xs overflow-auto">{JSON.stringify(health || {}, null, 2)}</pre>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold">Metrics</h2>
        <pre className="mt-2 rounded border bg-gray-50 p-3 text-xs overflow-auto">{JSON.stringify(data || {}, null, 2)}</pre>
      </section>
    </main>
  )
}
