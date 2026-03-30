'use client'

import { useState } from 'react'
import { Play, Loader2 } from 'lucide-react'

interface ApiPlaygroundProps {
  method: 'GET' | 'POST'
  path: string
  defaultBody?: string
  defaultParams?: Record<string, string>
}

export function ApiPlayground({
  method,
  path,
  defaultBody,
  defaultParams,
}: ApiPlaygroundProps) {
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
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }

      if (method === 'POST' && body) {
        options.body = body
      }

      const res = await fetch(url, options)
      setStatus(res.status)
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setResponse(
        JSON.stringify(
          { error: err instanceof Error ? err.message : 'Request failed' },
          null,
          2,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-2 border-ag-line rounded-lg overflow-hidden">
      <div className="bg-ag-panel p-4 border-b-2 border-ag-line">
        <h4 className="text-sm font-bold text-ag-text mb-3">Try it out</h4>

        {/* API Key */}
        <div className="mb-3">
          <label className="block text-xs text-ag-muted mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="ag_live_..."
            className="w-full px-3 py-2 bg-ag-bg border border-ag-line rounded text-sm font-mono text-ag-text placeholder:text-ag-muted/50 focus:outline-none focus:border-[#00C2B3]"
          />
        </div>

        {/* Query params for GET */}
        {method === 'GET' && defaultParams && (
          <div className="space-y-2 mb-3">
            <label className="block text-xs text-ag-muted">Query Parameters</label>
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="px-2 py-1.5 bg-ag-bg border border-ag-line rounded text-xs font-mono text-ag-muted min-w-[100px]">
                  {key}
                </span>
                <input
                  value={value}
                  onChange={(e) => setParams((p) => ({ ...p, [key]: e.target.value }))}
                  className="flex-1 px-3 py-1.5 bg-ag-bg border border-ag-line rounded text-sm font-mono text-ag-text focus:outline-none focus:border-[#00C2B3]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Body for POST */}
        {method === 'POST' && (
          <div className="mb-3">
            <label className="block text-xs text-ag-muted mb-1">Request Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 bg-ag-bg border border-ag-line rounded text-sm font-mono text-ag-text focus:outline-none focus:border-[#00C2B3] resize-y"
            />
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#00C2B3] text-white rounded font-medium text-sm hover:bg-[#00C2B3]/80 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          Send Request
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="p-4">
          {status !== null && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-ag-muted">Status:</span>
              <span
                className={`text-xs font-mono font-bold ${
                  status < 300 ? 'text-emerald-400' : status < 500 ? 'text-amber-400' : 'text-red-400'
                }`}
              >
                {status}
              </span>
            </div>
          )}
          <pre className="bg-ag-bg border border-ag-line rounded p-4 overflow-x-auto">
            <code className="text-xs font-mono text-ag-text">{response}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
