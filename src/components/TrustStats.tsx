import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import CascadingScrollAnimation, { FadeInScale } from '@/components/CascadingScrollAnimation'

export default function TrustStats() {
  return (
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
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent dark:text-primary-400 mb-2">
                  50,000+
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Wallets Secured
                </div>
                <div className="text-text-secondary">
                  Monthly active users protecting their assets
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent dark:text-primary-400 mb-2">
                  2M+
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Allowances Analyzed
                </div>
                <div className="text-text-secondary">
                  Token approvals scanned and risk-assessed
                </div>
              </div>

              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-primary-accent dark:text-primary-400 mb-2">
                  24/7
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  Security Monitoring
                </div>
                <div className="text-text-secondary">
                  Real-time threat detection and alerts
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Trust Indicators */}
      <Section className="py-8 bg-surface-base">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-text-secondary dark:text-secondary-400 font-medium">
              No private keys required • Read-only access • Free core • Open source
            </p>
          </div>
        </Container>
      </Section>
    </CascadingScrollAnimation>
  )
}
