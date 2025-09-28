/**
 * Ethereum address normalization utilities
 * Centralized helper for consistent address handling across the application
 */

/**
 * Normalizes an Ethereum address to lowercase format
 * @param addr - The address to normalize
 * @returns Normalized address in lowercase, or original if invalid/empty
 */
export const normalizeAddress = (addr: string): string => {
  if (!addr) return addr
  return addr.trim().toLowerCase()
}

/**
 * Validates and normalizes an Ethereum address
 * @param addr - The address to validate and normalize
 * @returns Normalized address if valid, throws error if invalid
 */
export const validateAndNormalizeAddress = (addr: string): string => {
  const normalized = normalizeAddress(addr)
  
  if (!normalized.match(/^0x[a-f0-9]{40}$/)) {
    throw new Error(`Invalid Ethereum address format: ${addr}`)
  }
  
  return normalized
}

/**
 * Checks if an address is in the correct normalized format
 * @param addr - The address to check
 * @returns True if the address is properly normalized
 */
export const isNormalizedAddress = (addr: string): boolean => {
  return addr === normalizeAddress(addr) && addr.match(/^0x[a-f0-9]{40}$/) !== null
}
