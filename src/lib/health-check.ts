import { eth, arb, bas } from '@/lib/rpc'

export async function run() {
  try {
    console.log('Checking RPC connections...')
    
    const [ethBlock, arbBlock, baseBlock] = await Promise.all([
      eth.getBlockNumber(),
      arb.getBlockNumber(), 
      bas.getBlockNumber()
    ])
    
    console.log('ETH block:', ethBlock.toString())
    console.log('ARB block:', arbBlock.toString())
    console.log('BASE block:', baseBlock.toString())
    
    console.log('All RPC connections healthy!')
  } catch (error) {
    console.error('RPC health check failed:', error)
  }
}

// Run the health check if this file is executed directly
if (require.main === module) {
  run()
}
