import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import CascadingScrollAnimation, { FadeInScale } from '@/components/CascadingScrollAnimation'

const features = [
  [
    { title: 'Non-Custodial Security', text: 'Full control remains in your wallet. We never hold your keys, funds, or require any permissions to move them. Every transaction is executed directly from your wallet.' },
    { title: 'Clarity-First Dashboard', text: 'Designed to enterprise standards. See your entire security posture at a glance, with no jargon or confusion. Every piece of information is actionable and immediately understandable.' },
  ],
  [
    { title: 'Advanced Risk Intelligence', text: 'Risk scores are powered by real-time threat data, identifying known malicious contracts and anomalous approvals. Our intelligence engine continuously updates to stay ahead of emerging threats.' },
    { title: 'Gas-Efficient Revocation', text: 'Batch revoke multiple allowances in a single transaction to save on gas fees and time. Our smart contract optimization ensures you pay the minimum possible gas costs for maximum security.' },
  ],
]

export default function FeaturesPreview() {
  return (
    <CascadingScrollAnimation direction="up" distance={70} delay={600}>
      <Section className="py-16 sm:py-20 lg:py-24 bg-background-light dark:bg-secondary-900/50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <FadeInScale delay={300}>
              <div className="mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-secondary-100 leading-tight mb-6">
                  Built for Security &amp; Clarity
                </h2>
                <p className="text-xl text-text-secondary dark:text-secondary-400 leading-relaxed text-justify">
                  Every feature is designed with one goal: keeping your assets secure.
                </p>
              </div>
            </FadeInScale>

            <div className="grid lg:grid-cols-2 gap-16">
              {features.map((col, i) => (
                <div key={i} className="space-y-12">
                  {col.map((f) => (
                    <div key={f.title} className="px-6 py-8">
                      <h3 className="text-2xl font-bold text-text-primary mb-6">{f.title}</h3>
                      <p className="text-lg text-text-secondary leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </CascadingScrollAnimation>
  )
}
