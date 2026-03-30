'use client'
export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  return (
    <html>
      <body>
        <main className="mx-auto max-w-xl px-6 py-16 text-center">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-600">We&apos;ve logged the error. Please try again.</p>
          <div className="mt-3 text-xs text-gray-500 break-all">{error?.digest}</div>
          <button onClick={reset} className="mt-4 rounded border border-black bg-black text-white px-3 py-2 text-sm hover:bg-gray-800">Try again</button>
        </main>
      </body>
    </html>
  )
}
