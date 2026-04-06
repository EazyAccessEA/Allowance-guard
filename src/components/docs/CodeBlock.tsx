'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language = 'javascript', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700/50">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2.5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          {/* Terminal dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          </div>
          {filename && (
            <span className="text-xs font-mono text-slate-400">{filename}</span>
          )}
          <span className="text-[10px] font-mono text-amber-500/70 uppercase tracking-wider">{language}</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-amber-400 transition-colors rounded hover:bg-slate-700/50"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {/* Code area */}
      <pre className="bg-[#0A0E1A] p-4 overflow-x-auto">
        <code className={`text-sm font-mono text-slate-300 leading-relaxed language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  )
}
