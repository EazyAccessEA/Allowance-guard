'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useAccount } from 'wagmi'
import { 
  Search, 
  Mail, 
  Shield, 
  Users, 
  MessageCircle, 
  Twitter, 
  Github, 
  Clock, 
  Lock,
  Download,
  ExternalLink,
  CheckCircle,
  HelpCircle
} from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

const faqData = [
  {
    question: "Why did my transaction fail?",
    answer: "Transaction failures can occur due to insufficient gas, network congestion, or smart contract issues. Check your gas settings and try again.",
    keywords: ["transaction", "fail", "gas", "error"]
  },
  {
    question: "How do I interpret a risk score?",
    answer: "Risk scores range from 0-100. 0-30 is low risk, 31-70 is medium risk, and 71-100 is high risk. Higher scores indicate more dangerous allowances.",
    keywords: ["risk", "score", "interpret", "dangerous"]
  },
  {
    question: "How to revoke token approvals?",
    answer: "Use our 'Revoke' button next to any allowance, or use the bulk revoke feature to revoke multiple approvals at once.",
    keywords: ["revoke", "approval", "token", "bulk"]
  },
  {
    question: "What is an unlimited allowance?",
    answer: "An unlimited allowance allows a contract to spend all of your tokens without asking for permission each time. This is often unnecessary and risky.",
    keywords: ["unlimited", "allowance", "spend", "permission"]
  },
  {
    question: "How do I connect my wallet?",
    answer: "Click the 'Connect Wallet' button in the header and select your wallet provider. We support MetaMask, WalletConnect, and more.",
    keywords: ["connect", "wallet", "metamask", "walletconnect"]
  },
  {
    question: "Is my wallet information secure?",
    answer: "Yes, we never store your private keys or seed phrases. We only read public blockchain data to analyze your allowances.",
    keywords: ["secure", "private", "keys", "blockchain"]
  }
]

