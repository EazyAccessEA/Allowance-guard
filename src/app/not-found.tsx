import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  Home, 
  BookOpen, 
  Scan, 
  Mail, 
  ShieldAlert,
  MapPin
} from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-ink">
      <Header isConnected={false} />
      
      {/* Core Message Section */}
      <Section className="relative py-24 sm:py-32">
        <Container className="relative text-center max-w-4xl z-10">
          {/* Logo - Prominently displayed for Security-First Sam */}
          <div className="mb-8">
            <Image
              src="/AG_Logo2.png"
              alt="Allowance Guard Logo - Official Security Platform"
              width={120}
              height={120}
              className="mx-auto"
              priority
            />
          </div>

          {/* Main Heading */}
          <H1 className="mb-6">Allowance Found. Page Not Found.</H1>
          
          {/* Sub-heading - Reassuring for both personas */}
          <p className="text-xl text-stone leading-relaxed mb-8 max-w-2xl mx-auto">
            Don&apos;t worry, it&apos;s just this page that&apos;s missing, not your tokens. You&apos;re still securely on AllowanceGuard.com.
          </p>

          {/* Body Text - Calm and helpful tone */}
          <p className="text-lg text-stone leading-relaxed mb-12 max-w-3xl mx-auto">
            The link you followed may be broken, or the page may have been moved. While our system is great at finding risky allowances, it seems this one got away from us.
          </p>

          {/* Illustration - Simple and appropriate */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto bg-mist/30 rounded-2xl flex items-center justify-center">
              <div className="relative">
                <MapPin className="w-16 h-16 text-crimson" />
              </div>
            </div>
            <p className="text-sm text-stone mt-4">Missing page indicator</p>
          </div>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Actionable Guidance Section - The Most Critical Part */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8 text-center">Let&apos;s Get You Back on Track</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Primary Action - Scan Allowances (Primary conversion goal) */}
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200 group">
                <div className="w-16 h-16 bg-cobalt/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-cobalt/20 transition-colors duration-200">
                  <Scan className="w-8 h-8 text-cobalt" />
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
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200 group">
                <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-teal/20 transition-colors duration-200">
                  <BookOpen className="w-8 h-8 text-teal" />
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
              <div className="bg-white border border-line rounded-lg p-8 text-center hover:shadow-medium transition-all duration-200 group">
                <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald/20 transition-colors duration-200">
                  <Home className="w-8 h-8 text-emerald" />
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

      {/* Secondary Recommendation - For Detail-Oriented Users */}
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
              <Mail className="w-5 h-5 mr-2" />
              Report a Broken Link
            </Link>
          </div>
        </Container>
      </Section>

      {/* Trust & Security Reinforcement - Specifically for Security-First Sam */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-crimson/5 border border-crimson/20 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-crimson/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert className="w-8 h-8 text-crimson" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Security Verification</h3>
              <p className="text-stone leading-relaxed mb-4">
                Always verify you are on <strong className="font-mono text-ink">https://www.allowanceguard.com</strong>. For your security, never enter your private keys or seed phrase on any website, including this one.
              </p>
              <p className="text-sm text-stone">
                You are currently on the official Allowance Guard domain. Your connection is secure and verified.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
