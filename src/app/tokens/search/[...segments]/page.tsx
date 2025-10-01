// Enhanced Token Discovery with SEO-optimized URLs
// Supports URLs like:
// /tokens/search/usdc
// /tokens/search/usdc/on/ethereum
// /tokens/search/usdc/on/ethereum/in/stablecoins
// /tokens/search/usdc/on/ethereum/in/stablecoins?verified=true&sort=name&page=2

'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import TokenSearchControls from '@/components/tokens/TokenSearchControls'
import TokenResults from '@/components/tokens/TokenResults'
import TokenDiscoveryEducation from '@/components/tokens/TokenDiscoveryEducation'
import SearchGuidance from '@/components/tokens/SearchGuidance'
import TokenDiscoveryCTA from '@/components/tokens/TokenDiscoveryCTA'
import { generateOptimizedURL, parseOptimizedURL, convertLegacyParams, generateMetaDescription } from '@/lib/url-optimization'
import { Search, Filter, Sparkles } from 'lucide-react'

type SearchState = {
  q?: string
  chainId?: number
  category?: string
  verified?: boolean
  fuzzy?: boolean
  minScore?: number
  sort?: 'relevance' | 'name' | 'symbol' | 'recent'
  offset?: number
}

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

export default function EnhancedTokensPage({ 
  params 
}: { 
  params: Promise<{ segments: string[] }> 
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  
  const [state, setState] = useState<SearchState>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Parse URL segments and parameters
  useEffect(() => {
    const initializeFromURL = async () => {
      const resolvedParams = await params
      const segments = resolvedParams.segments || []
      
      // Parse the optimized URL structure
      const optimizedParams = parseOptimizedURL(pathname, searchParams, URL_MAPPING)
      
      // Convert to legacy format for compatibility
      const legacyParams = {
        q: optimizedParams.query,
        chainId: optimizedParams.chain ? parseInt(optimizedParams.chain) : undefined,
        category: optimizedParams.category,
        verified: optimizedParams.verified,
        sort: optimizedParams.sort || 'relevance',
        offset: optimizedParams.page ? (optimizedParams.page - 1) * 20 : 0,
        fuzzy: optimizedParams.fuzzy !== false,
        minScore: optimizedParams.minScore || 0,
        limit: optimizedParams.limit || 20
      }
      
      setState(legacyParams)
      setIsInitialized(true)
    }
    
    initializeFromURL()
  }, [params, pathname, searchParams])

  // Update URL when state changes
  const updateURL = useCallback((newState: SearchState) => {
    const optimizedParams = convertLegacyParams(newState)
    const newURL = generateOptimizedURL(optimizedParams, URL_MAPPING)
    
    // Only update URL if it's different to avoid infinite loops
    if (newURL !== pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')) {
      router.replace(newURL, { scroll: false })
    }
  }, [pathname, searchParams, router])

  const onChange = useCallback((newState: SearchState) => {
    setState(newState)
    updateURL(newState)
  }, [updateURL])

  // API state for TokenResults component
  const apiState = useMemo(() => ({
    ...state,
    setOffset: (offset: number) => onChange({ ...state, offset })
  }), [state, onChange])

  // Generate meta description for SEO
  const metaDescription = useMemo(() => {
    const optimizedParams = convertLegacyParams(state)
    return generateMetaDescription(optimizedParams, URL_MAPPING)
  }, [state])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading token discovery...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <VideoBackground videoSrc="/AllowanceGuard_BG.mp4" />
      
      {/* Hero Section */}
      <Section className="py-12 sm:py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Enhanced Token Discovery
            </div>
            
            <H1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Discover & Verify Tokens
            </H1>
            
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              {metaDescription}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Smart Search
              </span>
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filtering
              </span>
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Multi-Chain Support
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Education Section */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-6xl mx-auto">
            <TokenDiscoveryEducation />
          </div>
        </Container>
      </Section>

      {/* Search Section */}
      <Section className="py-12 sm:py-16 md:py-24">
        <Container>
          <div className="max-w-7xl mx-auto">
            <SearchGuidance />
            
            {/* Search Interface */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
              <TokenSearchControls initial={state} onChange={onChange} />
            </div>
            
            <TokenResults state={apiState} />
            <TokenDiscoveryCTA />
          </div>
        </Container>
      </Section>
    </div>
  )
}
