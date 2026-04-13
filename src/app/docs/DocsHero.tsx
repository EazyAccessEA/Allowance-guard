import Container from '@/components/ui/Container'

/**
 * DocsHero — Shared Ledger-aesthetic hero for all docs subpages.
 * Replaces VideoBackground + old H1 pattern.
 */

interface DocsHeroProps {
  eyebrow: string
  title: string
  lede: string
}

export default function DocsHero({ eyebrow, title, lede }: DocsHeroProps) {
  return (
    <section className="paper grain relative py-20 sm:py-28 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(245,158,11,0.10) 0%, transparent 55%),' +
            'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(250,244,230,0.6) 0%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 10%, rgba(245,158,11,0.5) 50%, transparent 90%)',
        }}
      />

      <Container className="relative z-10">
        <div className="max-w-4xl">
          <div className="inline-flex items-baseline gap-3 mb-6">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-amber-deep">
              Docs
            </span>
            <span className="h-px w-8 bg-ink-rule" aria-hidden="true" />
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-ink-whisper">
              {eyebrow}
            </span>
          </div>

          <h1 className="font-display-tight text-ink leading-[0.95] text-3xl sm:text-4xl lg:text-5xl mb-5">
            {title}
          </h1>
          <p className="font-plex text-lg text-ink-muted max-w-2xl leading-[1.55]">
            {lede}
          </p>
        </div>
      </Container>
    </section>
  )
}
