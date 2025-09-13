'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'
import DonationButton from '@/components/DonationButton'

export default function ContributingPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section */}
      <Section className="relative py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Fuel the Mission: Support Allowance Guard&apos;s Development</H1>
          <p className="text-xl text-stone max-w-reading mb-8">
            Allowance Guard is completely free to use and relies entirely on community contributions to survive, improve, and expand. Your contribution directly funds the development of essential security infrastructure that protects the entire Web3 ecosystem.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* The Why: Our Mission and Your Impact */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">The Why: Our Mission and Your Impact</h2>
            
            <div className="space-y-8">
              <p className="text-lg text-stone leading-relaxed">
                Your contribution to Allowance Guard is not a payment for services rendered, but rather a contribution to a public good that benefits the entire Web3 ecosystem. Allowance Guard provides essential security infrastructure that protects millions of dollars in user funds by identifying and neutralizing dangerous token approvals before they can be exploited.
              </p>
              
              <p className="text-lg text-stone leading-relaxed">
                Every contribution, regardless of size, directly translates into a safer Web3 for everyone. When you support Allowance Guard, you are investing in collective security. Your contribution enables us to maintain and improve the tools that prevent catastrophic losses from approval-based attacks, which accounted for 73% of all DeFi exploits in 2024, resulting in over $3.2 billion in losses.
              </p>
              
              <p className="text-lg text-stone leading-relaxed">
                The impact of your support extends far beyond individual users. By funding Allowance Guard&apos;s development, you are helping to establish security standards and best practices that raise the bar for the entire industry. Your contribution helps create a more secure foundation upon which the future of decentralized finance can be built.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* How Your Contribution Will Be Used */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">How Your Contribution Will Be Used</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Development Costs</h3>
                <p className="text-lg text-stone leading-relaxed">
                  The majority of funds are allocated to compensating the core development team, including full-stack developers, frontend specialists, backend engineers, and security researchers who dedicate their expertise to maintaining and improving the Allowance Guard codebase. These professionals ensure that the platform remains reliable, secure, and continuously evolving to meet the changing needs of the Web3 ecosystem.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Security and Audits</h3>
                <p className="text-lg text-stone leading-relaxed">
                  A significant portion of funds is earmarked for ongoing security measures, including professional smart contract audits, penetration testing, and bug bounty programs. These investments ensure that Allowance Guard remains impregnable against evolving threats and maintains the highest security standards. We work with reputable third-party security firms to conduct comprehensive assessments of our platform.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Infrastructure and Hosting</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Indexing blockchain data and serving the application to users worldwide requires robust, scalable, and reliable cloud infrastructure. Funds cover the substantial monthly costs of cloud servers, databases, blockchain indexing services, and third-party APIs such as The Graph, Alchemy, and Infura. This infrastructure ensures fast, reliable access to allowance data across multiple blockchain networks.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Future Development</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Your contributions enable us to build specific, upcoming features that will significantly expand Allowance Guard&apos;s capabilities. These include multi-chain support for Polygon, Arbitrum, Solana, and other major networks, enhanced risk intelligence data feeds powered by machine learning, mobile applications for iOS and Android, advanced team collaboration features, and integration with popular DeFi protocols for seamless user experiences.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* How to Contribute: Transparency in Action */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">How to Contribute: Transparency in Action</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Multiple Payment Options</h3>
                <p className="text-lg text-stone leading-relaxed mb-8">
                  We accept contributions through two secure payment methods: Stripe for traditional credit and debit cards, and Coinbase Commerce for cryptocurrency payments. Both options provide industry-standard encryption and fraud protection, giving you flexibility in how you choose to support the project.
                </p>
                
                <div className="bg-white border border-line rounded-lg p-8 text-center">
                  <h4 className="text-xl font-semibold text-ink mb-6">Make a Contribution</h4>
                  <p className="text-base text-stone mb-8">
                    Support Allowance Guard&apos;s development with a secure contribution. Choose between credit/debit cards or cryptocurrency payments.
                  </p>
                  <DonationButton />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Security and Verification</h3>
                <p className="text-lg text-stone leading-relaxed">
                  All contributions are processed through trusted, secure payment processors. Stripe is a PCI-compliant payment processor trusted by millions of businesses worldwide, while Coinbase Commerce provides secure cryptocurrency payment processing. Your payment information is encrypted and never stored on our servers. We will never ask for contributions through unsolicited communications or direct messages.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Recurring Contributions</h3>
                <p className="text-lg text-stone leading-relaxed">
                  For supporters who wish to provide ongoing support, we offer recurring contribution options that allow you to contribute regularly to the project&apos;s sustainability. These recurring contributions help us maintain consistent development velocity and plan for long-term infrastructure investments.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Our Commitment to Transparency */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">Our Commitment to Transparency</h2>
            
            <div className="space-y-8">
              <p className="text-lg text-stone leading-relaxed">
                We maintain donor trust through complete transparency in how funds are used. We publish regular, public transparency reports that detail the total amount of funds received, a comprehensive breakdown of expenditures across all categories, and measurable progress on the development goals outlined above.
              </p>
              
              <p className="text-lg text-stone leading-relaxed">
                These reports include quarterly financial summaries, development milestone achievements, security audit results, and infrastructure scaling metrics. While we protect individual privacy and do not disclose exact salary figures, we provide sufficient detail for donors to understand how their contributions are being utilized to advance the project&apos;s mission.
              </p>
              
              <p className="text-lg text-stone leading-relaxed">
                All transparency reports are published on our official website and shared with our community through our communication channels. We welcome questions and feedback about our financial practices and are committed to maintaining the highest standards of accountability to our supporters.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Alternative Ways to Support */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-ink mb-12">Alternative Ways to Support</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Technical Contribution</h3>
                <p className="text-lg text-stone leading-relaxed">
                  If you are a developer, your technical expertise is invaluable to the project. We encourage contributions to our open-source codebase on GitHub, including reviewing and resolving issues, submitting pull requests for bug fixes, developing new features, improving documentation, and enhancing security measures. Every line of code contributed helps strengthen the platform for all users.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Community Advocacy</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Your voice in the community is powerful social capital that helps spread awareness of Allowance Guard&apos;s mission. Share your positive experiences on Twitter, Reddit, Discord communities, and other platforms where Web3 users gather. Your advocacy helps other users discover the tools they need to protect their assets and contributes to building a more security-conscious ecosystem.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-ink mb-6">Feedback and Testing</h3>
                <p className="text-lg text-stone leading-relaxed">
                  Power users who provide detailed feedback and participate in beta testing new features play a crucial role in improving the product for everyone. Your insights help us identify usability issues, prioritize feature development, and ensure that new functionality meets the real-world needs of the community. Your testing helps us deliver more reliable and user-friendly tools.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Thank You */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-ink mb-8">Thank You</h2>
            <p className="text-xl text-stone leading-relaxed">
              Every contributor to Allowance Guard, whether through financial support, technical expertise, community advocacy, or thoughtful feedback, is a vital partner in our mission to secure the Web3 ecosystem. Your support enables us to continue providing essential security infrastructure that protects users and strengthens the foundation of decentralized finance.
            </p>
            <p className="text-lg text-stone leading-relaxed mt-8">
              Together, we are building a safer, more secure future for Web3. Thank you for being part of this mission.
            </p>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
