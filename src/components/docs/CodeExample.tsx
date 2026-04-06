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
    <div className="border-2 border-secondary-700 rounded-lg overflow-hidden">
      {/* Language tabs */}
      <div className="flex items-center bg-background-secondary dark:bg-secondary-800 border-b-2 border-secondary-700">
        <div className="flex">
          {tabs.map((tab, i) => (
            <button
              key={tab.language}
              onClick={() => setActiveTab(i)}
              className={cn(
                'px-4 py-2 text-xs font-medium transition-colors',
                i === activeTab
                  ? 'text-text-primary dark:text-secondary-100 bg-background-primary dark:bg-secondary-900 border-b-2 border-primary-600 dark:border-primary-400 -mb-[2px]'
                  : 'text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          onClick={copyToClipboard}
          className="ml-auto mr-3 text-xs text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code content */}
      <pre className="bg-background-primary dark:bg-secondary-900 p-4 overflow-x-auto">
        <code className="text-sm font-mono text-text-primary dark:text-secondary-100">{tabs[activeTab].code}</code>
      </pre>
    </div>
  )
}
