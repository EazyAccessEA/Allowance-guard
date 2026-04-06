'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SupportNudge({ when }: { when: 'after-revoke' | 'manual' }) {
  const [show, setShow] = useState(false)
  
  useEffect(() => {
    if (when !== 'after-revoke') return
    const flag = sessionStorage.getItem('nudge:revoke')
    if (!flag) { 
      setShow(true)
      sessionStorage.setItem('nudge:revoke', '1') 
    }
  }, [when])

  if (!show) return null
  
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 max-w-sm rounded-xl border border-secondary-700 bg-background-primary dark:bg-secondary-800 p-3 shadow-lg dark:shadow-dark-subtle z-50"
    >
      <div className="text-sm text-text-primary dark:text-secondary-100">
        Revocation sent — if this tool helps, consider
        <Link href="/docs/contributing" className="ml-1 underline text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors duration-200">
          supporting development
        </Link>. Thank you!
      </div>
      <button
        className="mt-2 rounded border border-secondary-700 dark:border-secondary-600 min-h-[44px] min-w-[44px] px-3 py-2 text-xs text-text-secondary dark:text-secondary-400 hover:text-text-primary dark:hover:text-secondary-100 hover:bg-background-secondary dark:hover:bg-secondary-700 transition-colors duration-200"
        onClick={() => setShow(false)}
        aria-label="Dismiss support message"
      >
        Dismiss
      </button>
    </div>
  )
}
