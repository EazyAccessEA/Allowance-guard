'use client'

import NextError from 'next/error'
import { useEffect } from 'react'
import { reportClientError } from '@/lib/rollbar'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    reportClientError(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={undefined as never} />
      </body>
    </html>
  )
}
