'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'

export default function PrivacyPage() {

  return (
    <div className="min-h-screen bg-white text-ink">
      <VideoBackground videoSrc="/V3AG.mp4" />
      
      {/* Hero Section */}
      <Section className="relative py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <H1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </H1>
            <p className="text-xl text-stone max-w-2xl mx-auto">
              Your privacy is fundamental to our mission. We believe in transparency and minimal data collection.
            </p>
          </div>
        </Container>
      </Section>

      {/* Privacy Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Our Privacy Commitment</H2>
                <p className="text-stone leading-relaxed">
                  Allowance Guard is built with privacy-first principles. We don&apos;t sell your data, 
                  don&apos;t track your on-chain activity beyond scans you explicitly trigger, and 
                  maintain minimal server logs for security purposes only.
                </p>
              </div>

              {/* Data Collection */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Data We Collect</H2>
                <div className="space-y-6">
                  <div className="border-l-4 border-cobalt pl-6">
                    <h3 className="text-lg font-medium mb-2">Wallet Addresses</h3>
                    <p className="text-stone">
                      Only when you explicitly scan a wallet. Used solely to fetch token allowances 
                      from blockchain networks. Not stored permanently.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-cobalt pl-6">
                    <h3 className="text-lg font-medium mb-2">Email Addresses</h3>
                    <p className="text-stone">
                      Only if you subscribe to alerts or make donations. Used exclusively for 
                      notifications and receipts. Never shared with third parties.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-cobalt pl-6">
                    <h3 className="text-lg font-medium mb-2">Technical Logs</h3>
                    <p className="text-stone">
                      Minimal server logs (IP addresses, request IDs) for security and abuse prevention. 
                      Automatically purged after 30 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Usage */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">How We Use Your Data</H2>
                <ul className="space-y-3 text-stone">
                  <li className="flex items-start">
                    <span className="text-cobalt mr-3">•</span>
                    <span>Process wallet scans to display token allowances</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cobalt mr-3">•</span>
                    <span>Send email alerts about risky approvals (if subscribed)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cobalt mr-3">•</span>
                    <span>Provide donation receipts and confirmations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cobalt mr-3">•</span>
                    <span>Monitor for abuse and security threats</span>
                  </li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Your Privacy Rights</H2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Access & Control</h3>
                    <p className="text-stone text-sm">
                      Use the app without creating an account. All wallet scans are processed 
                      without requiring personal information.
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Email Management</h3>
                    <p className="text-stone text-sm">
                      Unsubscribe from emails anytime using the link in any email. 
                      No questions asked.
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Data Deletion</h3>
                    <p className="text-stone text-sm">
                      Request deletion of your email data by contacting us at 
                      legal.support@allowanceguard.com
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Transparency</h3>
                    <p className="text-stone text-sm">
                      This is open source software. You can review exactly how your data 
                      is processed in our codebase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Third Parties */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Third-Party Services</H2>
                <p className="text-stone mb-4">
                  We use minimal third-party services, all with strong privacy protections:
                </p>
                <ul className="space-y-2 text-stone">
                  <li>• <strong>Vercel:</strong> Hosting and CDN (privacy-focused)</li>
                  <li>• <strong>Neon Database:</strong> Data storage (encrypted, EU-based)</li>
                  <li>• <strong>Microsoft SMTP:</strong> Email delivery (enterprise-grade security)</li>
                  <li>• <strong>Alchemy/Infura:</strong> Blockchain data (no personal data shared)</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Questions About Privacy?</H2>
                <div className="bg-ag-panel p-6 rounded-lg">
                  <p className="text-stone mb-4">
                    We&apos;re committed to transparency. If you have questions about our privacy practices 
                    or want to exercise your rights, contact us:
                  </p>
                  <p className="text-cobalt font-medium">
                    legal.support@allowanceguard.com
                  </p>
                </div>
              </div>

              {/* Last Updated */}
              <div className="text-center text-sm text-stone border-t pt-8">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-2">
                  This privacy policy may be updated to reflect changes in our practices. 
                  We&apos;ll notify users of significant changes via email.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}