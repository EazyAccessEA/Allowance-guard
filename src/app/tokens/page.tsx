// Legacy Token Discovery Page - Redirects to Enhanced Version
// Handles old URL structure and redirects to SEO-optimized URLs

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LegacyTokensPage() {
  const router = useRouter()

  useEffect(() => {
    // Simple redirect to search page
    router.replace('/tokens/search')
  }, [router])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to enhanced token discovery...</p>
      </div>
    </div>
  )
}