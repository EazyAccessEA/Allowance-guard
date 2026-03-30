'use client'

import { useState } from 'react'
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
    <div className="border-2 border-ag-line rounded-lg overflow-hidden">
      {/* Language tabs */}
      <div className="flex items-center bg-ag-panel border-b-2 border-ag-line">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.language}
              onClick={() => setActiveTab(i)}
              className={cn(
                'px-4 py-2 text-xs font-medium transition-colors',
                i === activeTab
                  ? 'text-ag-text bg-ag-bg border-b-2 border-[#00C2B3] -mb-[2px]'
                  : 'text-ag-muted hover:text-ag-text',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="ml-auto mr-3 text-xs text-ag-muted hover:text-ag-text transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <pre className="bg-ag-bg p-4 overflow-x-auto">
        <code className="text-sm font-mono text-ag-text">{tabs[activeTab].code}</code>
      </pre>
    </div>
  )
}
