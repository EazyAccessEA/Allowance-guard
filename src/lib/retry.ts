export async function withRetry<T>(fn: () => Promise<T>, opts: { tries?: number; baseMs?: number } = {}) {
  const { tries = 3, baseMs = 250 } = opts
  let last: unknown
  
  for (let i = 0; i < tries; i++) {
    try { 
      return await fn() 
    } catch (e: unknown) {
      last = e
      if (i < tries - 1) { // Don't wait after the last attempt
        await new Promise(r => setTimeout(r, baseMs * Math.pow(2, i)))
      }
    }
  }
  throw last
}

export function withTimeout<T>(p: Promise<T>, ms = 45_000): Promise<T> {
  return Promise.race([
    p, 
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
  ])
}
