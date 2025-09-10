import { eth, arb, bas } from '@/lib/rpc'
import { logger } from './logger'

export async function run() {
  try {
    logger.info('Starting RPC health check')
    
    const [ethBlock, arbBlock, baseBlock] = await Promise.all([
      eth.getBlockNumber(),
      arb.getBlockNumber(), 
      bas.getBlockNumber()
    ])
    
    logger.info('RPC health check completed', {
      eth: ethBlock.toString(),
      arb: arbBlock.toString(),
      base: baseBlock.toString()
    })
    
    logger.info('All RPC connections healthy')
  } catch (error) {
    logger.error('RPC health check failed', { error: error instanceof Error ? error.message : 'Unknown error' })
  }
}

// Run the health check if this file is executed directly
if (require.main === module) {
  run()
}
