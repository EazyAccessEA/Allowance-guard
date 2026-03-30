import { createPublicClient, http } from 'viem'
import { mainnet, arbitrum, base } from 'viem/chains'

export const eth = createPublicClient({ 
  chain: mainnet,  
  transport: http(process.env.ETHEREUM_RPC_URL!) 
})

export const arb = createPublicClient({ 
  chain: arbitrum, 
  transport: http(process.env.ARBITRUM_RPC_URL!) 
})

export const bas = createPublicClient({ 
  chain: base,     
  transport: http(process.env.BASE_RPC_URL!) 
})
