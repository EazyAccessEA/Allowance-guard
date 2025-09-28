import { CHAINS } from '../src/lib/networks'

describe('planned chains are present', () => {
  const planned = [10, 137, 43114, 56]
  it('includes all planned chains in CHAINS map', () => {
    planned.forEach(id => {
      expect(CHAINS[id]).toBeTruthy()
      expect(CHAINS[id].explorer).toBeTruthy()
      expect(CHAINS[id].rpcs?.length).toBeGreaterThan(0)
    })
  })

  it('has correct chain names and symbols', () => {
    expect(CHAINS[10].name).toBe('Optimism')
    expect(CHAINS[10].symbol).toBe('ETH')
    expect(CHAINS[137].name).toBe('Polygon')
    expect(CHAINS[137].symbol).toBe('MATIC')
    expect(CHAINS[43114].name).toBe('Avalanche')
    expect(CHAINS[43114].symbol).toBe('AVAX')
    expect(CHAINS[56].name).toBe('BNB Smart Chain')
    expect(CHAINS[56].symbol).toBe('BNB')
  })

  it('has valid explorer URLs', () => {
    expect(CHAINS[10].explorer).toBe('https://optimistic.etherscan.io')
    expect(CHAINS[137].explorer).toBe('https://polygonscan.com')
    expect(CHAINS[43114].explorer).toBe('https://snowtrace.io')
    expect(CHAINS[56].explorer).toBe('https://bscscan.com')
  })
})
