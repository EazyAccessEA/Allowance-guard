'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface ScrollPredictionOptions {
  preloadDistance?: number
  scrollThreshold?: number
  batteryOptimized?: boolean
}

export function useScrollPrediction(options: ScrollPredictionOptions = {}) {
  const {
    preloadDistance = 800,
    scrollThreshold = 50,
    batteryOptimized = true
  } = options

  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'idle'>('idle')
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [sectionsToPreload, setSectionsToPreload] = useState<string[]>([])

  const lastScrollY = useRef(0)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  // Track scroll behavior
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY
    const deltaY = currentScrollY - lastScrollY.current
    const velocity = Math.abs(deltaY)
    
    setScrollVelocity(velocity)
    setIsScrolling(true)
    
    if (Math.abs(deltaY) > 5) {
      setScrollDirection(deltaY > 0 ? 'down' : 'up')
    }
    
    lastScrollY.current = currentScrollY
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
    
    // Set idle state after scroll stops
    scrollTimeout.current = setTimeout(() => {
      setScrollDirection('idle')
      setScrollVelocity(0)
      setIsScrolling(false)
    }, 150)
  }, [])

  // Predict which sections to preload
  const predictSections = useCallback(() => {
    const sections = document.querySelectorAll('[data-section-id]')
    const viewportHeight = window.innerHeight
    const sectionsToLoad: string[] = []

    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id')
      if (!sectionId) return

      const rect = section.getBoundingClientRect()
      
      // Predict based on scroll direction and velocity
      let shouldPreload = false
      
      if (scrollDirection === 'down' && rect.top > -preloadDistance && rect.top < viewportHeight + preloadDistance) {
        shouldPreload = true
      } else if (scrollDirection === 'up' && rect.bottom > -preloadDistance && rect.bottom < viewportHeight + preloadDistance) {
        shouldPreload = true
      }
      
      // Boost preloading for fast scrolling
      if (scrollVelocity > scrollThreshold) {
        shouldPreload = true
      }
      
      if (shouldPreload) {
        sectionsToLoad.push(sectionId)
      }
    })

    setSectionsToPreload(sectionsToLoad)
  }, [scrollDirection, scrollVelocity, preloadDistance, scrollThreshold])

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Predict sections periodically
    const predictionInterval = setInterval(predictSections, 100)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(predictionInterval)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [handleScroll, predictSections])

  // Battery optimization
  useEffect(() => {
    if (!batteryOptimized) return

    const checkBattery = async () => {
      try {
        // @ts-expect-error - Battery API is experimental
        const battery = await navigator.getBattery?.()
        if (battery && battery.level < 0.2) {
          console.log('Low battery detected, reducing preloading')
        }
      } catch {
        // Battery API not supported, continue normally
      }
    }

    checkBattery()
  }, [batteryOptimized])

  return {
    scrollDirection,
    scrollVelocity,
    isScrolling,
    sectionsToPreload,
    shouldPreloadSection: (sectionId: string) => sectionsToPreload.includes(sectionId)
  }
}
