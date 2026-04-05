import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import CascadingScrollAnimation from '@/components/CascadingScrollAnimation'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'DeFi Trader',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    quote:
      'I was shocked to find 15 unlimited approvals I had forgotten about. AllowanceGuard helped me clean up my wallet and sleep better at night. The risk assessment is incredibly detailed.',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'NFT Collector',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    quote:
      'As someone who interacts with dozens of dApps, I need to stay on top of my approvals. AllowanceGuard makes it simple and fast. The batch revocation feature saved me hours.',
  },
  {
    name: 'Alex Thompson',
    role: 'DAO Member',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    quote:
      'The transparency of open-source code gives me confidence. I can see exactly what AllowanceGuard is doing with my data. No hidden fees, no data collection - just pure security.',
  },
  {
    name: 'Elena Volkov',
    role: 'Smart Contract Developer',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    quote:
      'Multi-chain support is crucial for my work. Being able to check allowances across Ethereum, Arbitrum, and Base in one interface is a game-changer. The API integration is seamless.',
  },
  {
    name: 'David Kim',
    role: 'Crypto Investor',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    quote:
      'The real-time monitoring alerts saved me from a potential exploit. I got notified about a suspicious contract before I could interact with it. This tool is essential for any serious investor.',
  },
  {
    name: 'Lisa Wang',
    role: 'Web3 Educator',
    icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4',
    quote:
      "I recommend AllowanceGuard to all my students. The educational content and clear explanations help them understand Web3 security. It's not just a tool, it's a learning platform.",
  },
]

export default function Testimonials() {
  return (
    <CascadingScrollAnimation direction="up" distance={60} delay={1000}>
      <Section className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-[#0A0E1A]">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary dark:text-secondary-100 leading-tight mb-6">
                Hear Why Our Users Choose Allowance Guard
              </h2>
              <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
                Real stories from security-conscious users who have protected their digital assets
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </CascadingScrollAnimation>
  )
}

function TestimonialCard({ name, role, icon, quote }: (typeof TESTIMONIALS)[number]) {
  return (
    <div className="bg-background-light dark:bg-secondary-800/50 rounded-2xl p-8 border border-border-primary dark:border-secondary-700">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-primary-accent/10 dark:bg-primary-500/10 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-primary-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">{name}</h4>
          <p className="text-sm text-text-secondary">{role}</p>
        </div>
      </div>
      <blockquote className="text-text-secondary leading-relaxed">
        &quot;{quote}&quot;
      </blockquote>
    </div>
  )
}
