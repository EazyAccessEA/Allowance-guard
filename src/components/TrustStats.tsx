import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import CascadingScrollAnimation, { FadeInScale } from '@/components/CascadingScrollAnimation'

const stats = [
  { value: '50,000+', label: 'Wallets Secured', desc: 'Monthly active users protecting their assets' },
  { value: '2M+', label: 'Allowances Analyzed', desc: 'Token approvals scanned and risk-assessed' },
  { value: '24/7', label: 'Security Monitoring', desc: 'Real-time threat detection and alerts' },
]

export default function TrustStats() {
  return (
    <>
      {/* Statistics */}
      <CascadingScrollAnimation direction="up" distance={60} delay={200}>
        <Section className="py-16 bg-gradient-to-br from-primary-50 to-background-light dark:from-secondary-900 dark:to-[#0A0E1A]">
          <Container>
            <div className="max-w-6xl mx-auto">
              <FadeInScale delay={100}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-secondary-100 mb-4">
                    Trusted by Security-Conscious Users
                  </h2>
                  <p className="text-xl text-text-secondary dark:text-secondary-400">
                    Protecting digital assets across the Web3 ecosystem
                  </p>
                </div>
              </FadeInScale>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-4xl sm:text-5xl font-bold text-primary-accent dark:text-primary-400 mb-2">
                      {s.value}
                    </div>
                    <div className="text-lg font-semibold text-text-primary mb-1">{s.label}</div>
                    <div className="text-text-secondary">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </CascadingScrollAnimation>

      {/* Trust Indicators */}
      <Section className="py-8 bg-white dark:bg-[#0A0E1A]">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-text-secondary dark:text-secondary-400 font-medium">
              No private keys required &bull; Read-only access &bull; Free core &bull; Open source
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
