'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function TermsPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/AllowanceGuard..mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.55) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Terms of Service</H1>
          <p className="text-base text-stone mb-8">
            <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US')}
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      <Section>
        <Container>
          <div className="max-w-reading">
            <div className="space-y-8">
              <section>
                <H2 className="mb-4">1. Acceptance of Terms</H2>
                <p className="text-base text-stone mb-4">
                  By accessing and using Allowance Guard (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <H2 className="mb-4">2. Description of Service</H2>
                <p className="text-base text-stone mb-4">
                  Allowance Guard is a web-based service that helps users:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• Scan and analyze token approvals on blockchain networks</li>
                  <li>• Identify potentially risky or unlimited token approvals</li>
                  <li>• Receive alerts about dangerous approvals</li>
                  <li>• Access educational content about wallet security</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">3. User Responsibilities</H2>
                <p className="text-base text-stone mb-4">
                  As a user of Allowance Guard, you agree to:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• Use the service only for lawful purposes</li>
                  <li>• Not attempt to gain unauthorized access to any part of the service</li>
                  <li>• Not use the service to violate any applicable laws or regulations</li>
                  <li>• Maintain the security of your wallet and private keys</li>
                  <li>• Verify all transactions before execution</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">4. Disclaimer of Warranties</H2>
                <p className="text-base text-stone mb-4">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-base text-stone mb-4">
                  Allowance Guard does not warrant that the service will be uninterrupted, error-free, or completely secure. Blockchain transactions are irreversible and we cannot guarantee the accuracy of all information provided.
                </p>
              </section>

              <section>
                <H2 className="mb-4">5. Limitation of Liability</H2>
                <p className="text-base text-stone mb-4">
                  IN NO EVENT SHALL ALLOWANCE GUARD, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
                </p>
                <p className="text-base text-stone mb-4">
                  You are solely responsible for all transactions and decisions made using your wallet. We are not responsible for any financial losses resulting from the use of our service.
                </p>
              </section>

              <section>
                <H2 className="mb-4">6. Privacy and Data</H2>
                <p className="text-base text-stone mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                </p>
                <p className="text-base text-stone mb-4">
                  We do not store your private keys or have access to your wallet funds. All wallet interactions are performed locally in your browser.
                </p>
              </section>

              <section>
                <H2 className="mb-4">7. Modifications to Terms</H2>
                <p className="text-base text-stone mb-4">
                  Allowance Guard reserves the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the &quot;Last updated&quot; date.
                </p>
                <p className="text-base text-stone mb-4">
                  Your continued use of the service after any such modifications constitutes your acceptance of the new terms.
                </p>
              </section>

              <section>
                <H2 className="mb-4">8. Contact Information</H2>
                <p className="text-base text-stone mb-4">
                  If you have any questions about these Terms of Service, please contact us through our support channels.
                </p>
              </section>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}