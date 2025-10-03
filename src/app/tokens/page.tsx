// Legacy Token Discovery Page - Coming Soon
// Token discovery features are temporarily disabled

'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'
import { Search, Sparkles, Clock } from 'lucide-react'

export default function TokensPage() {
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
          <div className="max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Search className="w-4 h-4" />
              Token Discovery
            </div>
            
            <H1 className="mb-6">Token Discovery Coming Soon</H1>
            
            <p className="text-base text-stone max-w-reading mb-8 mx-auto">
              We&apos;re building advanced token discovery features to help you find and verify tokens across multiple blockchains. Stay tuned for this powerful new feature!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Smart Search
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Multi-Chain Support
              </span>
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Token Verification
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {/* Coming Soon Notice */}
      <Section className="py-12 sm:py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Advanced Token Discovery</h2>
              <p className="text-blue-700 mb-6">
                We&apos;re working on a comprehensive token discovery system that will include:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">Search Features</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Fuzzy search across token names and symbols</li>
                    <li>• Multi-chain token discovery</li>
                    <li>• Category-based filtering</li>
                    <li>• Verified token identification</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-blue-900">Advanced Features</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Relevance scoring</li>
                    <li>• Token metadata enrichment</li>
                    <li>• Community verification status</li>
                    <li>• Real-time token data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}