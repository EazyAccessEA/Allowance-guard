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
  className = "absolute inset-0 bg-cover bg-center bg-no-repeat opacity-45" 
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
        transition: 'background-image 1s ease-in-out'
      }}
    />
  )
}
