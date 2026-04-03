import { clientFor } from '@/lib/chains'
import { getSupportedChainIds } from '@/lib/networks'
import { getBlockNumber } from 'viem/actions'
import { logger } from './logger'

export async function run() {
  try {
    logger.info('Starting RPC health check')
    
    const chainIds = getSupportedChainIds(true) // Only enabled chains
    const blockNumbers = await Promise.all(
      chainIds.map(async (id) => {
        const client = clientFor(id as 1 | 42161 | 8453 | 10 | 137 | 43114 | 56 | 250 | 324 | 1101 | 5000 | 100 | 59144 | 534352 | 42220)
        const block = await getBlockNumber(client)
        return { chainId: id, block }
      })
    )
    
    const results = blockNumbers.reduce((acc, { chainId, block }) => {
      acc[chainId] = block.toString()
      return acc
    }, {} as Record<number, string>)
    
    logger.info('RPC health check completed', results)
    logger.info('All RPC connections healthy')
  } catch (error) {
    logger.error('RPC health check failed', { error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

// Run the health check if this file is executed directly
if (require.main === module) {
  run()
}
