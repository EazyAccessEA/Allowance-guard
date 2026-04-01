'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function CancelPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    // Extract parameters from Coinbase Commerce redirect
    const provider = searchParams.get('provider')
    
    // Redirect to contribute page
    const redirectUrl = `/contribute?cancelled=true&provider=${provider || 'coinbase'}`
    router.replace(redirectUrl)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background-primary dark:bg-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 dark:border-primary-400 mx-auto mb-4"></div>
        <p className="text-text-tertiary dark:text-secondary-400">Redirecting back to contribution page...</p>
      </div>
    </div>
  )
}
