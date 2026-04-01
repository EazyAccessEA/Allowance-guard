'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  useEffect(() => {
    // Extract parameters from Coinbase Commerce redirect
    const provider = searchParams.get('provider')
    const chargeId = searchParams.get('charge_id')
    
    // Redirect to thank-you page with proper parameters
    const redirectUrl = `/thank-you?provider=${provider || 'coinbase'}&charge_id=${chargeId || ''}`
    router.replace(redirectUrl)
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background-primary dark:bg-secondary-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-700 dark:border-primary-400 mx-auto mb-4"></div>
        <p className="text-text-tertiary dark:text-secondary-400">Redirecting to confirmation page...</p>
      </div>
    </div>
  )
}
