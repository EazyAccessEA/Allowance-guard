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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cobalt mx-auto mb-4"></div>
        <p className="text-stone">Redirecting back to contribution page...</p>
      </div>
    </div>
  )
}
