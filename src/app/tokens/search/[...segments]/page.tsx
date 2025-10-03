// Simplified Token Discovery Page
// Basic working version that can be enhanced later

'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { Search, Filter, Sparkles } from 'lucide-react'

export default function TokensSearchPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    try {
      const response = await fetch(`/api/tokens/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data || [])
      } else {
        console.error('Search failed:', data.error)
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Section className="relative py-24 sm:py-32 overflow-hidden">
          <VideoBackground videoSrc="/V3AG.mp4" />
          
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.80) 100%)'
            }}
          />
          
          <Container className="relative z-10">
            <div className="max-w-4xl text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-stone">Loading token discovery...</p>
            </div>
          </Container>
        </Section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.80) 100%)'
          }}
        />
        
        <Container className="relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Token Discovery
            </div>
            
            <H1 className="mb-6">Discover & Verify Tokens</H1>
            
            <p className="text-base text-stone max-w-reading mb-8">
              Search for tokens across multiple chains. Find verified tokens, check their details, and discover new projects safely.
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
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

      {/* Search Section */}
      <Section className="py-12 sm:py-16 md:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Search Form */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-6 mb-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for tokens (e.g., USDC, WETH, UNI)..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-6">
                <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                <div className="space-y-3">
                  {results.map((token: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{token.name}</h4>
                        <p className="text-sm text-slate-600">{token.symbol}</p>
                        <p className="text-xs text-slate-500">{token.tokenAddress}</p>
                      </div>
                      <div className="text-sm text-slate-600">
                        Chain: {token.chainId}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchQuery && results.length === 0 && (
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/5 p-6 text-center">
                <p className="text-slate-600">No tokens found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm text-slate-500 mt-2">Try a different search term or check the spelling</p>
              </div>
            )}

            {/* Coming Soon Notice */}
            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Enhanced Token Discovery Coming Soon</h3>
                <p className="text-blue-700">
                  We&apos;re building advanced token discovery features including multi-chain search, 
                  category filtering, and verified token verification. Stay tuned!
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}