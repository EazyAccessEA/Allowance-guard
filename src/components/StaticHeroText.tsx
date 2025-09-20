'use client'

import React from 'react'

interface StaticHeroTextProps {
  messages: string[]
  currentIndex: number
}

export const StaticHeroText = ({ messages, currentIndex }: StaticHeroTextProps) => {
  const currentMessage = messages[currentIndex] || messages[0]
  const words = currentMessage.split(/\s+/)
  const firstLine = words.slice(0, 2).join(' ')
  const secondLine = words.slice(2).join(' ')

  return (
    <>
      <span className="inline-block">{firstLine}</span>
      <br />
      <span className="inline-block">{secondLine}</span>
    </>
  )
}
