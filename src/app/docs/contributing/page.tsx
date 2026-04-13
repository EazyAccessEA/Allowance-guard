'use client'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import DonationButton from '@/components/DonationButton'
import DocsHero from '../DocsHero'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Heart, Shield, Zap, Users, DollarSign, Lock, Server, Rocket } from 'lucide-react'

export default function ContributingPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="min-h-screen bg-paper text-ink">

      <DocsHero
        eyebrow="Contributing"
        title="Fund the mission. Build the public layer."
        lede="AllowanceGuard's core scanner is free and open source. Always. Code, bug reports, and donations all count."
      />

      {/* The Why: Our Mission and Your Impact - Enhanced with cards */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-12">The Why: Our Mission and Your Impact</h2>
            </div>

            <div className="space-y-8">
              {/* Enhanced paragraph 1 with card styling */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-400/15  flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-amber-deep" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Public Good Investment</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Your contribution to Allowance Guard is not a payment for services rendered, but rather a contribution to a public good that benefits the entire Web3 ecosystem. Allowance Guard provides essential security infrastructure that protects millions of dollars in user funds by identifying and neutralizing dangerous token approvals before they can be exploited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced paragraph 2 with card styling */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-400/15  flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-amber-deep" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Collective Security</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Every contribution, regardless of size, directly translates into a safer Web3 for everyone. When you support AllowanceGuard, you are investing in collective security. Approval-based phishing and scams drained <strong>over $200 million from user wallets in 2024 alone</strong> &mdash; a small slice of the wider $8.3B total crypto-theft figure, but a slice that almost any user can prevent with a few clicks.<sup className="text-amber-deep">*</sup> Your contribution funds the tools that make those clicks possible.
                    </p>
                    <p className="mt-3 text-xs text-ink-whisper leading-relaxed">
                      <sup className="text-amber-deep">*</sup> Sources: Chainalysis 2024 Crypto Crime Report; CertiK Q3 2024 Web3 Security Report; De.Fi REKT Database 2024.
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced paragraph 3 with card styling */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-400/15  flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-amber-deep" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-4">Industry Standards</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      The impact of your support extends far beyond individual users. By funding Allowance Guard&apos;s development, you are helping to establish security standards and best practices that raise the bar for the entire industry. Your contribution helps create a more secure foundation upon which the future of decentralized finance can be built.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How Your Contribution Will Be Used - Enhanced with progressive disclosure */}
      <Section className="py-32 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-12">How Your Contribution Will Be Used</h2>
            </div>

            <div className="space-y-6">
              {/* Development Costs - Enhanced with expandable card */}
              <div className="bg-paper-sub rounded-2xl shadow-sm border border-ink-rule overflow-hidden">
                <button
                  onClick={() => toggleSection('development')}
                  className="w-full p-8 text-left hover:bg-paper-sub transition-colors duration-200 flex items-center justify-between micro-bounce"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50  flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-ink">Development Costs</h3>
                  </div>
                  {expandedSection === 'development' ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                {expandedSection === 'development' && (
                  <div className="px-8 pb-8 animate-fade-in expand-enter">
                    <p className="text-lg text-ink-soft leading-relaxed">
                      The majority of funds are allocated to compensating the core development team, including full-stack developers, frontend specialists, backend engineers, and security researchers who dedicate their expertise to maintaining and improving the Allowance Guard codebase. These professionals ensure that the platform remains reliable, secure, and continuously evolving to meet the changing needs of the Web3 ecosystem.
                    </p>
                  </div>
                )}
              </div>

              {/* Security and Audits - Enhanced with expandable card */}
              <div className="bg-paper-sub rounded-2xl shadow-sm border border-ink-rule overflow-hidden">
                <button
                  onClick={() => toggleSection('security')}
                  className="w-full p-8 text-left hover:bg-paper-sub transition-colors duration-200 flex items-center justify-between micro-bounce"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50  flex items-center justify-center">
                      <Lock className="w-6 h-6 text-red-800" />
                    </div>
                    <h3 className="text-2xl font-semibold text-ink">Security and Audits</h3>
                  </div>
                  {expandedSection === 'security' ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                {expandedSection === 'security' && (
                  <div className="px-8 pb-8 animate-fade-in expand-enter">
                    <p className="text-lg text-ink-soft leading-relaxed">
                      A significant portion of funds is earmarked for ongoing security measures, including professional smart contract audits, penetration testing, and bug bounty programs. These investments ensure that Allowance Guard remains impregnable against evolving threats and maintains the highest security standards. We work with reputable third-party security firms to conduct comprehensive assessments of our platform.
                    </p>
                  </div>
                )}
              </div>

              {/* Infrastructure and Hosting - Enhanced with expandable card */}
              <div className="bg-paper-sub rounded-2xl shadow-sm border border-ink-rule overflow-hidden">
                <button
                  onClick={() => toggleSection('infrastructure')}
                  className="w-full p-8 text-left hover:bg-paper-sub transition-colors duration-200 flex items-center justify-between micro-bounce"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50  flex items-center justify-center">
                      <Server className="w-6 h-6 text-green-800" />
                    </div>
                    <h3 className="text-2xl font-semibold text-ink">Infrastructure and Hosting</h3>
                  </div>
                  {expandedSection === 'infrastructure' ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                {expandedSection === 'infrastructure' && (
                  <div className="px-8 pb-8 animate-fade-in expand-enter">
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Indexing blockchain data and serving the application to users worldwide requires robust, scalable, and reliable cloud infrastructure. Funds cover the substantial monthly costs of cloud servers, databases, blockchain indexing services, and third-party APIs such as The Graph, Alchemy, and Infura. This infrastructure ensures fast, reliable access to allowance data across multiple blockchain networks.
                    </p>
                  </div>
                )}
              </div>

              {/* Future Development - Enhanced with expandable card */}
              <div className="bg-paper-sub rounded-2xl shadow-sm border border-ink-rule overflow-hidden">
                <button
                  onClick={() => toggleSection('future')}
                  className="w-full p-8 text-left hover:bg-paper-sub transition-colors duration-200 flex items-center justify-between micro-bounce"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50  flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-ink">Future Development</h3>
                  </div>
                  {expandedSection === 'future' ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>
                {expandedSection === 'future' && (
                  <div className="px-8 pb-8 animate-fade-in expand-enter">
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Your contributions enable us to build specific, upcoming features that will significantly expand AllowanceGuard&rsquo;s capabilities. These include adding chain support beyond our current 27 EVM networks, sharper risk-detection rules informed by post-mortem analysis of new exploits, mobile applications for iOS and Android, advanced team collaboration features, and deeper integrations with popular DeFi protocols.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How to Contribute: Transparency in Action - Enhanced with card styling */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-12">How to Contribute: Transparency in Action</h2>
            </div>

            <div className="space-y-12">
              {/* Multiple Payment Options - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50  flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Multiple Payment Options</h3>
                    <p className="text-lg text-ink-soft leading-relaxed mb-8">
                      We accept contributions through two secure payment methods: Stripe for traditional credit and debit cards, and Coinbase Commerce for cryptocurrency payments. Both options provide industry-standard encryption and fraud protection, giving you flexibility in how you choose to support the project.
                    </p>

                    <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl p-8 border border-amber-400/20">
                      <h4 className="text-xl font-semibold text-ink mb-6 text-center">Make a Contribution</h4>
                      <p className="text-base text-ink-soft mb-8 text-center">
                        Support Allowance Guard&apos;s development with a secure contribution. Choose between credit/debit cards or cryptocurrency payments.
                      </p>
                      <div className="flex justify-center">
                        <DonationButton />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security and Verification - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50  flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Security and Verification</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      All contributions are processed through trusted, secure payment processors. Stripe is a PCI-compliant payment processor trusted by millions of businesses worldwide, while Coinbase Commerce provides secure cryptocurrency payment processing. Your payment information is encrypted and never stored on our servers. We will never ask for contributions through unsolicited communications or direct messages.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recurring Contributions - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50  flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Recurring Contributions</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      For supporters who wish to provide ongoing support, we offer recurring contribution options that allow you to contribute regularly to the project&apos;s sustainability. These recurring contributions help us maintain consistent development velocity and plan for long-term infrastructure investments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Commitment to Transparency - Enhanced with card styling */}
      <Section className="py-32 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-12">Our Commitment to Transparency</h2>
            </div>

            <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
              <div className="space-y-8">
                <p className="text-lg text-ink-soft leading-relaxed">
                  We maintain donor trust through complete transparency in how funds are used. We publish regular, public transparency reports that detail the total amount of funds received, a comprehensive breakdown of expenditures across all categories, and measurable progress on the development goals outlined above.
                </p>

                <p className="text-lg text-ink-soft leading-relaxed">
                  These reports include quarterly financial summaries, development milestone achievements, security audit results, and infrastructure scaling metrics. While we protect individual privacy and do not disclose exact salary figures, we provide sufficient detail for donors to understand how their contributions are being utilized to advance the project&apos;s mission.
                </p>

                <p className="text-lg text-ink-soft leading-relaxed">
                  All transparency reports are published on our official website and shared with our community through our communication channels. We welcome questions and feedback about our financial practices and are committed to maintaining the highest standards of accountability to our supporters.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Alternative Ways to Support - Enhanced with card styling */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-12">Alternative Ways to Support</h2>
            </div>

            <div className="space-y-8">
              {/* Technical Contribution - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50  flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Technical Contribution</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      If you are a developer, your technical expertise is invaluable to the project. We encourage contributions to our open-source codebase on GitHub, including reviewing and resolving issues, submitting pull requests for bug fixes, developing new features, improving documentation, and enhancing security measures. Every line of code contributed helps strengthen the platform for all users.
                    </p>
                  </div>
                </div>
              </div>

              {/* Community Advocacy - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50  flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-green-800" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Community Advocacy</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Your voice in the community is powerful social capital that helps spread awareness of Allowance Guard&apos;s mission. Share your positive experiences on X, Reddit, Discord communities, and other platforms where Web3 users gather. Your advocacy helps other users discover the tools they need to protect their assets and contributes to building a more security-conscious ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback and Testing - Enhanced with card */}
              <div className="bg-paper-sub rounded-2xl p-8 shadow-sm border border-ink-rule hover:shadow-md transition-all duration-300 hover:-translate-y-1 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50  flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-ink mb-6">Feedback and Testing</h3>
                    <p className="text-lg text-ink-soft leading-relaxed">
                      Power users who provide detailed feedback and participate in beta testing new features play a crucial role in improving the product for everyone. Your insights help us identify usability issues, prioritize feature development, and ensure that new functionality meets the real-world needs of the community. Your testing helps us deliver more reliable and user-friendly tools.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Thank You - Enhanced with subtle animation */}
      <Section className="py-32 bg-paper-sub">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl font-semibold text-ink mb-8">Thank You</h2>
              <p className="text-xl text-ink-soft leading-relaxed">
                Every contributor to Allowance Guard, whether through financial support, technical expertise, community advocacy, or thoughtful feedback, is a vital partner in our mission to secure the Web3 ecosystem. Your support enables us to continue providing essential security infrastructure that protects users and strengthens the foundation of decentralized finance.
              </p>
              <p className="text-lg text-ink-soft leading-relaxed mt-8">
                Together, we are building a safer, more secure future for Web3. Thank you for being part of this mission.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}