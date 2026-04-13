// config/index.ts
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base, polygon, optimism, avalanche, bsc, fantom, zkSync, polygonZkEvm, mantle, gnosis, linea, scroll, celo } from '@reown/appkit/networks'

// Reuse your existing env var
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

if (!projectId) throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing')

// All 27 supported chains — matches src/config/chains.ts
export const networks = [mainnet, arbitrum, base, polygon, optimism, avalanche, bsc, fantom, zkSync, polygonZkEvm, mantle, gnosis, linea, scroll, celo]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
