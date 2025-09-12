'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'
import { H1, H2 } from '@/components/ui/Heading'
import { useAccount } from 'wagmi'
import { CheckCircle, AlertCircle, Mail } from 'lucide-react'

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
      contact: 'support@allowanceguard.com'
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
      
      <Section>
        <Container>
          <H1 className="mb-6">Contact Support</H1>
          <p className="text-base text-stone max-w-reading">
            We&apos;re here to help! Choose the best way to get in touch with our support team.
          </p>
        </Container>
      </Section>

      <div className="border-t border-line" />

      {/* Contact Methods */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Get in Touch</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <div key={method.title} className="border border-line rounded-md p-6 bg-white">
                <h3 className="text-lg text-ink mb-3">{method.title}</h3>
                <p className="text-base text-stone mb-3">{method.description}</p>
                <p className="text-base font-medium text-ink">{method.contact}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form */}
      <Section>
        <Container>
          <H2 className="mb-6">Send us a Message</H2>
          
          <div className="border border-line rounded-md p-8 bg-white">
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
                    className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
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
                    className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
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
                      className={`relative cursor-pointer border-2 rounded-md p-4 transition-all ${
                        formData.category === category.id
                          ? 'border-ink bg-mist'
                          : 'border-line hover:border-ink/50'
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
                  className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
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
                  className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
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
                  className="w-full px-4 py-3 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/30"
                  placeholder="Please provide as much detail as possible about your issue or question..."
                  required
                />
              </div>

              {/* Status Message */}
              {message && (
                <div className={`p-4 rounded-md flex items-center ${
                  status === 'success' 
                    ? 'bg-mist border border-line text-ink' 
                    : 'bg-mist border border-line text-ink'
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
                  className="inline-flex items-center rounded-md px-6 py-3 text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-ink text-white hover:opacity-90 focus:ring-ink/30 disabled:opacity-50"
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
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section className="bg-mist">
        <Container>
          <H2 className="mb-6">Frequently Asked Questions</H2>
          <div className="border border-line rounded-md p-6 bg-white">
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-ink mb-2">How quickly will I get a response?</h4>
                <p className="text-base text-stone">
                  We typically respond within 24 hours for general questions, 12 hours for technical issues, and 2 hours for security concerns.
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-ink mb-2">What information should I include?</h4>
                <p className="text-base text-stone">
                  Please include your wallet address (if relevant), browser type, and detailed steps to reproduce any issues you&apos;re experiencing.
                </p>
              </div>
              <div>
                <h4 className="text-base font-medium text-ink mb-2">Is my information secure?</h4>
                <p className="text-base text-stone">
                  Yes, we take your privacy seriously. All communications are encrypted and we never share your personal information.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <a href="/faq" className="text-base text-ink hover:text-ink/70 font-medium">
                View all FAQs →
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}