'use client'

import React, { useState, useEffect } from 'react'

interface MultiLineTypewriterProps {
  messages: string[]
  typingSpeed: number
  deletingSpeed: number
  pauseTime: number
  onRender: (firstLine: string, secondLine: string) => React.ReactElement
}

export const MultiLineTypewriter = ({
  messages,
  typingSpeed,
  deletingSpeed,
  pauseTime,
  onRender
}: MultiLineTypewriterProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [firstLine, setFirstLine] = useState('')
  const [secondLine, setSecondLine] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDeletingPaused, setIsDeletingPaused] = useState(false)
  const [currentLine, setCurrentLine] = useState(1)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    let isActive = true
    const currentMessage = messages[currentMessageIndex]
    const words = currentMessage.split(/\s+/)
    
    // Use setTimeout for consistent timing
    const scheduleUpdate = (callback: () => void, delay: number) => {
      if (!isActive) return
      
      timer = setTimeout(() => {
        if (isActive) callback()
      }, delay)
    }
    
    // Mobile performance optimization - faster animation like Fireart
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const mobileTypingSpeed = typingSpeed * 0.7 // Faster for mobile like Fireart
    const mobileDeletingSpeed = deletingSpeed * 0.5
    const mobilePauseTime = pauseTime * 0.8
    
    const effectiveTypingSpeed = isMobile ? mobileTypingSpeed : typingSpeed
    const effectiveDeletingSpeed = isMobile ? mobileDeletingSpeed : deletingSpeed
    const effectivePauseTime = isMobile ? mobilePauseTime : pauseTime
    const targetFirstLine = words.slice(0, 2).join(' ')
    const targetSecondLine = words.slice(2).join(' ')

    if (isPaused) {
      scheduleUpdate(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, effectivePauseTime)
    } else if (isDeleting) {
      if (secondLine.length > 0) {
        scheduleUpdate(() => {
          setSecondLine(secondLine.slice(0, -1))
        }, effectiveDeletingSpeed)
      } else if (firstLine.length > 0) {
        scheduleUpdate(() => {
          setFirstLine(firstLine.slice(0, -1))
        }, effectiveDeletingSpeed)
      } else {
        setIsDeleting(false)
        setIsDeletingPaused(true)
        // Add pause after deletion before moving to next message
        scheduleUpdate(() => {
          setIsDeletingPaused(false)
          setCurrentLine(1)
          setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
        }, 1000) // 1 second pause after deletion
      }
    } else {
      if (currentLine === 1) {
        if (firstLine.length < targetFirstLine.length) {
          scheduleUpdate(() => {
            setFirstLine(targetFirstLine.slice(0, firstLine.length + 1))
          }, effectiveTypingSpeed)
        } else {
          setCurrentLine(2)
        }
      } else {
        if (secondLine.length < targetSecondLine.length) {
          scheduleUpdate(() => {
            setSecondLine(targetSecondLine.slice(0, secondLine.length + 1))
          }, effectiveTypingSpeed)
        } else if (secondLine.length === targetSecondLine.length) {
          setIsPaused(true)
        }
      }
    }

    return () => {
      isActive = false
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [currentMessageIndex, firstLine, secondLine, isDeleting, isPaused, isDeletingPaused, currentLine, messages, typingSpeed, deletingSpeed, pauseTime])

  return onRender(firstLine, secondLine)
}
