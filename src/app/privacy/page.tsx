'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function PrivacyPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/V3AG.mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.3) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Privacy Policy</H1>
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
                <H2 className="mb-4">1. Information We Collect</H2>
                <p className="text-base text-stone mb-4">
                  Allowance Guard is designed with privacy in mind. We collect minimal information necessary to provide our service:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Wallet Addresses:</strong> Public blockchain addresses you choose to scan</li>
                  <li>• <strong>Email Addresses:</strong> Only if you subscribe to alerts (optional)</li>
                  <li>• <strong>Usage Data:</strong> Basic analytics to improve our service</li>
                  <li>• <strong>Technical Data:</strong> Browser information and IP addresses for security</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">2. What We Do NOT Collect</H2>
                <p className="text-base text-stone mb-4">
                  We explicitly do not collect or store:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Private Keys:</strong> We never have access to your private keys</li>
                  <li>• <strong>Seed Phrases:</strong> We never request or store seed phrases</li>
                  <li>• <strong>Transaction Data:</strong> We don&apos;t store your transaction history</li>
                  <li>• <strong>Personal Information:</strong> No names, addresses, or personal details</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">3. How We Use Your Information</H2>
                <p className="text-base text-stone mb-4">
                  We use collected information solely to:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• Provide wallet scanning and analysis services</li>
                  <li>• Send security alerts (if you subscribe)</li>
                  <li>• Improve our service functionality</li>
                  <li>• Ensure security and prevent abuse</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">4. Data Storage and Security</H2>
                <p className="text-base text-stone mb-4">
                  <strong>Local Processing:</strong> All wallet scanning is performed locally in your browser. We don&apos;t store your approval data on our servers.
                </p>
                <p className="text-base text-stone mb-4">
                  <strong>Encryption:</strong> Any data we do store is encrypted using industry-standard methods.
                </p>
                <p className="text-base text-stone mb-4">
                  <strong>Retention:</strong> We retain minimal data only as long as necessary to provide our service.
                </p>
              </section>

              <section>
                <H2 className="mb-4">5. Third-Party Services</H2>
                <p className="text-base text-stone mb-4">
                  We may use third-party services for:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Blockchain Data:</strong> RPC providers to fetch blockchain information</li>
                  <li>• <strong>Email Services:</strong> To send security alerts (if subscribed)</li>
                  <li>• <strong>Analytics:</strong> Anonymous usage statistics to improve our service</li>
                </ul>
                <p className="text-base text-stone mb-4">
                  These services have their own privacy policies and we ensure they meet our privacy standards.
                </p>
              </section>

              <section>
                <H2 className="mb-4">6. Your Rights</H2>
                <p className="text-base text-stone mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Access:</strong> Request information about data we have about you</li>
                  <li>• <strong>Correction:</strong> Correct any inaccurate information</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your data</li>
                  <li>• <strong>Portability:</strong> Export your data in a standard format</li>
                  <li>• <strong>Opt-out:</strong> Unsubscribe from emails at any time</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">7. Cookies and Tracking</H2>
                <p className="text-base text-stone mb-4">
                  We use minimal cookies for essential functionality:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li>• <strong>Preference Cookies:</strong> Remember your settings</li>
                  <li>• <strong>Analytics Cookies:</strong> Anonymous usage statistics</li>
                </ul>
                <p className="text-base text-stone mb-4">
                  You can control cookie settings through your browser. See our Cookie Policy for more details.
                </p>
              </section>

              <section>
                <H2 className="mb-4">8. International Users</H2>
                <p className="text-base text-stone mb-4">
                  Our service is available globally. If you&apos;re in the European Union, you have additional rights under GDPR. If you&apos;re in California, you have rights under CCPA.
                </p>
              </section>

              <section>
                <H2 className="mb-4">9. Changes to This Policy</H2>
                <p className="text-base text-stone mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <H2 className="mb-4">10. Contact Us</H2>
                <p className="text-base text-stone mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
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