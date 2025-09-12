'use client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import VideoBackground from '@/components/VideoBackground'

export default function CookiesPage() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={isConnected} />
      
      {/* Hero Section - Fireart Style with Animated Background */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/Allowance_Guard_Header.mp4"
        />
        {/* Gradient overlay for better text readability - 10% left, 45% right */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.3) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Cookie Policy</H1>
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
                <H2 className="mb-4">1. What Are Cookies</H2>
                <p className="text-base text-stone mb-4">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                </p>
                <p className="text-base text-stone mb-4">
                  Allowance Guard uses cookies minimally and only for essential functionality. We prioritize your privacy and do not use cookies for extensive tracking or advertising.
                </p>
              </section>

              <section>
                <H2 className="mb-4">2. Types of Cookies We Use</H2>
                
                <div className="border border-line rounded-md p-6 mb-6 bg-mist">
                  <h3 className="text-lg text-ink mb-3">Essential Cookies</h3>
                  <p className="text-base text-stone mb-3">
                    These cookies are necessary for the website to function properly. They cannot be disabled.
                  </p>
                  <ul className="space-y-2 text-base text-stone">
                    <li>• <strong>Session Cookies:</strong> Maintain your session while using the service</li>
                    <li>• <strong>Security Cookies:</strong> Protect against cross-site request forgery (CSRF)</li>
                    <li>• <strong>Functionality Cookies:</strong> Enable basic features like wallet connection</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 mb-6 bg-mist">
                  <h3 className="text-lg text-ink mb-3">Preference Cookies</h3>
                  <p className="text-base text-stone mb-3">
                    These cookies remember your choices and preferences to improve your experience.
                  </p>
                  <ul className="space-y-2 text-base text-stone">
                    <li>• <strong>Wallet Preferences:</strong> Remember your connected wallet address</li>
                    <li>• <strong>Alert Settings:</strong> Remember your email alert preferences</li>
                    <li>• <strong>Display Settings:</strong> Remember your UI preferences</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 mb-6 bg-mist">
                  <h3 className="text-lg text-ink mb-3">Analytics Cookies</h3>
                  <p className="text-base text-stone mb-3">
                    These cookies help us understand how our service is used to improve it.
                  </p>
                  <ul className="space-y-2 text-base text-stone">
                    <li>• <strong>Usage Statistics:</strong> Anonymous data about how the service is used</li>
                    <li>• <strong>Performance Monitoring:</strong> Data to improve site speed and reliability</li>
                    <li>• <strong>Error Tracking:</strong> Information about technical issues (no personal data)</li>
                  </ul>
                </div>
              </section>

              <section>
                <H2 className="mb-4">3. Third-Party Cookies</H2>
                <p className="text-base text-stone mb-4">
                  We may use third-party services that set their own cookies:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Wallet Providers:</strong> MetaMask, WalletConnect, and other wallet services may set cookies</li>
                  <li>• <strong>Analytics Services:</strong> Anonymous usage analytics (if enabled)</li>
                  <li>• <strong>Email Services:</strong> For sending security alerts (if subscribed)</li>
                </ul>
                <p className="text-base text-stone mb-4">
                  These third-party services have their own cookie policies. We recommend reviewing their privacy practices.
                </p>
              </section>

              <section>
                <H2 className="mb-4">4. Managing Your Cookie Preferences</H2>
                
                <div className="border border-line rounded-md p-6 mb-6 bg-mist">
                  <h3 className="text-lg text-ink mb-3">Browser Settings</h3>
                  <p className="text-base text-stone mb-3">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="space-y-2 text-base text-stone">
                    <li>• <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                    <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                    <li>• <strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                    <li>• <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                  </ul>
                </div>

                <div className="border border-line rounded-md p-6 mb-6 bg-mist">
                  <h3 className="text-lg text-ink mb-3">Important Note</h3>
                  <p className="text-base text-stone">
                    <strong>Disabling essential cookies may break core functionality</strong> of Allowance Guard, including wallet connection and scanning features.
                  </p>
                </div>
              </section>

              <section>
                <H2 className="mb-4">5. Cookie Retention</H2>
                <p className="text-base text-stone mb-4">
                  Different cookies are stored for different periods:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• <strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li>• <strong>Preference Cookies:</strong> Stored for up to 1 year</li>
                  <li>• <strong>Analytics Cookies:</strong> Stored for up to 2 years</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">6. Your Rights</H2>
                <p className="text-base text-stone mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-base text-stone">
                  <li>• Accept or reject non-essential cookies</li>
                  <li>• Delete existing cookies from your browser</li>
                  <li>• Be informed about what cookies we use</li>
                  <li>• Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <H2 className="mb-4">7. Updates to This Policy</H2>
                <p className="text-base text-stone mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-base text-stone mb-4">
                  We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <H2 className="mb-4">8. Contact Us</H2>
                <p className="text-base text-stone mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us through our support channels.
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