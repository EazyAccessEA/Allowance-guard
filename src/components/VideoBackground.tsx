'use client'
import { useRef, useEffect, useState } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string
}

export default function VideoBackground({ 
  videoSrc, 
  className = "absolute inset-0 w-full h-full object-cover"
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video && !hasError) {
      video.play().catch(() => {
        // Silently handle autoplay failures
        setHasError(true)
      })
    }
  }, [hasError])

  const handleError = () => {
    // Silently handle video loading errors to prevent console spam
    setHasError(true)
  }

  // If video fails to load, return a fallback background
  if (hasError) {
    return (
      <div 
        className={className}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
        role="presentation"
        aria-hidden="true"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      onError={handleError}
      aria-label="Allowance Guard background animation"
    >
      <source src={videoSrc} type="video/mp4" />
      <track
        kind="captions"
        srcLang="en"
        label="English"
        src=""
        default
      />
      Your browser does not support the video tag.
    </video>
  )
}
