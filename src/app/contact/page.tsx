'use client'

import { useState } from 'react'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
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
    <div className="min-h-screen">
      
      {/* Hero Section - Mobbin Style */}
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
          <h1 className="mobbin-display-1 text-text-primary mb-6 mobbin-fade-in">How Can We Help?</h1>
          <p className="mobbin-body-large text-text-secondary leading-relaxed mb-8 mobbin-fade-in mobbin-stagger-1">
            Find the fastest path to a solution below.
          </p>
        </Container>
      </Section>

      <div className="border-t border-border-primary" />

      {/* Section 1: Quick Help Search */}
      <Section className="py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-text-primary mb-8 mobbin-fade-in">Quick Help Search</h2>
            <p className="mobbin-body-large text-text-secondary leading-relaxed mb-12 mobbin-fade-in mobbin-stagger-1">
              What do you need help with? Type a few keywords below.
            </p>
            
            {/* Search Input */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="e.g., 'transaction failed', 'risk score', 'revoke approval'"
                  className="w-full pl-12 pr-4 py-4 mobbin-body border border-border-primary rounded-lg bg-background-primary text-text-primary placeholder-text-tertiary mobbin-focus-ring focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-colors duration-200"
                />
              </div>
              
              {/* Search Results */}
              {searchQuery && (
                <div className="mt-6 mobbin-card shadow-sm max-h-96 overflow-y-auto">
                  {filteredFAQs.length > 0 ? (
                    <div className="p-6 space-y-6">
                      {filteredFAQs.map((faq, index) => (
                        <div key={index} className="border-b border-border-primary/50 pb-6 last:border-b-0 last:pb-0 mobbin-fade-in mobbin-stagger-1">
                          <h4 className="mobbin-heading-4 text-text-primary mb-3">{faq.question}</h4>
                          <p className="mobbin-body text-text-secondary leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <HelpCircle className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
                      <p className="mobbin-body text-text-secondary">No results found. Try different keywords or contact us directly.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2: Direct Contact Channels */}
      <Section className="py-32 bg-background-secondary">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="mobbin-heading-1 text-text-primary mb-8 mobbin-fade-in">Direct Lines of Communication</h2>
            <p className="mobbin-body-large text-text-secondary leading-relaxed mb-12 mobbin-fade-in mobbin-stagger-1">
              Purpose-driven channels to ensure your query reaches the right team with the right context.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Channel 1: Standard Support */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-primary-700" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">General Support & Questions</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-6">
                  For help using Allowance Guard, billing inquiries, or general feedback. Our team strives to respond within 24 hours.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Response time: 24 hours</span>
                  </div>
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <a 
                      href="mailto:support@allowanceguard.com?subject=General Support Request"
                      className="cursor-pointer hover:text-primary-700 transition-colors duration-200" 
                      title="Click to send email"
                    >
                      support@allowanceguard.com
                    </a>
                  </div>
                </div>
                <a 
                  href="mailto:support@allowanceguard.com?subject=General Support Request"
                  className="inline-flex items-center justify-center w-full px-6 py-3 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-primary-700 rounded-lg hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Compose an email to Support
                </a>
              </div>
            </div>

            {/* Channel 2: Security Emergency */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2">
              <div className="p-8">
                <div className="w-16 h-16 bg-semantic-error-50 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-semantic-error-500" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">Report a Security Vulnerability</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-6">
                  If you&apos;ve discovered a potential security flaw or bug within our application, please report it responsibly here. We treat these reports with the highest priority and confidentiality.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Response time: 2 hours</span>
                  </div>
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <Lock className="w-4 h-4 mr-2" />
                    <a 
                      href="mailto:security@allowanceguard.com?subject=Security Vulnerability Report"
                      className="cursor-pointer hover:text-semantic-error-500 transition-colors duration-200" 
                      title="Click to send email"
                    >
                      security@allowanceguard.com
                    </a>
                  </div>
                </div>
                <div className="space-y-3">
                  <a 
                    href="mailto:security@allowanceguard.com?subject=Security Vulnerability Report"
                    className="inline-flex items-center justify-center w-full px-6 py-3 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-semantic-error-500 text-semantic-error-500 rounded-lg hover:bg-semantic-error-500 hover:text-white transition-colors duration-200"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Compose an email to Security
                  </a>
                  <a 
                    href="/.well-known/security.txt"
                    className="inline-flex items-center justify-center w-full px-6 py-3 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-border-primary text-text-primary rounded-lg hover:bg-background-secondary transition-colors duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View Security.txt
                  </a>
                </div>
              </div>
            </div>

            {/* Channel 3: Business & Partnerships */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3">
              <div className="p-8">
                <div className="w-16 h-16 bg-semantic-success-50 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-semantic-success-500" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">Partnerships & Press</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-6">
                  Interested in integrating our data, writing about us, or exploring a partnership? Reach out to our business development team.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Response time: 48 hours</span>
                  </div>
                  <div className="flex items-center mobbin-caption text-text-tertiary">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>support@allowanceguard.com</span>
                  </div>
                </div>
                <a 
                  href="mailto:support@allowanceguard.com?subject=Partnership Inquiry"
                  className="inline-flex items-center justify-center w-full px-6 py-3 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-semantic-success-500 text-semantic-success-500 rounded-lg hover:bg-semantic-success-500 hover:text-white transition-colors duration-200"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Compose an email to Business
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: Community & Async Support - Mobbin Layout */}
      <Section className="py-32">
        <Container className="max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="mobbin-display-2 text-text-primary leading-tight mb-6 mobbin-fade-in">
              Join Our Community
            </h2>
            <p className="mobbin-body-large text-text-secondary max-w-2xl mx-auto mobbin-fade-in mobbin-stagger-1">
              Many users prefer to ask questions in a public forum or find existing answers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Discord */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-primary-700" />
                </div>
                <h3 className="mobbin-heading-4 text-text-primary mb-4">Discord</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-8">
                  Get real-time help from our community and developers. It&apos;s the best place for quick questions and discussions.
                </p>
                <a 
                  href="https://discord.gg/allowanceguard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-primary-700 rounded-lg hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join our Discord Server
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* X (formerly Twitter) */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <h3 className="mobbin-heading-4 text-text-primary mb-4">X</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-8">
                  Follow us for the latest announcements, updates, and security tips.
                </p>
                <a 
                  href="https://x.com/AllowanceGuard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-primary-700 rounded-lg hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Follow @AllowanceGuard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Github className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="mobbin-heading-4 text-text-primary mb-4">GitHub</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-8">
                  Report technical bugs, view our open-source components, and contribute to the project&apos;s development.
                </p>
                <a 
                  href="https://github.com/EazyAccessEA/Allowance-guard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-6 py-4 mobbin-body font-medium mobbin-hover-lift mobbin-focus-ring border border-primary-700 text-primary-700 rounded-lg hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View our GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: Trust & Transparency - Mobbin Style */}
      <Section className="py-32 bg-background-secondary">
        <Container className="max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="mobbin-display-2 text-text-primary leading-tight mb-6 mobbin-fade-in">
              Our Commitment to You
            </h2>
            <p className="mobbin-body-large text-text-secondary max-w-2xl mx-auto mobbin-fade-in mobbin-stagger-1">
              We take your security and privacy seriously. Here&apos;s our commitment to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Expected Response Time */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-1 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-semantic-warning-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-semantic-warning-500" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">Expected Response Time</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed">
                  We are committed to responding to all serious inquiries within one business day. Security vulnerability reports are acknowledged within 24 hours.
                </p>
              </div>
            </div>

            {/* Privacy Assurance */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-2 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-semantic-success-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-semantic-success-500" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">Privacy Assurance</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed">
                  We value your privacy. Information you provide in your communication will be used solely to address your inquiry. For details, please review our Privacy Policy.
                </p>
              </div>
            </div>

            {/* PGP Key */}
            <div className="mobbin-card mobbin-card-hover mobbin-fade-in mobbin-stagger-3 text-center">
              <div className="p-8">
                <div className="w-16 h-16 bg-semantic-error-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-semantic-error-500" />
                </div>
                <h3 className="mobbin-heading-3 text-text-primary mb-4">Encrypt Sensitive Information</h3>
                <p className="mobbin-body text-text-secondary leading-relaxed mb-6">
                  For highly sensitive security reports, you may use our public PGP key to encrypt your message to security@allowanceguard.com.
                </p>
                <a 
                  href="/pgp-key.asc"
                  className="inline-flex items-center px-6 py-3 mobbin-caption font-medium mobbin-hover-lift mobbin-focus-ring text-primary-700 border border-primary-700 rounded-lg hover:bg-primary-700 hover:text-white transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download our PGP Key
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}