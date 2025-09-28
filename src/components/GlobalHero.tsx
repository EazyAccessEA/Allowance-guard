'use client'

import dynamic from 'next/dynamic'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import ClientConnectButton from '@/components/ClientConnectButton'
import TestConnect from '@/components/TestConnect'

// Lazy load heavy bits
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), { ssr: false })
const MultiLineTypewriter = dynamic(
  () => import('@/components/MultiLineTypewriter').then(m => ({ default: m.MultiLineTypewriter })),
  { ssr: false, loading: () => <span className="text-primary-700">see every hidden connection clearly</span> }
)

export default function GlobalHero() {
  return (
    <Section className="relative overflow-hidden min-h-[75vh] md:min-h-[85vh]">
      {/* 1) Video */}
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

      {/* 2) Glass Apple-white overlay: left 100% → right 25% */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-white/100 to-white/25 dark:from-white/40 dark:to-white/10" />
        <div className="absolute inset-0 backdrop-blur-sm md:backdrop-blur-md" />
        {/* crisp glass edge on the far left */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/60" />
      </div>

      {/* 3) Content */}
      <Container className="relative z-20 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:mobbin-display-1 text-text-primary mb-2 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 leading-tight">
          <div className="min-h-[4.5em] sm:min-h-[4em] md:min-h-[3.5em] flex flex-col justify-center">
            <MultiLineTypewriter
              messages={[
                'see every hidden connection clearly',
                'instantly revoke any risky approval',
                'find and cut off silent threats',
                'control who has access to funds'
              ]}
              typingSpeed={200}
              deletingSpeed={50}
              pauseTime={4000}
              onRender={(firstLine, secondLine) => (
                <>
                  <span className="block">
                    <span className="text-text-primary">The power to </span>
                    <span className="text-primary-700">{firstLine}</span>
                  </span>
                  <span className="block text-primary-700">
                    {secondLine}
                    <span className="ml-0.5 inline-block h-6 w-0.5 bg-primary-700 animate-pulse" />
                  </span>
                </>
              )}
            />
          </div>
        </h1>

        <p className="mobbin-body-large text-text-secondary/90 leading-relaxed mb-6 sm:mb-8 md:mb-10">
          A free and open source dashboard to review, revoke, and monitor wallet permissions across chains.
        </p>

        {/* Global CTA (keeps it simple across pages) */}
        <div className="flex flex-col gap-4">
          <ClientConnectButton variant="primary" size="lg" className="w-full sm:!w-auto sm:self-start" />
          <TestConnect onConnect={() => { /* no-op globally */ }} />
        </div>
      </Container>
    </Section>
  )
}
