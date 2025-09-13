import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={false} />
      
      {/* Hero Section */}
      <Section className="relative py-24 sm:py-32">
        <Container className="relative text-center max-w-4xl z-10">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/AG_Logo2.png"
              alt="Allowance Guard Logo"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </div>

          {/* Main Heading */}
          <H1 className="mb-6">Allowance Found. Page Not Found.</H1>
          
          {/* Sub-heading */}
          <p className="text-xl text-stone leading-relaxed mb-8 max-w-2xl mx-auto">
            Don&apos;t worry, it&apos;s just this page that&apos;s missing, not your tokens. You&apos;re still securely on AllowanceGuard.com.
          </p>

          {/* Body Text */}
          <p className="text-lg text-stone leading-relaxed mb-12 max-w-3xl mx-auto">
            The link you followed may be broken, or the page may have been moved. While our system is great at finding risky allowances, it seems this one got away from us.
          </p>

          {/* Illustration */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto bg-mist/30 rounded-2xl flex items-center justify-center">
              <svg className="w-16 h-16 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 13l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2" />
              </svg>
            </div>
            <p className="text-sm text-stone mt-4">Magnifying glass looking for a missing page</p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Actionable Guidance Section */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Let&apos;s Get You Back on Track</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Primary Action - Scan Allowances */}
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200">
                <div className="w-16 h-16 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-cobalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-4">Check Your Wallet&apos;s True Status</h3>
                <p className="text-stone leading-relaxed mb-6">
                  Scan your allowances to see what permissions your wallet has granted. This is the most important action you can take for your security.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-cobalt text-white rounded-lg font-medium hover:bg-cobalt/90 transition-colors duration-200"
                >
                  Scan Your Allowances
                </Link>
              </div>

              {/* Secondary Action - Documentation */}
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200">
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-4">Learn How to Stay Secure</h3>
                <p className="text-stone leading-relaxed mb-6">
                  Visit our documentation to understand how token allowances work and how to protect your wallet from security risks.
                </p>
                <Link 
                  href="/docs"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-cobalt text-cobalt rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors duration-200"
                >
                  Visit Documentation
                </Link>
              </div>

              {/* Tertiary Action - Homepage */}
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200">
                <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-ink mb-4">Return to Safety</h3>
                <p className="text-stone leading-relaxed mb-6">
                  Go back to our homepage where you can access all of Allowance Guard&apos;s security features and tools.
                </p>
                <Link 
                  href="/"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-line text-ink rounded-lg font-medium hover:bg-mist/50 transition-colors duration-200"
                >
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Secondary Recommendation */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="mb-6">Think This Is a Bug on Our End?</H2>
            <p className="text-lg text-stone leading-relaxed mb-8">
              Help us fix it by letting us know what went wrong. We take broken links seriously and will investigate promptly.
            </p>
            <Link 
              href="mailto:support@allowanceguard.com?subject=Broken Link Report"
              className="inline-flex items-center px-6 py-3 border border-cobalt text-cobalt rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Report a Broken Link
            </Link>
          </div>
        </Container>
      </Section>

      {/* Trust & Security Reinforcement */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-line rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Security Reminder</h3>
              <p className="text-stone leading-relaxed mb-4">
                Always verify you are on <strong>https://www.allowanceguard.com</strong>. For your security, never enter your private keys or seed phrase on any website, including this one.
              </p>
              <p className="text-sm text-stone">
                You are currently on the official Allowance Guard domain. Your connection is secure.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
