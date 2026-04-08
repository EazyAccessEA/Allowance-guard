'use client'
import { useCallback, useMemo, useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import TokenSearchControls from '@/components/tokens/TokenSearchControls'
import TokenResults from '@/components/tokens/TokenResults'
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
    <div className="min-h-screen bg-paper-deep text-ink">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />

        <Container className="relative text-left max-w-4xl z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-primary-accent" />
            </div>
            <div>
              <H1 className="mb-2">Token Discovery</H1>
              <p className="text-ink-muted text-lg">
                Explore and discover tokens across multiple blockchains
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-accent" />
              <span>Advanced fuzzy search</span>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-accent" />
              <span>Smart filtering</span>
            </div>
          </div>
        </Container>
      </Section>

      <div className="border-t border-ink-rule" />

      {/* Search Section */}
      <Section className="py-16">
        <Container>
          <TokenSearchControls initial={state} onChange={onChange} />
          <TokenResults state={apiState} />
        </Container>
      </Section>
    </div>
  )
}