export default function ContactPage() {
  const { isConnected } = useAccount()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFAQs, setFilteredFAQs] = useState(faqData)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    
    if (query === '') {
      setFilteredFAQs(faqData)
    } else {
      const filtered = faqData.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )
      setFilteredFAQs(filtered)
    }
  }

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
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ink leading-[1.1] tracking-tight mb-8">
            How Can We Help?
          </h1>
          <p className="text-xl sm:text-2xl text-stone leading-relaxed max-w-3xl">
            Find the fastest path to a solution below.
          </p>
        </Container>
      </Section>

      {/* Section 1: Immediate, Guided Resolution (Tier 0 Support) */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Quick Help Search
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto mb-8">
              What do you need help with? Type a few keywords below.
            </p>
            
            {/* Dynamic FAQ Search */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="e.g., 'transaction failed', 'risk score', 'revoke approval'"
                  className="w-full pl-12 pr-4 py-4 text-lg border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                />
              </div>
              
              {/* Search Results */}
              {searchQuery && (
                <div className="mt-6 bg-white border border-line rounded-lg shadow-subtle max-h-96 overflow-y-auto">
                  {filteredFAQs.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {filteredFAQs.map((faq, index) => (
                        <div key={index} className="border-b border-line/50 pb-4 last:border-b-0">
                          <h4 className="text-lg font-medium text-ink mb-2">{faq.question}</h4>
                          <p className="text-stone leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <HelpCircle className="w-12 h-12 text-stone mx-auto mb-4" />
                      <p className="text-stone">No results found. Try different keywords or contact us directly.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2: Direct Contact Channels (Tier 1 Support) */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Direct Lines of Communication
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Purpose-driven channels to ensure your query reaches the right team with the right context.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Channel 1: Standard Support */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200">
              <div className="w-16 h-16 bg-cobalt/10 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-cobalt" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">General Support & Questions</h3>
              <p className="text-stone leading-relaxed mb-6">
                For help using Allowance Guard, billing inquiries, or general feedback. Our team strives to respond within 24 hours.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Response time: 24 hours</span>
                </div>
                <div className="flex items-center text-sm text-stone">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>support@allowanceguard.com</span>
                </div>
              </div>
              <a 
                href="mailto:support@allowanceguard.com?subject=General Support Request"
                className="inline-flex items-center justify-center w-full mt-6 px-6 py-3 bg-cobalt text-white rounded-lg font-medium hover:bg-cobalt/90 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Compose an email to Support
              </a>
            </div>

            {/* Channel 2: Security Emergency */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200">
              <div className="w-16 h-16 bg-crimson/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-crimson" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Report a Security Vulnerability</h3>
              <p className="text-stone leading-relaxed mb-6">
                If you&apos;ve discovered a potential security flaw or bug within our application, please report it responsibly here. We treat these reports with the highest priority and confidentiality.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Response time: 2 hours</span>
                </div>
                <div className="flex items-center text-sm text-stone">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>security@allowanceguard.com</span>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <a 
                  href="mailto:security@allowanceguard.com?subject=Security Vulnerability Report"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-crimson text-white rounded-lg font-medium hover:bg-crimson/90 transition-colors duration-200"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Compose an email to Security
                </a>
                <a 
                  href="/.well-known/security.txt"
                  className="inline-flex items-center justify-center w-full px-6 py-3 border border-line text-ink rounded-lg font-medium hover:bg-mist transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  View Security.txt
                </a>
              </div>
            </div>

            {/* Channel 3: Business & Partnerships */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200">
              <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Partnerships & Press</h3>
              <p className="text-stone leading-relaxed mb-6">
                Interested in integrating our data, writing about us, or exploring a partnership? Reach out to our business development team.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Response time: 48 hours</span>
                </div>
                <div className="flex items-center text-sm text-stone">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>hello@allowanceguard.com</span>
                </div>
              </div>
              <a 
                href="mailto:hello@allowanceguard.com?subject=Partnership Inquiry"
                className="inline-flex items-center justify-center w-full mt-6 px-6 py-3 bg-emerald text-white rounded-lg font-medium hover:bg-emerald/90 transition-colors duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Compose an email to Business
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: Community & Async Support */}
      <Section className="py-24 bg-mist/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Many users prefer to ask questions in a public forum or find existing answers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Discord */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Discord</h3>
              <p className="text-stone leading-relaxed mb-6">
                Get real-time help from our community and developers. It&apos;s the best place for quick questions and discussions.
              </p>
              <a 
                href="https://discord.gg/allowanceguard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join our Discord Server
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* Twitter/X */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Twitter className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">Twitter/X</h3>
              <p className="text-stone leading-relaxed mb-6">
                Follow us for the latest announcements, updates, and security tips.
              </p>
              <a 
                href="https://twitter.com/AllowanceGuard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Follow @AllowanceGuard
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* GitHub */}
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle hover:shadow-medium transition-all duration-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Github className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">GitHub</h3>
              <p className="text-stone leading-relaxed mb-6">
                Report technical bugs, view our open-source components, and contribute to the project&apos;s development.
              </p>
              <a 
                href="https://github.com/AllowanceGuard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200"
              >
                <Github className="w-4 h-4 mr-2" />
                View our GitHub
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: Trust & Transparency Elements */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Our Commitment to You
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              We take your security and privacy seriously. Here&apos;s our commitment to you.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Expected Response Time */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-amber/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-4">Expected Response Time</h3>
                  <p className="text-stone leading-relaxed">
                    We are committed to responding to all serious inquiries within one business day. Security vulnerability reports are acknowledged within 24 hours.
                  </p>
                </div>

                {/* Privacy Assurance */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-4">Privacy Assurance</h3>
                  <p className="text-stone leading-relaxed">
                    We value your privacy. Information you provide in your communication will be used solely to address your inquiry. For details, please review our Privacy Policy.
                  </p>
                </div>

                {/* PGP Key */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-crimson/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-crimson-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-4">Encrypt Sensitive Information</h3>
                  <p className="text-stone leading-relaxed mb-4">
                    For highly sensitive security reports, you may use our public PGP key to encrypt your message to security@allowanceguard.com.
                  </p>
                  <a 
                    href="/pgp-key.asc"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-crimson-600 border border-crimson-200 rounded-lg hover:bg-crimson-50 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download our PGP Key
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}