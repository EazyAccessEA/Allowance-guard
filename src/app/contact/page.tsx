'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { 
  Search, 
  Mail, 
  Shield, 
  Users, 
  MessageCircle, 
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
      
      {/* Hero Section - Clean Fireart Style */}
      <Section className="relative pt-20 pb-32 sm:pt-24 sm:pb-40 overflow-hidden">
        {/* Video Background */}
        <VideoBackground 
          videoSrc="/V3AG.mp4"
        />
        {/* Gradient overlay for better text readability */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0.75) 100%)'
          }}
        />
        
        <Container className="relative text-left max-w-4xl z-10">
          <H1 className="mb-6">How Can We Help?</H1>
          <p className="text-lg text-stone leading-relaxed mb-8">
            Find the fastest path to a solution below.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Section 1: Quick Help Search */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Quick Help Search</H2>
            <p className="text-lg text-stone leading-relaxed mb-12">
              What do you need help with? Type a few keywords below.
            </p>
            
            {/* Search Input */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="e.g., 'transaction failed', 'risk score', 'revoke approval'"
                  className="w-full pl-12 pr-4 py-4 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                />
              </div>
              
              {/* Search Results */}
              {searchQuery && (
                <div className="mt-6 bg-white border border-line rounded-lg shadow-subtle max-h-96 overflow-y-auto">
                  {filteredFAQs.length > 0 ? (
                    <div className="p-4 space-y-4">
                      {filteredFAQs.map((faq, index) => (
                        <div key={index} className="border-b border-line/50 pb-4 last:border-b-0 last:pb-0">
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

      {/* Section 2: Direct Contact Channels */}
      <Section className="py-32 bg-mist/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <H2 className="mb-8">Direct Lines of Communication</H2>
            <p className="text-lg text-stone leading-relaxed mb-12">
              Purpose-driven channels to ensure your query reaches the right team with the right context.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Channel 1: Standard Support */}
            <div className="bg-white border border-line rounded-lg p-8 shadow-subtle hover:shadow-medium transition-all duration-200">
              <div className="w-16 h-16 bg-cobalt/10 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-cobalt" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-4">General Support & Questions</h3>
              <p className="text-stone leading-relaxed mb-6">
                For help using Allowance Guard, billing inquiries, or general feedback. Our team strives to respond within 24 hours.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Response time: 24 hours</span>
                </div>
                <div className="flex items-center text-sm text-stone">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="cursor-pointer" 
                        onClick={() => window.location.href = 'mailto:support@allowanceguard.com?subject=General Support Request'}
                        title="Click to send email">
                    {obfuscateEmail('support@allowanceguard.com')}
                  </span>
                </div>
              </div>
              <a 
                href={createObfuscatedMailtoLink('support@allowanceguard.com', 'General Support Request')}
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-cobalt text-cobalt rounded-lg font-medium hover:bg-cobalt hover:text-white transition-colors duration-200"
              >
                <Mail className="w-4 h-4 mr-2" />
                Compose an email to Support
              </a>
            </div>

            {/* Channel 2: Security Emergency */}
            <div className="bg-white border-0 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-20 h-20 bg-crimson/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-crimson/10 transition-colors duration-300">
                <Shield className="w-10 h-10 text-crimson" />
              </div>
              <h3 className="text-2xl font-light text-ink mb-6">Report a Security Vulnerability</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                If you&apos;ve discovered a potential security flaw or bug within our application, please report it responsibly here. We treat these reports with the highest priority and confidentiality.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-3" />
                  <span className="font-light">Response time: 2 hours</span>
                      </div>
                <div className="flex items-center text-sm text-stone">
                  <Lock className="w-4 h-4 mr-3" />
                  <span className="font-light cursor-pointer" 
                        onClick={() => window.location.href = 'mailto:security@allowanceguard.com?subject=Security Vulnerability Report'}
                        title="Click to send email">
                    {obfuscateEmail('security@allowanceguard.com')}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <a 
                  href={createObfuscatedMailtoLink('security@allowanceguard.com', 'Security Vulnerability Report')}
                  className="inline-flex items-center justify-center w-full px-8 py-4 border border-cobalt text-cobalt rounded-2xl font-light hover:bg-cobalt hover:text-white transition-colors duration-300"
                >
                  <Shield className="w-5 h-5 mr-3" />
                  Compose an email to Security
                </a>
                <a 
                  href="/.well-known/security.txt"
                  className="inline-flex items-center justify-center w-full px-8 py-4 border border-stone/20 text-ink rounded-2xl font-light hover:bg-stone/5 transition-colors duration-300"
                >
                  <Download className="w-5 h-5 mr-3" />
                  View Security.txt
                </a>
              </div>
              </div>

            {/* Channel 3: Business & Partnerships */}
            <div className="bg-white border-0 rounded-3xl p-10 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="w-20 h-20 bg-emerald/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald/10 transition-colors duration-300">
                <Users className="w-10 h-10 text-emerald" />
              </div>
              <h3 className="text-2xl font-light text-ink mb-6">Partnerships & Press</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                Interested in integrating our data, writing about us, or exploring a partnership? Reach out to our business development team.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-sm text-stone">
                  <Clock className="w-4 h-4 mr-3" />
                  <span className="font-light">Response time: 48 hours</span>
                </div>
                <div className="flex items-center text-sm text-stone">
                  <CheckCircle className="w-4 h-4 mr-3" />
                  <span className="font-light">support@allowanceguard.com</span>
                </div>
              </div>
              <a 
                href="mailto:support@allowanceguard.com?subject=Partnership Inquiry"
                className="inline-flex items-center justify-center w-full px-8 py-4 border border-cobalt text-cobalt rounded-2xl font-light hover:bg-cobalt hover:text-white transition-colors duration-300"
              >
                <Users className="w-5 h-5 mr-3" />
                Compose an email to Business
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: Community & Async Support - Clean Layout */}
      <Section className="py-32 bg-white">
        <Container className="max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-ink leading-tight mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto font-light">
              Many users prefer to ask questions in a public forum or find existing answers.
                </p>
              </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Discord */}
            <div className="bg-stone/5 border-0 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500/20 transition-colors duration-300">
                <MessageCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-light text-ink mb-4">Discord</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                Get real-time help from our community and developers. It&apos;s the best place for quick questions and discussions.
              </p>
              <a 
                href="https://discord.gg/allowanceguard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-4 border border-cobalt text-cobalt rounded-2xl font-light hover:bg-cobalt hover:text-white transition-colors duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Join our Discord Server
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* X (formerly Twitter) */}
            <div className="bg-stone/5 border-0 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-black/20 transition-colors duration-300">
                <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light text-ink mb-4">X</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                Follow us for the latest announcements, updates, and security tips.
              </p>
              <a 
                href="https://x.com/AllowanceGuard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-4 border border-cobalt text-cobalt rounded-2xl font-light hover:bg-cobalt hover:text-white transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Follow @AllowanceGuard
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>

            {/* GitHub */}
            <div className="bg-stone/5 border-0 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gray-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-500/20 transition-colors duration-300">
                <Github className="w-8 h-8 text-gray-800" />
              </div>
              <h3 className="text-xl font-light text-ink mb-4">GitHub</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                Report technical bugs, view our open-source components, and contribute to the project&apos;s development.
              </p>
              <a 
                href="https://github.com/EazyAccessEA/Allowance-guard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-6 py-4 border border-cobalt text-cobalt rounded-2xl font-light hover:bg-cobalt hover:text-white transition-colors duration-300"
              >
                <Github className="w-5 h-5 mr-3" />
                View our GitHub
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: Trust & Transparency - Clean Minimalist */}
      <Section className="py-32 bg-stone/5">
        <Container className="max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-light text-ink leading-tight mb-6">
              Our Commitment to You
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto font-light">
              We take your security and privacy seriously. Here&apos;s our commitment to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Expected Response Time */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl font-light text-ink mb-6">Expected Response Time</h3>
              <p className="text-stone leading-relaxed font-light">
                We are committed to responding to all serious inquiries within one business day. Security vulnerability reports are acknowledged within 24 hours.
              </p>
            </div>

            {/* Privacy Assurance */}
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Lock className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-light text-ink mb-6">Privacy Assurance</h3>
              <p className="text-stone leading-relaxed font-light">
                We value your privacy. Information you provide in your communication will be used solely to address your inquiry. For details, please review our Privacy Policy.
              </p>
            </div>

            {/* PGP Key */}
            <div className="text-center">
              <div className="w-20 h-20 bg-crimson/5 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Shield className="w-10 h-10 text-crimson-600" />
              </div>
              <h3 className="text-2xl font-light text-ink mb-6">Encrypt Sensitive Information</h3>
              <p className="text-stone leading-relaxed mb-8 font-light">
                For highly sensitive security reports, you may use our public PGP key to encrypt your message to security@allowanceguard.com.
              </p>
              <a 
                href="/pgp-key.asc"
                className="inline-flex items-center px-6 py-3 text-sm font-light text-cobalt border border-cobalt rounded-2xl hover:bg-cobalt hover:text-white transition-colors duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download our PGP Key
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}