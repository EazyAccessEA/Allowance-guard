'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string
  containerClassName?: string
  videoClassName?: string
  posterSrc?: string
  lazy?: boolean // Enable lazy loading
  fallbackGradient?: string // Custom fallback gradient
  priority?: boolean // High priority loading
  decorative?: boolean // For decorative videos
}

export default function VideoBackground({ 
  videoSrc, 
  className = "absolute inset-0 w-full h-full object-cover object-center",
  containerClassName,
  videoClassName,
  posterSrc,
  lazy = false,
  fallbackGradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  priority = true,
  decorative = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy) // If not lazy, always in view
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority)

  // Mobile detection for battery/data optimization
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

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

    console.log('Loading video:', videoSrc)
    console.log('Video element:', video)

    const handleCanPlay = () => {
      console.log('Video can play, attempting autoplay...')
      setIsLoaded(true)
      // Try to autoplay regardless of mobile detection for hero videos
      if (isInView) {
        video.play().catch((error) => {
          console.log('Autoplay failed, but video is loaded:', error)
          // Don't set error for autoplay failures, just log them
        })
      }
    }

    const handleError = (event: Event) => {
      console.error('Video loading error:', event)
      console.error('Video src:', videoSrc)
      console.error('Video element:', videoRef.current)
      setHasError(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [shouldLoad, hasError, isInView, isMobile, videoSrc])

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

  // Cleanup on unmount
  useEffect(() => {
    const video = videoRef.current
    return () => {
      if (video) {
        video.pause()
        video.src = ''
      }
    }
  }, [])

  // Error fallback
  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={containerClassName || className}
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc})` : 'url(/AllowanceGuard_BG.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        role="presentation"
        aria-hidden="true"
      />
    )
  }

  // Loading state with background image fallback
  if (!shouldLoad || !isLoaded) {
    return (
      <div 
        ref={containerRef}
        className={containerClassName || className}
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc})` : 'url(/AllowanceGuard_BG.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
    <div 
      ref={containerRef} 
      className={containerClassName || className || `responsive-video ${hasError ? 'video-error' : ''} ${!isLoaded ? 'video-loading' : ''}`}
    >
      <video
        ref={videoRef}
        className={videoClassName || "video-optimized"}
        autoPlay={isInView && !isMobile()}
        loop
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={posterSrc}
        onError={() => setHasError(true)}
        aria-label={decorative ? undefined : "Allowance Guard background animation"}
        aria-hidden={decorative}
        role={decorative ? "presentation" : undefined}
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