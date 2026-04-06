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
      <div className="flex items-center justify-between bg-background-secondary dark:bg-secondary-800 border-2 border-secondary-700 px-4 py-2">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm font-mono text-text-primary dark:text-secondary-100">{filename}</span>
          )}
          <span className="text-xs text-text-secondary dark:text-secondary-400 uppercase tracking-wide">{language}</span>
        </div>
        <HexButton
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </HexButton>
      </div>
      <pre className="bg-background-primary dark:bg-secondary-900 border-2 border-secondary-700 border-t-0 p-4 overflow-x-auto">
        <code className={`text-sm font-mono text-text-primary dark:text-secondary-100 language-${language}`}>
          {children}
        </code>
      </pre>
    </div>
  )
}
