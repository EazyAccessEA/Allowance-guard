import Image from 'next/image'

export default function CookiesPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <p className="text-gray-600 mb-6">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
            </p>
            <p className="text-gray-700 mb-4">
              Allowance Guard uses cookies minimally and only for essential functionality. We prioritize your privacy and do not use cookies for extensive tracking or advertising.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Types of Cookies We Use</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Essential Cookies</h3>
              <p className="text-blue-800 mb-3">
                These cookies are necessary for the website to function properly. They cannot be disabled.
              </p>
              <ul className="list-disc pl-6 text-blue-800">
                <li><strong>Session Cookies:</strong> Maintain your session while using the service</li>
                <li><strong>Security Cookies:</strong> Protect against cross-site request forgery (CSRF)</li>
                <li><strong>Functionality Cookies:</strong> Enable basic features like wallet connection</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Preference Cookies</h3>
              <p className="text-green-800 mb-3">
                These cookies remember your choices and preferences to improve your experience.
              </p>
              <ul className="list-disc pl-6 text-green-800">
                <li><strong>Wallet Preferences:</strong> Remember your connected wallet address</li>
                <li><strong>Alert Settings:</strong> Remember your email alert preferences</li>
                <li><strong>Display Settings:</strong> Remember your UI preferences</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Analytics Cookies</h3>
              <p className="text-yellow-800 mb-3">
                These cookies help us understand how our service is used to improve it.
              </p>
              <ul className="list-disc pl-6 text-yellow-800">
                <li><strong>Usage Statistics:</strong> Anonymous data about how the service is used</li>
                <li><strong>Performance Monitoring:</strong> Data to improve site speed and reliability</li>
                <li><strong>Error Tracking:</strong> Information about technical issues (no personal data)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services that set their own cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Wallet Providers:</strong> MetaMask, WalletConnect, and other wallet services may set cookies</li>
              <li><strong>Analytics Services:</strong> Anonymous usage analytics (if enabled)</li>
              <li><strong>Email Services:</strong> For sending security alerts (if subscribed)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              These third-party services have their own cookie policies. We recommend reviewing their privacy practices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-3">
                You can control cookies through your browser settings:
              </p>
              <ul className="list-disc pl-6 text-gray-700">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Important Note</h3>
              <p className="text-red-800">
                <strong>Disabling essential cookies may break core functionality</strong> of Allowance Guard, including wallet connection and scanning features.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie Retention</h2>
            <p className="text-gray-700 mb-4">
              Different cookies are stored for different periods:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Preference Cookies:</strong> Stored for up to 1 year</li>
              <li><strong>Analytics Cookies:</strong> Stored for up to 2 years</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Accept or reject non-essential cookies</li>
              <li>Delete existing cookies from your browser</li>
              <li>Be informed about what cookies we use</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
            </p>
            <p className="text-gray-700 mb-4">
              We will notify you of any material changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us through our support channels.
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
