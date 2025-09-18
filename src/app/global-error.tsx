'use client'

import NextError from 'next/error'
import { useEffect } from 'react'
import { rollbarClient } from '@/lib/rollbar'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (rollbarClient) {
      rollbarClient.error(error)
    } else {
      console.error('Global error:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={undefined as never} />
      </body>
    </html>
  )
}
