import Image from 'next/image'

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using Allowance Guard (&quot;the Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              Allowance Guard is a web-based service that helps users:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Scan and analyze token approvals on blockchain networks</li>
              <li>Identify potentially risky or unlimited token approvals</li>
              <li>Receive alerts about dangerous approvals</li>
              <li>Access educational content about wallet security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              As a user of Allowance Guard, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any part of the service</li>
              <li>Not use the service to violate any applicable laws or regulations</li>
              <li>Maintain the security of your wallet and private keys</li>
              <li>Verify all transactions before execution</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-4">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-gray-700 mb-4">
              Allowance Guard does not warrant that the service will be uninterrupted, error-free, or completely secure. Blockchain transactions are irreversible and we cannot guarantee the accuracy of all information provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              IN NO EVENT SHALL ALLOWANCE GUARD, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-gray-700 mb-4">
              You are solely responsible for all transactions and decisions made using your wallet. We are not responsible for any financial losses resulting from the use of our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Privacy and Data</h2>
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
            </p>
            <p className="text-gray-700 mb-4">
              We do not store your private keys or have access to your wallet funds. All wallet interactions are performed locally in your browser.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              Allowance Guard reserves the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p className="text-gray-700 mb-4">
              Your continued use of the service after any such modifications constitutes your acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us through our support channels.
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
