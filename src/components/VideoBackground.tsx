'use client'
import { useRef, useEffect } from 'react'

interface VideoBackgroundProps {
  videoSrc: string
  className?: string
}

export default function VideoBackground({ 
  videoSrc, 
  className = "absolute inset-0 w-full h-full object-cover"
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(console.error)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
    >
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}
