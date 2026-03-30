import { createClient } from 'redis'

const url = process.env.REDIS_URL
const client = url ? createClient({ url }) : null
client?.on('error', (err) => {
  console.warn('Redis connection error:', err.message)
})

let isConnecting = false
async function ready(){ 
  if (!client) return false
  if (client.isOpen) return true
  if (isConnecting) return false
  
  try {
    isConnecting = true
    await client.connect()
    return true
  } catch (error) {
    console.warn('Failed to connect to Redis:', error instanceof Error ? error.message : 'Unknown error')
    return false
  } finally {
    isConnecting = false
  }
}

function k(prefix: string) {
  const d = new Date()
  const day = `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`
  return `m:${prefix}:${day}`
}

export async function incrRpc(chainId: number) {
  try {
    if (!(await ready()) || !client) return
    await client.hIncrBy(k('rpc'), String(chainId), 1)
  } catch (error) {
    console.warn('Failed to increment RPC counter:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function incrEmail() {
  try {
    if (!(await ready()) || !client) return
    await client.incr(k('email'))
  } catch (error) {
    console.warn('Failed to increment email counter:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function incrScan() {
  try {
    if (!(await ready()) || !client) return
    await client.incr(k('scan'))
  } catch (error) {
    console.warn('Failed to increment scan counter:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function readToday() {
  try {
    if (!(await ready()) || !client) return { rpc:{}, email:0, scan:0 }
    
    const [rpc, email, scan] = await Promise.all([
      client.hGetAll(k('rpc')),
      client.get(k('email')),
      client.get(k('scan')),
    ])
    
    const rpcNum: Record<string, number> = {}
    Object.entries(rpc || {}).forEach(([c, v]) => rpcNum[c] = Number(v))
    
    return { 
      rpc: rpcNum, 
      email: Number(email || 0), 
      scan: Number(scan || 0) 
    }
  } catch (error) {
    console.warn('Failed to read metrics:', error instanceof Error ? error.message : 'Unknown error')
    return { rpc:{}, email:0, scan:0 }
  }
}
