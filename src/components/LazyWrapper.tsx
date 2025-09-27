'use client'

import React, { Suspense, lazy, ComponentType } from 'react'

interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  threshold?: number
  rootMargin?: string
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
)

// Lazy wrapper with intersection observer
export default function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  fallback?: React.ReactNode
) {
  return function LazyComponent(props: T) {
    return (
      <LazyWrapper fallback={fallback}>
        <Component {...props} />
      </LazyWrapper>
    )
  }
}

// Lazy load components that are not critical for initial render
export const LazyBlogSection = lazy(() => import('@/components/BlogSection'))
export const LazyTestimonials = lazy(() => import('@/components/Testimonials'))
export const LazyFooter = lazy(() => import('@/components/Footer'))
export const LazyPerformanceDashboard = lazy(() => import('@/components/PerformanceDashboard'))

// Intersection observer hook for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}
