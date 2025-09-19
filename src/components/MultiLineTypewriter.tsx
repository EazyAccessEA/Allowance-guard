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
    let timer: NodeJS.Timeout
    const currentMessage = messages[currentMessageIndex]
    const words = currentMessage.split(/\s+/)
    const targetFirstLine = words.slice(0, 2).join(' ')
    const targetSecondLine = words.slice(2).join(' ')

    if (isPaused) {
      timer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting) {
      if (secondLine.length > 0) {
        timer = setTimeout(() => {
          setSecondLine(secondLine.slice(0, -1))
        }, deletingSpeed)
      } else if (firstLine.length > 0) {
        timer = setTimeout(() => {
          setFirstLine(firstLine.slice(0, -1))
        }, deletingSpeed)
      } else {
        setIsDeleting(false)
        setCurrentLine(1)
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
      }
    } else {
      if (currentLine === 1) {
        if (firstLine.length < targetFirstLine.length) {
          timer = setTimeout(() => {
            setFirstLine(targetFirstLine.slice(0, firstLine.length + 1))
          }, typingSpeed)
        } else {
          setCurrentLine(2)
        }
      } else {
        if (secondLine.length < targetSecondLine.length) {
          timer = setTimeout(() => {
            setSecondLine(targetSecondLine.slice(0, secondLine.length + 1))
          }, typingSpeed)
        } else if (secondLine.length === targetSecondLine.length) {
          setIsPaused(true)
        }
      }
    }

    return () => clearTimeout(timer)
  }, [currentMessageIndex, firstLine, secondLine, isDeleting, isPaused, currentLine, messages, typingSpeed, deletingSpeed, pauseTime])

  return onRender(firstLine, secondLine)
}
