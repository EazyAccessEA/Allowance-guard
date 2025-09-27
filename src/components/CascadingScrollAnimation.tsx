'use client'

import { useEffect, useRef, useState } from 'react'

interface CascadingScrollAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  threshold?: number
  stagger?: number
}

export default function CascadingScrollAnimation({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 600,
  threshold = 0.1,
  stagger = 100
}: CascadingScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      {
        threshold,
        rootMargin: '50px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, threshold, hasAnimated])

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return `translateY(${distance}px)`
        case 'down': return `translateY(-${distance}px)`
        case 'left': return `translateX(${distance}px)`
        case 'right': return `translateX(-${distance}px)`
        default: return `translateY(${distance}px)`
      }
    }
    return 'translateY(0) translateX(0)'
  }

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transform: getTransform(),
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Staggered animation for multiple children
export function StaggeredAnimation({
  children,
  className = '',
  stagger = 100,
  direction = 'up',
  distance = 30
}: {
  children: React.ReactNode[]
  className?: string
  stagger?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <CascadingScrollAnimation
          key={index}
          delay={index * stagger}
          direction={direction}
          distance={distance}
        >
          {child}
        </CascadingScrollAnimation>
      ))}
    </div>
  )
}

// Fade in with scale animation
export function FadeInScale({
  children,
  className = '',
  delay = 0,
  scale = 0.95
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  scale?: number
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, delay)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay, hasAnimated])

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        transform: isVisible ? 'scale(1)' : `scale(${scale})`,
        opacity: isVisible ? 1 : 0,
        transitionDuration: '600ms',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Parallax scroll effect
export function ParallaxScroll({
  children,
  className = '',
  speed = 0.5
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * speed
        setOffset(rate)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offset}px)`
      }}
    >
      {children}
    </div>
  )
}
