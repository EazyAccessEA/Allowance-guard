'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <main style={{ maxWidth: '32rem', margin: '4rem auto', padding: '1.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6B7280' }}>
            We&apos;ve logged the error. Please try again.
          </p>
          {error?.digest && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', wordBreak: 'break-all' }}>
              {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
