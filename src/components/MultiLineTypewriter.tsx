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
  const [currentLine, setCurrentLine] = useState(1)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    const currentMessage = messages[currentMessageIndex]
    const words = currentMessage.split(/\s+/)
    
    // TBT Optimization - Use requestIdleCallback for non-blocking execution
    const scheduleUpdate = (callback: () => void, delay: number) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        const id = requestIdleCallback(callback, { timeout: delay })
        timer = { 
          [Symbol.toPrimitive]: () => id,
          valueOf: () => id,
          toString: () => id.toString()
        } as NodeJS.Timeout
      } else {
        timer = setTimeout(callback, delay)
      }
    }
    
    // Mobile performance optimization - reduce animation speed for TBT
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const mobileTypingSpeed = typingSpeed * 3 // Much slower for mobile TBT
    const mobileDeletingSpeed = deletingSpeed * 3
    const mobilePauseTime = pauseTime * 0.3
    
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
        setCurrentLine(1)
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
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
      if (timer) {
        if (typeof timer === 'number') {
          clearTimeout(timer)
        } else {
          // For requestIdleCallback, we can't cancel it, but it's non-blocking anyway
        }
      }
    }
  }, [currentMessageIndex, firstLine, secondLine, isDeleting, isPaused, currentLine, messages, typingSpeed, deletingSpeed, pauseTime])

  return onRender(firstLine, secondLine)
}
