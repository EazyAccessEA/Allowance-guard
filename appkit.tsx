import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from '@wagmi/core'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Allowance Guard',
  description: 'Open-source, free tool to view and revoke token approvals safely',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com',
  icons: [
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/AG_Logo2.png`,
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/AG_Logo_Grey.png`,
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/android-chrome-192x192.png`,
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/android-chrome-512x512.png`
  ]
}

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks: [mainnet, arbitrum, base]
})

export const config = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
    onramp: false,
    swaps: false
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#1E1F23',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#2563EB',
    '--w3m-border-radius-master': '8px',
    '--w3m-font-size-master': '16px',
    '--w3m-font-family': 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    '--w3m-z-index': 9999,
  }
})

// Export wagmiAdapter for use in context
export { wagmiAdapter }

// Create AppKitProvider component
import { AppKitProvider as BaseAppKitProvider } from '@reown/appkit/react'

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return <BaseAppKitProvider>{children}</BaseAppKitProvider>
}

export default config
