'use client'
import { useCallback, useMemo, useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import TokenSearchControls from '@/components/tokens/TokenSearchControls'
import TokenResults from '@/components/tokens/TokenResults'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Section className="py-16">
        <Container>
          <div className="text-center mb-8">
            <H1 className="text-white mb-4">Discover Tokens</H1>
            <p className="text-white/70 max-w-2xl mx-auto">
              Search and explore tokens across multiple blockchains with advanced filtering and fuzzy search capabilities.
            </p>
          </div>
          
          <TokenSearchControls initial={state} onChange={onChange} />
          <TokenResults state={apiState} />
        </Container>
      </Section>
    </div>
  )
}
