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
      className="fixed bottom-4 right-4 max-w-sm rounded-xl border border-line bg-white p-3 shadow-lg z-50"
    >
      <div className="text-sm text-ink">
        Revocation sent ✅ — if this tool helps, consider
        <Link href="/docs/contributing" className="ml-1 underline text-cobalt hover:text-cobalt/80 transition-colors duration-200">
          supporting development
        </Link>. Thank you!
      </div>
      <button 
        className="mt-2 rounded border border-line px-2 py-1 text-xs text-stone hover:text-ink hover:bg-mist transition-colors duration-200" 
        onClick={() => setShow(false)}
        aria-label="Dismiss support message"
      >
        Dismiss
      </button>
    </div>
  )
}
