'use client'

import { useState, useEffect } from 'react'

interface RotatingTypewriterProps {
  messages: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  className?: string
  staticPrefix?: string
}

export default function RotatingTypewriter({
  messages,
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseTime = 2000,
  className = '',
  staticPrefix = ''
}: RotatingTypewriterProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
      return () => clearTimeout(pauseTimeout)
    }

    const currentMessage = messages[currentMessageIndex]
    const speed = isDeleting ? deletingSpeed : typingSpeed

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentMessage.length) {
          setDisplayedText(currentMessage.slice(0, displayedText.length + 1))
        } else {
          // Finished typing, start pause
          setIsPaused(true)
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1))
        } else {
          // Finished deleting, move to next message
          setIsDeleting(false)
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, isPaused, currentMessageIndex, messages, typingSpeed, deletingSpeed, pauseTime])

  return (
    <span className={className}>
      {staticPrefix}
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}
