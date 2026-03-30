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
  const [isPostDeletionPaused, setIsPostDeletionPaused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize the component
  useEffect(() => {
    if (!isInitialized && messages.length > 0) {
      setIsInitialized(true)
      // Start with the first message to prevent layout shift
      setDisplayedText(messages[0])
    }
  }, [isInitialized, messages])

  useEffect(() => {
    if (!isInitialized || messages.length === 0) return

    // Start the animation cycle after a brief delay to show the first message
    const startDelay = setTimeout(() => {
      setIsPaused(true) // Start with pause to show first message
    }, 1000) // 1 second delay to show first message

    return () => clearTimeout(startDelay)
  }, [isInitialized, messages.length])

  useEffect(() => {
    if (!isInitialized || messages.length === 0) return

    // Handle post-deletion pause
    if (isPostDeletionPaused) {
      const postDeletionTimeout = setTimeout(() => {
        setIsPostDeletionPaused(false)
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
      }, 2000) // 2-second pause after deletion
      return () => clearTimeout(postDeletionTimeout)
    }

    // Handle typing pause
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
          // Finished deleting, start post-deletion pause
          setIsDeleting(false)
          setIsPostDeletionPaused(true)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, isPaused, isPostDeletionPaused, currentMessageIndex, messages, typingSpeed, deletingSpeed, pauseTime, isInitialized])

  // Split displayed text by line breaks and render with <br> tags
  const renderText = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ))
  }

  // Fallback if component fails to initialize
  if (!isInitialized && messages.length > 0) {
    return (
      <span className={className}>
        {staticPrefix}
        {renderText(messages[0])}
        <span className="animate-pulse">|</span>
      </span>
    )
  }

  return (
    <span className={className}>
      {staticPrefix}
      {renderText(displayedText)}
      <span className="animate-pulse">|</span>
    </span>
  )
}
