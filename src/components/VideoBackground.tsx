'use client'
import { useRef, useEffect, useState } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string               // (legacy) container class — prefer containerClassName
  containerClassName?: string      // container class
  videoClassName?: string          // actual <video> class
  posterSrc?: string
  lazy?: boolean
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
  priority = true,
  decorative = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [, setIsInView] = useState(!lazy)
  const [shouldLoad, setShouldLoad] = useState(!lazy || priority)

  // Mobile detection (currently unused but kept for future use)
  // const isMobile = useCallback(() => {
  //   if (typeof window === 'undefined') return false
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  // }, [])

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

    // Clear any existing source to prevent cache issues
    video.src = ''
    video.load()

    // Add cache-busting parameter to ensure fresh video load
    const videoSrcWithCache = `${videoSrc}?v=${Date.now()}`
    video.src = videoSrcWithCache

    const handleLoadedData = () => {
      setIsLoaded(true)
      video.play().catch(() => {/* ignore autoplay failures since muted+inline is set */})
    }
    const handleError = () => setHasError(true)

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [shouldLoad, hasError, videoSrc])

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

  return (
    <div
      ref={containerRef}
      className={containerClassName || className || 'absolute inset-0'}
      style={{ position: 'absolute', inset: 0 }}
    >
      {/* Poster as CSS bg while the <video> is decoding (nice visual continuity) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: posterSrc ? `url(${posterSrc})` : 'url(/AllowanceGuard_BG.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 300ms ease-in-out'
        }}
        aria-hidden
      />

      <video
        ref={videoRef}
        className={videoClassName || "absolute inset-0 w-full h-full object-cover"}
        autoPlay
        loop
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        poster={posterSrc}
        onError={() => setHasError(true)}
        aria-label={decorative ? undefined : "Allowance Guard background animation"}
        aria-hidden={decorative}
        role={decorative ? "presentation" : undefined}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 300ms ease-in-out' }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Optional spinner while decoding */}
      {!isLoaded && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export function HeroVideo(props: VideoBackgroundProps) {
  return <VideoBackground {...props} priority lazy={false} />
}

export function LazyVideo(props: VideoBackgroundProps) {
  return <VideoBackground {...props} lazy priority={false} />
}