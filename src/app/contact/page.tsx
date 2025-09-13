'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { useAccount } from 'wagmi'
import { CheckCircle, AlertCircle, Mail } from 'lucide-react'
import VideoBackground from '@/components/VideoBackground'

export default function ContactPage() {
  const { isConnected } = useAccount()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
    walletAddress: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      // In a real app, you'd call your API here
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setStatus('success')
      setMessage('Your message has been sent successfully! We\'ll get back to you within 24 hours.')
      
      // Clear form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          message: '',
          walletAddress: ''
        })
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch {
      setStatus('error')
      setMessage('Failed to send message. Please try again or use one of our alternative contact methods.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactCategories = [
    {
      id: 'general',
      title: 'General Question',
      description: 'General questions about Allowance Guard'
    },
    {
      id: 'technical',
      title: 'Technical Issue',
      description: 'Bug reports, scanning problems, or technical issues'
    },
    {
      id: 'security',
      title: 'Security Concern',
      description: 'Security-related questions or concerns'
    },
    {
      id: 'feature',
      title: 'Feature Request',
      description: 'Suggestions for new features or improvements'
    }
  ]

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'legal.support@allowanceguard.com'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available 9 AM - 5 PM EST'
    },
    {
      title: 'Response Time',
      description: 'Typical response times for different issues',
      contact: 'General: 24h | Technical: 12h | Security: 2h'
    }
  ]

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
            Contact Support
          </h1>
          <p className="text-xl sm:text-2xl text-stone leading-relaxed max-w-3xl mx-auto">
            We&apos;re here to help! Choose the best way to get in touch with our support team.
          </p>
        </Container>
      </Section>

      {/* Contact Methods - Fireart Style */}
      <Section className="py-20 bg-mist/30">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Multiple ways to reach our support team for quick assistance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method) => (
              <div key={method.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-subtle">
                  <Mail className="w-8 h-8 text-ink" />
                </div>
                <h3 className="text-xl font-semibold text-ink mb-4">{method.title}</h3>
                <p className="text-stone leading-relaxed mb-4">{method.description}</p>
                <p className="text-lg font-medium text-ink">{method.contact}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form - Fireart Style */}
      <Section className="py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Send us a Message
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-base font-medium text-ink mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-ink mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-base font-medium text-ink mb-3">
                  What can we help you with? *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactCategories.map((category) => (
                    <label
                      key={category.id}
                      className={`relative cursor-pointer border-2 rounded-lg p-6 transition-all ${
                        formData.category === category.id
                          ? 'border-cobalt bg-cobalt/5'
                          : 'border-line hover:border-cobalt/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={formData.category === category.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div>
                        <h3 className="text-base font-medium text-ink mb-1">
                          {category.title}
                        </h3>
                        <p className="text-base text-stone">
                          {category.description}
                        </p>
                      </div>
                      {formData.category === category.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-5 h-5 text-ink" />
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-base font-medium text-ink mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              {/* Wallet Address (Optional) */}
              <div>
                <label htmlFor="walletAddress" className="block text-base font-medium text-ink mb-2">
                  Wallet Address (Optional)
                </label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200"
                  placeholder="0x..."
                />
                <p className="text-sm text-stone mt-2">
                  Include your wallet address if your issue is related to a specific wallet.
                </p>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-base font-medium text-ink mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 text-base border border-line rounded-lg bg-white text-ink placeholder-stone focus:outline-none focus:ring-2 focus:ring-cobalt/30 focus:border-cobalt transition-colors duration-200 resize-none"
                  placeholder="Please provide as much detail as possible about your issue or question..."
                  required
                />
              </div>

              {/* Status Message */}
              {message && (
                <div className={`p-4 rounded-lg flex items-center ${
                  status === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mr-2" />
                  )}
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200 bg-cobalt text-white hover:bg-cobalt/90 focus:outline-none focus:ring-2 focus:ring-cobalt/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="w-4 h-4 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section - Fireart Style */}
      <Section className="py-24 bg-mist/20">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-semibold text-ink leading-tight mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-stone max-w-2xl mx-auto">
              Quick answers to common questions about our support process.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-line rounded-2xl p-8 shadow-subtle">
              <div className="space-y-8">
                <div>
                  <h4 className="text-xl font-semibold text-ink mb-4">How quickly will I get a response?</h4>
                  <p className="text-lg text-stone leading-relaxed">
                    We typically respond within 24 hours for general questions, 12 hours for technical issues, and 2 hours for security concerns.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-ink mb-4">What information should I include?</h4>
                  <p className="text-lg text-stone leading-relaxed">
                    Please include your wallet address (if relevant), browser type, and detailed steps to reproduce any issues you&apos;re experiencing.
                  </p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-ink mb-4">Is my information secure?</h4>
                  <p className="text-lg text-stone leading-relaxed">
                    Yes, we take your privacy seriously. All communications are encrypted and we never share your personal information.
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-line">
                <a href="/faq" className="text-lg text-ink hover:text-cobalt font-medium transition-colors duration-200">
                  View all FAQs →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}