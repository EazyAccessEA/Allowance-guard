import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import ContextProvider from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0A0A'
}

export const metadata: Metadata = {
  title: 'Allowance Guard',
  description: 'Monitor & revoke risky token approvals',
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
  robots: 'index, follow',
  openGraph: {
    title: 'Allowance Guard',
    description: 'Monitor & revoke risky token approvals',
    type: 'website',
    locale: 'en_US',
    siteName: 'Allowance Guard'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allowance Guard',
    description: 'Monitor & revoke risky token approvals'
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
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
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
