'use client'

import { useState } from 'react'
import { HexButton } from '../HexButton'

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
    <div className="relative">
      <div className="flex items-center justify-between bg-ag-panel border-2 border-ag-line px-4 py-2">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm font-mono text-ag-text">{filename}</span>
          )}
          <span className="text-xs text-ag-muted uppercase tracking-wide">{language}</span>
        </div>
        <HexButton 
          size="sm" 
          variant="ghost"
          onClick={copyToClipboard}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </HexButton>
      </div>
      <pre className="bg-ag-bg border-2 border-ag-line border-t-0 p-4 overflow-x-auto">
        <code className={`text-sm font-mono text-ag-text language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  )
}
