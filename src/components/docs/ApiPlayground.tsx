'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

interface ApiPlaygroundProps {
  method: 'GET' | 'POST'
  path: string
  defaultBody?: string
  defaultParams?: Record<string, string>
}

export function ApiPlayground({ method, path, defaultBody, defaultParams }: ApiPlaygroundProps) {
  const [apiKey, setApiKey] = useState('')
  const [body, setBody] = useState(defaultBody ?? '')
  const [params, setParams] = useState<Record<string, string>>(defaultParams ?? {})
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<number | null>(null)

  const buildUrl = () => {
    const base = path
    if (method === 'GET' && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      ).toString()
      return qs ? `${base}?${qs}` : base
    }
    return base
  }

  const handleSend = async () => {
    if (!apiKey) {
      setResponse(JSON.stringify({ error: 'Please enter your API key' }, null, 2))
      setStatus(null)
      return
    }
    setLoading(true)
    setResponse(null)
    setStatus(null)
    try {
      const url = buildUrl()
      const options: RequestInit = {
        method,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      }
      if (method === 'POST' && body) options.body = body
      const res = await fetch(url, options)
      setStatus(res.status)
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setResponse(JSON.stringify({ error: err instanceof Error ? err.message : 'Request failed' }, null, 2))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 mt-4">
      <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 space-y-3">
        <h4 className="text-sm font-semibold text-slate-200">Try it out</h4>

        {/* API Key */}
        <div>
          <label className="block text-[11px] text-slate-500 uppercase tracking-wide mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="ag_live_..."
            className="w-full px-3 py-2 bg-[#0A0E1A] border border-slate-700/50 rounded-lg text-sm font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors"
          />
        </div>

        {/* Query params for GET */}
        {method === 'GET' && defaultParams && (
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-500 uppercase tracking-wide">Parameters</label>
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="px-2.5 py-1.5 bg-[#0A0E1A] border border-slate-700/50 rounded-lg text-xs font-mono text-amber-400/70 min-w-[100px] flex items-center">
                  {key}
                </span>
                <input
                  value={value}
                  onChange={(e) => setParams((p) => ({ ...p, [key]: e.target.value }))}
                  className="flex-1 px-3 py-1.5 bg-[#0A0E1A] border border-slate-700/50 rounded-lg text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500/50 transition-colors"
                />
              </div>
            ))}
          </div>
        )}

        {/* Body for POST */}
        {method === 'POST' && (
          <div>
            <label className="block text-[11px] text-slate-500 uppercase tracking-wide mb-1">Request Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-[#0A0E1A] border border-slate-700/50 rounded-lg text-sm font-mono text-slate-200 focus:outline-none focus:border-amber-500/50 resize-y transition-colors"
            />
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Send Request
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="p-4 bg-slate-900/30">
          {status !== null && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] text-slate-500 uppercase tracking-wide">Status:</span>
              <span className={`text-xs font-mono font-bold ${status < 300 ? 'text-emerald-400' : status < 500 ? 'text-amber-400' : 'text-red-400'}`}>
                {status}
              </span>
            </div>
          )}
          <pre className="bg-[#0A0E1A] border border-slate-700/50 rounded-lg p-4 overflow-x-auto">
            <code className="text-xs font-mono text-slate-300">{response}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
