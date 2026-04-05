import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import CascadingScrollAnimation, { FadeInScale } from '@/components/CascadingScrollAnimation'

export default function HowItWorks() {
  return (
    <CascadingScrollAnimation direction="up" distance={80} delay={400}>
      <Section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0A0E1A]">
        <Container>
          <FadeInScale delay={200}>
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-secondary-100 leading-tight mb-6">
                How Allowance Guard Works
              </h2>
              <p className="text-xl text-text-secondary dark:text-secondary-400 leading-relaxed">
                Three simple steps to secure your wallet and protect your assets.
              </p>
            </div>
          </FadeInScale>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <Step
              number={1}
              title="Connect & Scan"
              description="Connect your wallet securely. We read public blockchain data only. Your private keys and funds remain completely under your control."
            />
            <Step
              number={2}
              title="Analyze & Understand"
              description="Get a clear risk assessment instantly. We analyze every allowance and flag risky, unlimited, or malicious approvals with advanced intelligence."
            />
            <Step
              number={3}
              title="Act & Secure"
              description="Revoke with confidence. One-click revocation executes directly from your wallet. Batch multiple revocations to save on gas fees."
            />
          </div>
        </Container>
      </Section>
    </CascadingScrollAnimation>
  )
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center px-6 py-8">
      <div className="w-20 h-20 bg-primary-accent/10 dark:bg-primary-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
        <span className="text-3xl font-bold text-primary-accent">{number}</span>
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-6">{title}</h3>
      <p className="text-lg text-text-secondary leading-relaxed">{description}</p>
    </div>
  )
}
