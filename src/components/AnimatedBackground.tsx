'use client'
import { useState, useEffect } from 'react'

interface AnimatedBackgroundProps {
  images: string[]
  delay?: number
  className?: string
}

export default function AnimatedBackground({ 
  images, 
  delay = 10000, 
  className = "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" 
}: AnimatedBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      )
    }, delay)

    return () => clearInterval(interval)
  }, [images.length, delay])

  return (
    <div 
      className={className}
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        transition: 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1), background-image 2s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'fadeInOut 2s ease-in-out'
      }}
    />
  )
}
