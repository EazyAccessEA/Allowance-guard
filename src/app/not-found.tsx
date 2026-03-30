import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-gray-600">If you followed a share link, it may have expired.</p>
      <Link href="/" className="mt-4 inline-block rounded border px-3 py-2 text-sm">Go home</Link>
    </main>
  )
}