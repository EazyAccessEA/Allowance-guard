'use client'

import React, { useRef, useEffect, useState } from 'react'

interface LazySectionProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
}

export const LazySection = ({ 
  children, 
  className = '', 
  threshold = 0.1,
  rootMargin = '50px'
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          // Disconnect observer after first load
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div 
      ref={ref} 
      className={`lazy-load ${className}`}
      style={{
        minHeight: hasLoaded ? 'auto' : '500px',
        contain: 'layout style paint'
      }}
    >
      {isVisible ? children : (
        <div className="animate-pulse bg-gray-200 rounded h-64 w-full" />
      )}
    </div>
  )
}
