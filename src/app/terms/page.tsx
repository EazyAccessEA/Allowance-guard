'use client'

import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import VideoBackground from '@/components/VideoBackground'

export default function TermsPage() {

  return (
    <div className="min-h-screen bg-white text-ink">
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32 overflow-hidden">
        <VideoBackground videoSrc="/V3AG.mp4" />
        <div 
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">Terms of Use</H1>
          <p className="text-xl text-stone max-w-reading mb-8">
            Clear, straightforward terms for using Allowance Guard. No legal jargon, just honest expectations.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Terms Content */}
      <Section className="py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Agreement to Terms</H2>
                <p className="text-stone leading-relaxed">
                  By using Allowance Guard, you agree to these terms. We&apos;ve written them in plain English 
                  to be as clear as possible. If you don&apos;t agree with any part of these terms, 
                  please don&apos;t use our service.
                </p>
              </div>

              {/* Service Description */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">What Allowance Guard Does</H2>
                <div className="bg-ag-panel p-6 rounded-lg mb-6">
                  <p className="text-stone">
                    Allowance Guard is a free, open-source tool that helps you:
                  </p>
                  <ul className="mt-4 space-y-2 text-stone">
                    <li>• View token approvals across multiple blockchain networks</li>
                    <li>• Identify potentially risky or unlimited approvals</li>
                    <li>• Revoke token approvals with one-click transactions</li>
                    <li>• Receive email alerts about new approvals (optional)</li>
                  </ul>
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Important Disclaimers</H2>
                <div className="space-y-6">
                  <div className="border-l-4 border-amber-400 pl-6 bg-amber-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-amber-800">No Financial Advice</h3>
                    <p className="text-amber-700">
                      Allowance Guard does not provide financial, investment, or legal advice. 
                      All decisions about your wallet and tokens are your responsibility.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-400 pl-6 bg-red-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-red-800">Use at Your Own Risk</h3>
                    <p className="text-red-700">
                      This is a best-effort tool provided &quot;as is&quot; without warranties. 
                      We cannot guarantee the accuracy of data or the success of transactions.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-6 bg-blue-50 p-4 rounded-r-lg">
                    <h3 className="text-lg font-medium mb-2 text-blue-800">Blockchain Risks</h3>
                    <p className="text-blue-700">
                      Blockchain transactions are irreversible. Always verify transaction details 
                      before confirming. Gas fees and network congestion may affect transaction success.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Responsibilities */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Your Responsibilities</H2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Wallet Security</h3>
                    <p className="text-stone text-sm">
                      You are responsible for keeping your wallet secure. Never share your private keys 
                      or seed phrases with anyone, including us.
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Transaction Verification</h3>
                    <p className="text-stone text-sm">
                      Always review transaction details before confirming. Verify token addresses, 
                      amounts, and gas fees.
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Compliance</h3>
                    <p className="text-stone text-sm">
                      Ensure your use of Allowance Guard complies with applicable laws and regulations 
                      in your jurisdiction.
                    </p>
                  </div>
                  
                  <div className="bg-ag-panel p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Accurate Information</h3>
                    <p className="text-stone text-sm">
                      Provide accurate information when subscribing to alerts or making donations. 
                      Don&apos;t use the service for illegal activities.
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Availability */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Service Availability</H2>
                <p className="text-stone mb-4">
                  We strive to keep Allowance Guard available 24/7, but we cannot guarantee:
                </p>
                <ul className="space-y-2 text-stone">
                  <li>• Continuous uptime or availability</li>
                  <li>• Accuracy of blockchain data (depends on RPC providers)</li>
                  <li>• Success of all transactions (network conditions vary)</li>
                  <li>• Compatibility with all wallets or browsers</li>
                </ul>
              </div>

              {/* Donations */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Donations</H2>
                <div className="bg-ag-panel p-6 rounded-lg">
                  <p className="text-stone mb-4">
                    Donations are voluntary and help support development. Important notes:
                  </p>
                  <ul className="space-y-2 text-stone">
                    <li>• Donations are non-refundable once processed</li>
                    <li>• Payment providers may allow refunds for technical errors</li>
                    <li>• We don&apos;t provide tax advice for donations</li>
                    <li>• Donations don&apos;t grant special privileges or support</li>
                  </ul>
                </div>
              </div>

              {/* Changes to Terms */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Changes to These Terms</H2>
                <p className="text-stone">
                  We may update these terms occasionally. Significant changes will be announced 
                  on our website and via email to subscribers. Continued use after changes 
                  constitutes acceptance of the new terms.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Limitation of Liability</H2>
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                  <p className="text-red-800 font-medium mb-2">Important Legal Notice:</p>
                  <p className="text-red-700 text-sm">
                    To the maximum extent permitted by law, Allowance Guard and its contributors 
                    shall not be liable for any direct, indirect, incidental, special, consequential, 
                    or punitive damages, including but not limited to loss of funds, data, or profits, 
                    arising from your use of this service.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mb-12">
                <H2 className="text-2xl font-semibold mb-4">Questions About These Terms?</H2>
                <div className="bg-ag-panel p-6 rounded-lg">
                  <p className="text-stone mb-4">
                    If you have questions about these terms or need clarification, contact us:
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
                  These terms are governed by applicable law and are subject to change.
                </p>
              </div>

            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}