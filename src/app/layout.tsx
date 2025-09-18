import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '@/context'
import RpcStatusBanner from '@/components/RpcStatusBanner'
import HeaderWrapper from '@/components/HeaderWrapper'
import Footer from '@/components/Footer'
import RollbarProvider from '@/components/RollbarProvider'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A'
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: { default: 'Allowance Guard', template: '%s · Allowance Guard' },
  description: 'Open-source, free tool to view and revoke token approvals safely.',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Allowance Guard',
    description: 'Open-source, free tool to view and revoke token approvals safely.',
    url: '/',
    siteName: 'Allowance Guard',
    type: 'website',
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'Allowance Guard',
    description: 'Open-source, free tool to view and revoke token approvals safely.'
  }
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white border px-2 py-1 text-sm z-50">Skip to content</a>
        <RpcStatusBanner />
        <RollbarProvider>
          <ContextProvider cookies={cookies}>
            <HeaderWrapper />
            <main id="main" className="flex-1">{children}</main>
            <Footer />
          </ContextProvider>
        </RollbarProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Coinbase Commerce metrics errors
              (function() {
                const originalError = console.error;
                console.error = function(...args) {
                  if (args[0] && typeof args[0] === 'string' && 
                      (args[0].includes('cca-lite.coinbase.com/metrics') || 
                       args[0].includes('Failed to load resource: the server responded with a status of 401'))) {
                    return; // Suppress Coinbase Commerce metrics errors
                  }
                  originalError.apply(console, args);
                };
              })();
            `
          }}
        />
      </body>
    </html>
  )
}
