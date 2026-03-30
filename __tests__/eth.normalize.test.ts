import { describe, it, expect } from '@jest/globals'
import { normalizeAddress, validateAndNormalizeAddress, isNormalizedAddress } from '../src/lib/eth/normalize'

describe('Ethereum address normalization', () => {
  describe('normalizeAddress', () => {
    it('normalizes addresses to lowercase', () => {
      expect(normalizeAddress('0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD')).toBe('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
      expect(normalizeAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe('0x1234567890abcdef1234567890abcdef12345678')
    })

    it('trims whitespace', () => {
      expect(normalizeAddress('  0xabcdefabcdefabcdefabcdefabcdefabcdefabcd  ')).toBe('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
    })

    it('handles empty and null inputs', () => {
      expect(normalizeAddress('')).toBe('')
      expect(normalizeAddress(null as any)).toBe(null)
      expect(normalizeAddress(undefined as any)).toBe(undefined)
    })
  })

  describe('validateAndNormalizeAddress', () => {
    it('validates and normalizes valid addresses', () => {
      expect(validateAndNormalizeAddress('0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD')).toBe('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')
    })

    it('throws error for invalid addresses', () => {
      expect(() => validateAndNormalizeAddress('invalid')).toThrow('Invalid Ethereum address format')
      expect(() => validateAndNormalizeAddress('0x123')).toThrow('Invalid Ethereum address format')
      expect(() => validateAndNormalizeAddress('0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCDG')).toThrow('Invalid Ethereum address format')
    })
  })

  describe('isNormalizedAddress', () => {
    it('returns true for properly normalized addresses', () => {
      expect(isNormalizedAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')).toBe(true)
      expect(isNormalizedAddress('0x1234567890abcdef1234567890abcdef12345678')).toBe(true)
    })

    it('returns false for non-normalized addresses', () => {
      expect(isNormalizedAddress('0xABCDEFabcdefABCDEFabcdefABCDEFabcdefABCD')).toBe(false)
      expect(isNormalizedAddress('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd ')).toBe(false)
      expect(isNormalizedAddress('invalid')).toBe(false)
    })
  })
})
