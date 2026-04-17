'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useScrollPrediction } from '@/hooks/useScrollPrediction'

interface PredictiveSectionProps {
 id: string
 children: ReactNode
 className?: string
 preloadPriority?: 'high' | 'medium' | 'low'
 fallback?: ReactNode
 onPreload?: () => void
 onLoad?: () => void
}

export default function PredictiveSection({
 id,
 children,
 className = '',
 preloadPriority = 'medium',
 fallback,
 onPreload,
 onLoad
}: PredictiveSectionProps) {
 const sectionRef = useRef<HTMLElement>(null)
 const [isLoaded, setIsLoaded] = useState(false)
 const [isPreloading, setIsPreloading] = useState(false)
 const { shouldPreloadSection } = useScrollPrediction()

 // Check if section should be preloaded
 useEffect(() => {
 if (shouldPreloadSection(id) && !isLoaded && !isPreloading) {
 setIsPreloading(true)
 onPreload?.()
 
 // Load after a short delay based on priority
 const delay = preloadPriority === 'high' ? 0 : preloadPriority === 'medium' ? 100 : 300
 
 setTimeout(() => {
 setIsLoaded(true)
 setIsPreloading(false)
 onLoad?.()
 }, delay)
 }
 }, [shouldPreloadSection, id, isLoaded, isPreloading, preloadPriority, onPreload, onLoad])

 // Also load when section comes into view
 useEffect(() => {
 if (isLoaded) return

 const observer = new IntersectionObserver(
 ([entry]) => {
 if (entry.isIntersecting && !isLoaded) {
 setIsLoaded(true)
 setIsPreloading(false)
 onLoad?.()
 }
 },
 { threshold: 0.1 }
 )

 if (sectionRef.current) {
 observer.observe(sectionRef.current)
 }

 return () => observer.disconnect()
 }, [isLoaded, onLoad])

 return (
 <section
 ref={sectionRef}
 data-section-id={id}
 className={`predictive-section ${className}`}
 style={{
 minHeight: '100vh',
 position: 'relative'
 }}
 >
 {/* Preloading indicator */}
 {isPreloading && (
 <div className="absolute inset-0 flex items-center justify-center bg-paper-sub/50 backdrop-blur-sm z-10">
 <div className="flex items-center space-x-2">
 <div className="w-2 h-2 bg-amber-deep rounded-full animate-bounce"></div>
 <div className="w-2 h-2 bg-amber-deep rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
 <div className="w-2 h-2 bg-amber-deep rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
 </div>
 </div>
 )}

 {/* Content */}
 {isLoaded ? (
 <div className="animate-fade-in">
 {children}
 </div>
 ) : (
 <div className="min-h-screen flex items-center justify-center">
 {fallback || (
 <div className="text-center">
 <div className="w-8 h-8 border-2 border-amber-deep/40 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
 <p className="text-ink-muted">Loading section...</p>
 </div>
 )}
 </div>
 )}
 </section>
 )
}

// Specialized components
export function HeroSection({ children, ...props }: Omit<PredictiveSectionProps, 'preloadPriority'>) {
 return (
 <PredictiveSection {...props} preloadPriority="high">
 {children}
 </PredictiveSection>
 )
}

export function ContentSection({ children, ...props }: Omit<PredictiveSectionProps, 'preloadPriority'>) {
 return (
 <PredictiveSection {...props} preloadPriority="medium">
 {children}
 </PredictiveSection>
 )
}

export function FooterSection({ children, ...props }: Omit<PredictiveSectionProps, 'preloadPriority'>) {
 return (
 <PredictiveSection {...props} preloadPriority="low">
 {children}
 </PredictiveSection>
 )
}
