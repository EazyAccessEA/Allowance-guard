// Donation configuration and helpers
import { isAddress } from 'viem'

// ENS name for donations (like revoke.kalis.eth)
export const DONATION_ENS = process.env.NEXT_PUBLIC_DONATION_ENS || 'allowanceguard.eth'

// Fallback donation address if ENS not configured
export const DONATION_ADDRESS = process.env.NEXT_PUBLIC_DONATION_ADDRESS || ''

// External donation platform links
export const EXTERNAL_DONATION_LINKS = {
  giveth: process.env.NEXT_PUBLIC_DONATION_LINK_GIVETH || '',
  gitcoin: process.env.NEXT_PUBLIC_DONATION_LINK_GITCOIN || ''
}

// Feature flag for tip flow in batch revoke
export const ENABLE_TIP_FLOW = process.env.NEXT_PUBLIC_ENABLE_TIP_FLOW === 'true'

/**
 * Get the donation address, validating and normalizing it
 * Returns null if no valid address is configured
 */
export function getDonationAddress(chainId?: number): `0x${string}` | null {
  if (!DONATION_ADDRESS) {
    return null
  }

  try {
    // Validate the address format
    if (!isAddress(DONATION_ADDRESS)) {
      console.warn('Invalid donation address format:', DONATION_ADDRESS)
      return null
    }

    // Return lowercased checksummed address
    return DONATION_ADDRESS.toLowerCase() as `0x${string}`
  } catch (error) {
    console.error('Error validating donation address:', error)
    return null
  }
}

/**
 * Check if donation system is properly configured
 */
export function isDonationConfigured(): boolean {
  return getDonationAddress() !== null
}

/**
 * Get EIP-681 link for direct wallet interaction
 */
export function getDonationEIP681Link(amount?: string): string | null {
  const address = getDonationAddress()
  if (!address) return null

  const baseLink = `ethereum:${address}`
  if (amount) {
    return `${baseLink}?value=${amount}`
  }
  return baseLink
}
