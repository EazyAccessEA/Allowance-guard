import Image from 'next/image'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12 mr-3">
              <Image
                src="/AG_Logo2.png"
                alt="Allowance Guard"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Allowance Guard</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              Allowance Guard is designed with privacy in mind. We collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Wallet Addresses:</strong> Public blockchain addresses you choose to scan</li>
              <li><strong>Email Addresses:</strong> Only if you subscribe to alerts (optional)</li>
              <li><strong>Usage Data:</strong> Basic analytics to improve our service</li>
              <li><strong>Technical Data:</strong> Browser information and IP addresses for security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. What We Do NOT Collect</h2>
            <p className="text-gray-700 mb-4">
              We explicitly do not collect or store:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Private Keys:</strong> We never have access to your private keys</li>
              <li><strong>Seed Phrases:</strong> We never request or store seed phrases</li>
              <li><strong>Transaction Data:</strong> We don&apos;t store your transaction history</li>
              <li><strong>Personal Information:</strong> No names, addresses, or personal details</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use collected information solely to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Provide wallet scanning and analysis services</li>
              <li>Send security alerts (if you subscribe)</li>
              <li>Improve our service functionality</li>
              <li>Ensure security and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-700 mb-4">
              <strong>Local Processing:</strong> All wallet scanning is performed locally in your browser. We don&apos;t store your approval data on our servers.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Encryption:</strong> Any data we do store is encrypted using industry-standard methods.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Retention:</strong> We retain minimal data only as long as necessary to provide our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Blockchain Data:</strong> RPC providers to fetch blockchain information</li>
              <li><strong>Email Services:</strong> To send security alerts (if subscribed)</li>
              <li><strong>Analytics:</strong> Anonymous usage statistics to improve our service</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These services have their own privacy policies and we ensure they meet our privacy standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Access:</strong> Request information about data we have about you</li>
              <li><strong>Correction:</strong> Correct any inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your data</li>
              <li><strong>Portability:</strong> Export your data in a standard format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from emails at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use minimal cookies for essential functionality:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Preference Cookies:</strong> Remember your settings</li>
              <li><strong>Analytics Cookies:</strong> Anonymous usage statistics</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookie settings through your browser. See our Cookie Policy for more details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Users</h2>
            <p className="text-gray-700 mb-4">
              Our service is available globally. If you&apos;re in the European Union, you have additional rights under GDPR. If you&apos;re in California, you have rights under CCPA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us through our support channels.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Allowance Guard. All rights reserved.
            </p>
            <div className="mt-4 space-x-6">
              <a href="/terms" className="text-blue-600 hover:text-blue-800 text-sm">Terms of Service</a>
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 text-sm">Privacy Policy</a>
              <a href="/cookies" className="text-blue-600 hover:text-blue-800 text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
