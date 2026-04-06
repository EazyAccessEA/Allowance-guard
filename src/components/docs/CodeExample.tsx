'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeTab {
  language: string
  label: string
  code: string
}

interface CodeExampleProps {
  tabs: CodeTab[]
}

export function CodeExample({ tabs }: CodeExampleProps) {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tabs[activeTab].code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-700/50">
      {/* Language tabs */}
      <div className="flex items-center bg-slate-800/80 border-b border-slate-700/50">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.language}
              onClick={() => setActiveTab(i)}
              className={cn(
                'px-4 py-2.5 text-xs font-medium font-mono transition-colors border-b-2 -mb-[1px]',
                i === activeTab
                  ? 'text-amber-400 border-amber-500 bg-[#0A0E1A]'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-700/30',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="ml-auto mr-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <pre className="bg-[#0A0E1A] p-4 overflow-x-auto">
        <code className="text-sm font-mono text-slate-300 leading-relaxed">{tabs[activeTab].code}</code>
      </pre>
    </div>
  )
}
