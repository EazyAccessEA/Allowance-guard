'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Apple-style Parallax Image Component
function AppleParallaxImage({ src, alt, children, className = '' }: {
  src: string
  alt: string
  children?: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const [_scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !imageRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrolled = window.scrollY
        setScrollY(scrolled)

        // Apple-style smooth parallax with easing
        const parallaxOffset = scrolled * 0.3
        const scale = 1 + (scrolled * 0.0001)
        const opacity = Math.max(0.7, 1 - (scrolled * 0.0005))

        imageRef.current.style.transform = `translateY(${parallaxOffset}px) scale(${scale})`
        imageRef.current.style.opacity = opacity.toString()
      }
    }

    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
        style={{
          willChange: 'transform, opacity',
          transition: 'transform 0.1s ease-out, opacity 0.1s ease-out'
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          quality={90}
        />
      </div>
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
      <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
    </div>
  )
}

export default function StatisticsSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50 relative">
      {/* Apple-style Parallax Background */}
      <AppleParallaxImage 
        src="/From Dapp User.png" 
        alt="DApp User Security Visualization"
        className="absolute inset-0 z-0"
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Apple-style typography */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            Security Intelligence
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            The Hidden Risk in Every Wallet
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Token approvals are the silent vulnerability that affects every DeFi user. 
            Understanding the scale helps you protect what matters most.
          </p>
        </div>

        {/* Apple-style Statistics Layout with Glassmorphism */}
        <div className="space-y-8 mb-20">
          {/* Critical Stat - Most Important */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">$3.2B+ Lost in 2024</h3>
                <p className="text-gray-600 text-lg">Lost to approval-based exploits across all DeFi protocols</p>
              </div>
              <div className="text-red-600">
                <span className="text-lg font-semibold">+47%</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats - Grid layout with Apple spacing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">73%</div>
                <div className="text-sm text-gray-600">of DeFi attacks</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Exploit token approvals as their primary attack vector
              </p>
              <div className="text-orange-600 mt-3">
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">47</div>
                <div className="text-sm text-gray-600">average approvals</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Active token approvals per wallet across major chains
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">&lt;60s</div>
                <div className="text-sm text-gray-600">scan time</div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Average time to complete a comprehensive security audit
              </p>
              <div className="text-green-600 mt-3">
                <span className="text-sm font-medium">-30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Types with Apple-style cards */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Common Approval Risks
            </h3>
            <p className="text-gray-600 text-lg max-w-3xl">
              Understanding these risks helps you make informed decisions about your token approvals.
            </p>
          </div>
          
          <div className="space-y-6">
            {/* High Risk */}
            <div className="p-6 bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-100/50">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Unlimited Approvals</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Approvals that allow unlimited token spending, creating maximum risk exposure. These should be avoided whenever possible.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                High Risk
              </div>
            </div>

            {/* Medium Risk */}
            <div className="p-6 bg-orange-50/80 backdrop-blur-sm rounded-2xl border border-orange-100/50">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Abandoned Contracts</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Approvals to contracts that are no longer maintained or have been compromised. These pose ongoing security risks.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                Medium Risk
              </div>
            </div>

            {/* Critical Risk */}
            <div className="p-6 bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-100/50">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Malicious Contracts</h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                Known malicious or suspicious contracts that pose immediate security threats. These should be revoked immediately.
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Critical Risk
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
