'use client'

import dynamic from 'next/dynamic'
import Section from '@/components/ui/Section'

// Lazy load video component
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), { ssr: false })

export default function GlobalHero() {
  return (
    <Section className="relative overflow-hidden min-h-[75vh] md:min-h-[85vh]">
      {/* 1) Video Background - Global */}
      <div className="absolute inset-0 z-0">
        <VideoBackground
          videoSrc="/V3AG.mp4"
          containerClassName="absolute inset-0"
          videoClassName="absolute inset-0 w-full h-full object-cover object-center"
          priority
          lazy={false}
          posterSrc="/AllowanceGuard_BG.png"
          decorative
        />
      </div>

      {/* 2) Glass Apple-white overlay: left 100% → right 25% - Global */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/100 to-white/25 dark:from-white/40 dark:to-white/10" />
        <div className="absolute inset-0 backdrop-blur-sm md:backdrop-blur-md" />
        {/* crisp glass edge on the far left */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/60" />
      </div>

      {/* 3) Page content will render here at z-20 */}
    </Section>
  )
}
