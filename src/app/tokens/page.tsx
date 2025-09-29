'use client'
import { useCallback, useMemo, useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import TokenSearchControls from '@/components/tokens/TokenSearchControls'
import TokenResults from '@/components/tokens/TokenResults'
import TokenDiscoveryEducation from '@/components/tokens/TokenDiscoveryEducation'
import SearchGuidance from '@/components/tokens/SearchGuidance'
import TokenDiscoveryCTA from '@/components/tokens/TokenDiscoveryCTA'
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

export default function TokensPage() {
  const [state, setState] = useState<SearchState>({ 
    q: '', 
    verified: true, 
    fuzzy: true, 
    minScore: 0, 
    sort: 'relevance', 
    offset: 0 
  })
  
  const onChange = useCallback((s: Partial<SearchState>) => 
    setState((prev: SearchState) => ({ ...prev, ...s, offset: 0 })), 
  [])
  
  const apiState = useMemo(() => ({ 
    ...state, 
    setOffset: (n: number) => setState((p: SearchState) => ({ ...p, offset: n })) 
  }), [state])

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Mobile Responsive */}
      <Section className="relative py-8 sm:py-12 md:py-24 lg:py-32 min-h-[60svh] sm:min-h-[70svh]">
        {/* Video Background - Desktop only */}
        <div className="hidden md:block absolute inset-0 z-0">
          <VideoBackground
            videoSrc="/V3AG.mp4"
            className="absolute inset-0 w-full h-full object-cover object-center"
            priority
            lazy={false}
            decorative
          />
        </div>

        {/* Mobile gradient background */}
        <div className="md:hidden absolute inset-0 z-10 bg-gradient-to-br from-primary-50 to-primary-100" />

        {/* Semi-transparent overlay */}
        <div
          className="absolute inset-0 z-20"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative max-w-4xl z-30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-primary-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <H1 className="mb-2 text-2xl sm:text-3xl lg:text-4xl">Token Discovery</H1>
              <p className="text-stone text-base sm:text-lg">
                Explore and discover tokens across multiple blockchains
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm text-stone">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-accent" />
              <span>Smart search</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-accent" />
              <span>Advanced filtering</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Educational Section */}
      <Section className="py-12 sm:py-16 md:py-24 bg-white/50 backdrop-blur-sm">
        <Container>
          <TokenDiscoveryEducation />
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
