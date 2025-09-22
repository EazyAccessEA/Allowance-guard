// config/index.ts
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base } from '@reown/appkit/networks'

// Reuse your existing env var
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing')

export const networks = [mainnet, arbitrum, base]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
  metadata: {
    name: 'Allowance Guard',
    description: 'Open-source, free tool to view and revoke token approvals safely',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com',
    icons: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/android-chrome-192x192.png`,
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.allowanceguard.com'}/android-chrome-512x512.png`
    ]
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
