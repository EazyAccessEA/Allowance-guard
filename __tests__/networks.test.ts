import { CHAINS, getSupportedChainIds, isSupportedChainId } from '../src/lib/networks'

describe('networks', () => {
  it('derives supported ids dynamically from CHAINS', () => {
    const ids = getSupportedChainIds(false)
    expect(ids.length).toBeGreaterThan(0)
    ids.forEach(id => expect(CHAINS[id]).toBeTruthy())
  })

  it('filters by enabled flag', () => {
    const all = getSupportedChainIds(false)
    const enabled = getSupportedChainIds(true)
    expect(enabled.length).toBeLessThanOrEqual(all.length)
  })

  it('type guard aligns with CHAINS keys', () => {
    const someId = Number(Object.keys(CHAINS)[0])
    expect(isSupportedChainId(someId)).toBe(true)
    expect(isSupportedChainId(999999)).toBe(false)
  })

  it('returns expected chain IDs for current configuration', () => {
    const enabled = getSupportedChainIds(true)
    expect(enabled).toContain(1) // Ethereum
    expect(enabled).toContain(42161) // Arbitrum
    expect(enabled).toContain(8453) // Base
    expect(enabled).toContain(10) // Optimism
    expect(enabled).toContain(137) // Polygon
    expect(enabled).toContain(43114) // Avalanche
    expect(enabled).toContain(56) // BSC
  })

  it('CHAINS object has expected structure', () => {
    Object.values(CHAINS).forEach(chain => {
      expect(chain).toHaveProperty('id')
      expect(chain).toHaveProperty('name')
      expect(chain).toHaveProperty('symbol')
      expect(chain).toHaveProperty('rpcs')
      expect(chain).toHaveProperty('explorer')
      expect(chain).toHaveProperty('enabled')
      expect(typeof chain.id).toBe('number')
      expect(typeof chain.name).toBe('string')
      expect(typeof chain.enabled).toBe('boolean')
    })
  })
})
