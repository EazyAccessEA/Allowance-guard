// Legacy Token Discovery Page - Redirects to Enhanced Version
// Handles old URL structure and redirects to SEO-optimized URLs

'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { convertLegacyParams, generateOptimizedURL } from '@/lib/url-optimization'

// URL mapping for SEO-friendly slugs
const URL_MAPPING = {
  chains: {
    1: 'ethereum',
    137: 'polygon', 
    42161: 'arbitrum',
    10: 'optimism',
    8453: 'base',
    56: 'bsc',
    43114: 'avalanche'
  },
  categories: {
    1: 'defi',
    2: 'stablecoins', 
    3: 'gaming',
    4: 'nft',
    5: 'governance',
    6: 'infrastructure',
    7: 'meme',
    8: 'layer2',
    9: 'privacy'
  },
  sorts: {
    relevance: 'relevance',
    name: 'name',
    symbol: 'symbol', 
    recent: 'recent'
  }
}

export default function LegacyTokensPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Convert legacy parameters to optimized format
    const legacyParams = {
      q: searchParams.get('q'),
      chainId: searchParams.get('chainId') ? parseInt(searchParams.get('chainId')!) : undefined,
      category: searchParams.get('category'),
      verified: searchParams.get('verified') === 'true',
      sort: searchParams.get('sort') || 'relevance',
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      fuzzy: searchParams.get('fuzzy') !== 'false',
      minScore: searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 0,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20
    }

    const optimizedParams = convertLegacyParams(legacyParams)
    const newURL = generateOptimizedURL(optimizedParams, URL_MAPPING)
    
    // Redirect to the new URL structure
    router.replace(newURL)
  }, [searchParams, router])

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