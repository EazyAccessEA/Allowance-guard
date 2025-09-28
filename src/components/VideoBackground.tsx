'use client'
import { useRef, useEffect, useState, useCallback } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string               // (legacy) container class — prefer containerClassName
  containerClassName?: string      // container class
  videoClassName?: string          // actual <video> class
  posterSrc?: string
  lazy?: boolean
  fallbackGradient?: string
  priority?: boolean
  decorative?: boolean
}

export default function VideoBackground({
  videoSrc,
  className, // kept for backward compat, but prefer containerClassName
  containerClassName = 'absolute inset-0',
  videoClassName = 'absolute inset-0 w-full h-full object-cover object-center',
  posterSrc,
  lazy = false,
  fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  priority = true,
  decorative = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority)

  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }, [])

  useEffect(() => {
    if (!lazy || shouldLoad) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        setShouldLoad(true)
        obs.disconnect()
      }
    }, { rootMargin: '50px', threshold: 0.1 })

    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [lazy, shouldLoad])

  useEffect(() => {
    if (!shouldLoad || hasError) return
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      // Always attempt autoplay; muted + playsInline satisfies most policies
      video.play().catch(() => {/* ignore */})
    }
    const handleError = () => setHasError(true)

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [shouldLoad, hasError])

  useEffect(() => {
    if (!lazy || !videoRef.current) return
    const obs = new IntersectionObserver(([entry]) => {
      const video = videoRef.current
      if (!video) return
      if (entry.isIntersecting) {
        if (video.paused && isLoaded) video.play().catch(() => {})
      } else {
        if (!video.paused) video.pause()
      }
    }, { threshold: 0.1 })

    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [lazy, isLoaded])

  useEffect(() => {
    const v = videoRef.current
    return () => {
      if (v) {
        v.pause()
        v.src = ''
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

  // Loading fallback
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
          position: 'absolute',
          inset: 0
        }}
        role="presentation"
        aria-hidden="true"
      >
        {shouldLoad && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={containerClassName || className}
      style={{ pointerEvents: 'none' }} // let the hero UI be fully clickable
    >
      <video
        ref={videoRef}
        className={videoClassName}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? 'auto' : 'metadata'}
        poster={posterSrc}
        onError={() => setHasError(true)}
        aria-label={decorative ? undefined : 'Allowance Guard background animation'}
        aria-hidden={decorative}
        role={decorative ? 'presentation' : undefined}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export function HeroVideo(props: VideoBackgroundProps) {
  return <VideoBackground {...props} priority lazy={false} />
}

export function LazyVideo(props: VideoBackgroundProps) {
  return <VideoBackground {...props} lazy priority={false} />
}