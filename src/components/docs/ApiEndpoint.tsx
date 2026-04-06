'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Param {
  name: string
  type: string
  required: boolean
  description: string
}

interface ApiEndpointProps {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  auth?: boolean
  params?: Param[]
  bodyParams?: Param[]
  responseExample: string
  children?: React.ReactNode
}

const methodStyles: Record<string, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  POST: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  DELETE: 'bg-red-500/15 text-red-400 border-red-500/25',
}

export function ApiEndpoint({
  method, path, description, auth = true,
  params, bodyParams, responseExample, children,
}: ApiEndpointProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 mb-4">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 bg-slate-800/50 hover:bg-slate-800/70 transition-colors text-left"
      >
        {expanded
          ? <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
          : <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
        }
        <span className={cn('px-2.5 py-0.5 text-[11px] font-bold font-mono uppercase rounded-md border', methodStyles[method])}>
          {method}
        </span>
        <code className="text-sm font-mono text-slate-200">{path}</code>
        {auth && (
          <span className="ml-auto flex items-center gap-1 text-[11px] text-slate-500">
            <Lock className="w-3 h-3" />
            Auth
          </span>
        )}
      </button>

      {/* Expanded */}
      {expanded && (
        <div className="p-5 border-t border-slate-700/50 space-y-5 bg-slate-900/30">
          <p className="text-sm text-slate-400">{description}</p>

          {params && params.length > 0 && (
            <ParamTable title="Parameters" items={params} />
          )}

          {bodyParams && bodyParams.length > 0 && (
            <ParamTable title="Request Body (JSON)" items={bodyParams} />
          )}

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Response
            </h4>
            <pre className="bg-[#0A0E1A] border border-slate-700/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-xs font-mono text-slate-300">{responseExample}</code>
            </pre>
          </div>

          {children}
        </div>
      )}
    </div>
  )
}

function ParamTable({ title, items }: { title: string; items: Param[] }) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">{title}</h4>
      <div className="border border-slate-700/50 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/50 text-left">
              <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Name</th>
              <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Type</th>
              <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Req</th>
              <th className="px-3 py-2 text-[11px] font-medium text-slate-500 uppercase tracking-wide">Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.name} className="border-t border-slate-700/30">
                <td className="px-3 py-2 font-mono text-xs text-amber-400">{p.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-400">{p.type}</td>
                <td className="px-3 py-2">
                  {p.required
                    ? <span className="text-[10px] font-medium text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">required</span>
                    : <span className="text-[10px] text-slate-500">optional</span>
                  }
                </td>
                <td className="px-3 py-2 text-xs text-slate-400">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
