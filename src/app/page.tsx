import type { Metadata } from 'next'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { Eyebrow } from '@/components/ui/Heading'
import SubscribeForm from '@/app/coming-soon/SubscribeForm'

export const metadata: Metadata = {
  title: 'AllowanceGuard — Coming Soon',
  description:
    'The next generation of wallet security tools. Join the waitlist for early access.',
  openGraph: {
    title: 'AllowanceGuard — Coming Soon',
    description:
      'Join the waitlist for early access to AllowanceGuard.',
    url: 'https://www.allowanceguard.com',
  },
}

const UPCOMING = [
  {
    numeral: 'I',
    title: 'Mobile App',
    description: 'Monitor approvals and revoke on the go. Push notifications for real-time alerts.',
  },
  {
    numeral: 'II',
    title: 'Developer SDK',
    description: 'Embed approval scanning and revocation in your own dApp with a few lines of code.',
  },
  {
    numeral: 'III',
    title: 'New Chains',
    description: 'Expanding beyond 27 chains. Solana, Sui, and more on the roadmap.',
  },
] as const

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Hero */}
      <Section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 paper grain overflow-hidden">
        {/* Signature oversized watermark */}
        <div
          className="absolute top-8 right-4 sm:right-12 text-[12rem] sm:text-[18rem] leading-none font-serif italic text-ink/[0.03] select-none pointer-events-none"
          aria-hidden="true"
        >
          &amp;
        </div>

        <Container size="sm" className="relative z-10">
          <Eyebrow className="mb-5 text-amber-deep">Early access</Eyebrow>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif italic text-ink tracking-[-0.02em] leading-[1.1] mb-6">
            Something new is{' '}
            <span className="text-crimson-paper">brewing.</span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-soft font-plex leading-relaxed max-w-xl mb-10">
            We're building the next generation of wallet security tools.
            Join the waitlist and be the first to know.
          </p>

          <div className="ledger-rule-short mb-10" />
        </Container>
      </Section>

      {/* What's coming */}
      <Section background="muted" className="paper-sub grain py-16 sm:py-20">
        <Container size="sm">
          <h2 className="text-2xl sm:text-3xl font-medium text-ink tracking-[-0.01em] mb-10 font-plex">
            On the horizon
          </h2>

          <div className="space-y-6">
            {UPCOMING.map((item) => (
              <div
                key={item.numeral}
                className="paper-card p-6 sm:p-8 flex gap-5 sm:gap-7 items-start"
              >
                <span
                  className="text-3xl sm:text-4xl font-serif italic text-amber-deep/60 leading-none select-none shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {item.numeral}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-ink mb-1 font-plex">
                    {item.title}
                  </h3>
                  <p className="text-ink-muted text-[15px] leading-relaxed font-plex">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Subscribe form */}
      <Section className="paper grain py-16 sm:py-24">
        <Container size="xs" className="max-w-md">
          <SubscribeForm />
        </Container>
      </Section>

      {/* Oxblood closing band */}
      <section className="bg-oxblood py-14 sm:py-16 text-center">
        <Container size="sm">
          <h2 className="text-2xl sm:text-3xl font-serif italic text-cream tracking-[-0.01em] mb-4">
            Wallet security, <span className="text-crimson-paper">reimagined.</span>
          </h2>
          <p className="text-cream/70 font-plex text-[15px] max-w-md mx-auto">
            Open source. Independently operated. Built to last.
          </p>
        </Container>
      </section>
    </div>
  )
}
