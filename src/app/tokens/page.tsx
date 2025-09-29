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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section - Enterprise Grade */}
      <Section className="relative py-32 sm:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-transparent to-blue-900/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        
        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Enterprise-Grade Token Discovery
            </div>

            {/* Main Headline */}
            <H1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Discover & Verify
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Token Security
              </span>
            </H1>
            
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional-grade token discovery platform with comprehensive security analysis, 
              verification status, and risk assessment for institutional and retail users.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-slate-700">
                <Search className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Smart Search</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-slate-700">
                <Filter className="w-4 h-4 text-indigo-600" />
                <span className="font-medium">Advanced Filters</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-slate-700">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium">AI-Powered Analysis</span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Educational Section */}
      <Section className="py-24 bg-white/50 backdrop-blur-sm">
        <Container>
          <TokenDiscoveryEducation />
        </Container>
      </Section>

      {/* Search Section */}
      <Section className="py-24">
        <Container>
          <div className="max-w-7xl mx-auto">
            <SearchGuidance />
            
            {/* Search Interface */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-8 mb-12">
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
