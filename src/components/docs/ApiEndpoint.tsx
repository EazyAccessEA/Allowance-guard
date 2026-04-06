'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
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

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function ApiEndpoint({
  method,
  path,
  description,
  auth = true,
  params,
  bodyParams,
  responseExample,
  children,
}: ApiEndpointProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-2 border-secondary-700 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 bg-background-secondary dark:bg-secondary-800 hover:bg-background-secondary/80 dark:hover:bg-secondary-800/80 transition-colors text-left"
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-text-secondary dark:text-secondary-400 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-text-secondary dark:text-secondary-400 shrink-0" />
        )}
        <span
          className={cn(
            'px-2 py-0.5 text-xs font-bold font-mono uppercase rounded border',
            methodColors[method],
          )}
        >
          {method}
        </span>
        <code className="text-sm font-mono text-text-primary dark:text-secondary-100">{path}</code>
        {auth && (
          <span className="ml-auto text-xs text-text-secondary dark:text-secondary-400 border border-secondary-700 rounded px-2 py-0.5">
            Auth required
          </span>
        )}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="p-4 border-t-2 border-secondary-700 space-y-4">
          <p className="text-sm text-text-secondary dark:text-secondary-400">{description}</p>

          {/* Query/URL parameters */}
          {params && params.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-secondary dark:text-secondary-400 mb-2">
                Parameters
              </h4>
              <div className="border border-secondary-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background-secondary dark:bg-secondary-800 text-left">
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Name</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Type</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Required</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {params.map((p) => (
                      <tr key={p.name} className="border-t border-secondary-700">
                        <td className="px-3 py-2 font-mono text-xs text-text-primary dark:text-secondary-100">{p.name}</td>
                        <td className="px-3 py-2 font-mono text-xs text-text-secondary dark:text-secondary-400">{p.type}</td>
                        <td className="px-3 py-2">
                          {p.required ? (
                            <span className="text-xs text-red-400">required</span>
                          ) : (
                            <span className="text-xs text-text-secondary dark:text-secondary-400">optional</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-text-secondary dark:text-secondary-400">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Body parameters */}
          {bodyParams && bodyParams.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-text-secondary dark:text-secondary-400 mb-2">
                Request Body (JSON)
              </h4>
              <div className="border border-secondary-700 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background-secondary dark:bg-secondary-800 text-left">
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Field</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Type</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Required</th>
                      <th className="px-3 py-2 font-medium text-text-secondary dark:text-secondary-400">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bodyParams.map((p) => (
                      <tr key={p.name} className="border-t border-secondary-700">
                        <td className="px-3 py-2 font-mono text-xs text-text-primary dark:text-secondary-100">{p.name}</td>
                        <td className="px-3 py-2 font-mono text-xs text-text-secondary dark:text-secondary-400">{p.type}</td>
                        <td className="px-3 py-2">
                          {p.required ? (
                            <span className="text-xs text-red-400">required</span>
                          ) : (
                            <span className="text-xs text-text-secondary dark:text-secondary-400">optional</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-xs text-text-secondary dark:text-secondary-400">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Response example */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-text-secondary dark:text-secondary-400 mb-2">
              Response Example
            </h4>
            <pre className="bg-background-primary dark:bg-secondary-900 border border-secondary-700 rounded p-4 overflow-x-auto">
              <code className="text-xs font-mono text-text-primary dark:text-secondary-100">{responseExample}</code>
            </pre>
          </div>

          {children}
        </div>
      )}
    </div>
  )
}
