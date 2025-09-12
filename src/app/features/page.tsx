'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import Link from 'next/link'
import { Shield, Eye, Settings, Zap, Users, Bell, Globe, AlertTriangle } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function FeaturesPage() {
  const { isConnected } = useAccount()

  const features = [
    {
      icon: Globe,
      title: 'Multi-Network Support',
      description: 'Scan across Ethereum, Arbitrum, and Base networks with unified results.'
    },
    {
      icon: AlertTriangle,
      title: 'Risk Assessment',
      description: 'Advanced algorithms identify unlimited and stale approvals automatically.'
    },
    {
      icon: Bell,
      title: 'Autonomous Monitoring',
      description: 'Continuous monitoring with instant alerts when new approvals appear.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share wallet monitoring with role-based access control and invites.'
    },
    {
      icon: Zap,
      title: 'One-Click Revocation',
      description: 'Revoke risky approvals instantly with gas-optimized transactions.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Local processing ensures your data never leaves your browser.'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
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
          <H1 className="mb-6">Features</H1>
          <p className="text-base text-stone max-w-reading mb-8">
            Everything you need to secure your wallet. Free, open source, and built for privacy.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Features Grid */}
      <Section className="py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="group">
                  <div className="flex items-start gap-4 p-6 border border-line rounded-lg hover:border-ink/20 transition-colors duration-200">
                    <div className="w-12 h-12 bg-mist rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-ink/5 transition-colors duration-200">
                      <IconComponent className="w-6 h-6 text-ink" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ink mb-2">{feature.title}</h3>
                      <p className="text-base text-stone leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Value Proposition Strip */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-ink mb-4">
              Built for security, designed for simplicity
            </h2>
            <p className="text-base text-stone leading-relaxed mb-8">
              Allowance Guard combines powerful security features with an intuitive interface. 
              No complex setup, no hidden costs, no compromises on privacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-ink text-white hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Eye className="w-5 h-5 mr-2" />
                Start Scanning
              </Link>
              <Link 
                href="/docs" 
                className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-white text-ink border border-line hover:bg-mist focus:outline-none focus:ring-2 focus:ring-ink/30"
              >
                <Settings className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}