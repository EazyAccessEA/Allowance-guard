'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Container from '@/components/ui/Container'
import Section from '@/components/ui/Section'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  
  // Handle error messages from URL params
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'invalid_token':
          setError('Invalid or malformed magic link token')
          break
        case 'expired_or_invalid':
          setError('Magic link has expired or is invalid. Please request a new one.')
          break
        case 'invalid_redirect':
          setError('Invalid redirect URL')
          break
        case 'verification_failed':
          setError('Failed to verify magic link. Please try again.')
          break
        default:
          setError('An error occurred during sign in')
      }
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    
    try {
      const res = await fetch('/api/auth/magic/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirect })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage('Check your email for a sign-in link!')
      } else {
        setError(data.error || 'Failed to send sign-in link')
      }
    } catch {
      setError('Failed to send sign-in link. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isConnected={false} />
      
      <Section className="py-24">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-ink mb-2">Sign In</h1>
              <p className="text-stone">Enter your email to receive a magic link</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-line rounded-md focus:outline-none focus:ring-2 focus:ring-ink/20"
                  placeholder="your@email.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-white py-2 px-4 rounded-md hover:bg-ink/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>
            
            {message && (
              <div className="mt-4 p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
                {error}
              </div>
            )}
          </div>
        </Container>
      </Section>
      
      <Footer />
    </div>
  )
}
