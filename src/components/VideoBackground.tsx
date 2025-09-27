'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string
  lazy?: boolean // Enable lazy loading
  fallbackGradient?: string // Custom fallback gradient
  priority?: boolean // High priority loading
}

export default function VideoBackground({ 
  videoSrc, 
  className = "absolute inset-0 w-full h-full object-cover",
  lazy = true,
  fallbackGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  priority = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy) // If not lazy, always in view
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, shouldLoad])

  // Video loading and playback logic
  useEffect(() => {
    if (!shouldLoad || hasError) return

    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      // Only autoplay if in viewport and not on mobile (battery/data saving)
      if (isInView && !isMobile()) {
        video.play().catch(() => {
          // Silently handle autoplay failures
          setHasError(true)
        })
      }
    }

    const handleError = () => {
      setHasError(true)
    }

    const handleLoadStart = () => {
      // Set loading state
      setIsLoaded(false)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
    }
  }, [shouldLoad, hasError, isInView])

  // Pause video when out of viewport (battery saving)
  useEffect(() => {
    if (!lazy || !videoRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current
        if (!video) return

        if (entry.isIntersecting) {
          if (video.paused && isLoaded) {
            video.play().catch(() => {
              // Silently handle play failures
            })
          }
        } else {
          if (!video.paused) {
            video.pause()
          }
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, isLoaded])

  // Mobile detection for battery/data optimization
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
    }
  }, [])

  // Error fallback
  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={className}
        style={{
          background: fallbackGradient
        }}
        role="presentation"
        aria-hidden="true"
      />
    )
  }

  // Loading state with gradient fallback
  if (!shouldLoad || !isLoaded) {
    return (
      <div 
        ref={containerRef}
        className={className}
        style={{
          background: fallbackGradient,
          position: 'relative'
        }}
        role="presentation"
        aria-hidden="true"
      >
        {/* Loading indicator */}
        {shouldLoad && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <video
        ref={videoRef}
        className={className}
        autoPlay={isInView && !isMobile()}
        loop
        muted
        playsInline
        preload={priority ? "metadata" : "none"} // Only preload metadata for priority videos
        onError={() => setHasError(true)}
        aria-label="Allowance Guard background animation"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

// Specialized components for different use cases
export function HeroVideo(props: VideoBackgroundProps) {
  return (
    <VideoBackground
      {...props}
      priority={true}
      lazy={false}
    />
  )
}

export function LazyVideo(props: VideoBackgroundProps) {
  return (
    <VideoBackground
      {...props}
      lazy={true}
      priority={false}
    />
  )
}