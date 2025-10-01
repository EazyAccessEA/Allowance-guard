// Core donation helper using wagmi/viem
import { parseEther } from 'viem'
import { useSendTransaction, useAccount } from 'wagmi'
import { getDonationAddress } from '@/config/donations'

export interface DonationResult {
  success: boolean
  hash?: string
  error?: string
}

/**
 * Hook for donating native ETH to the configured donation address
 */
export function useDonateNative() {
  const { address, isConnected } = useAccount()
  const { sendTransactionAsync, isPending, error } = useSendTransaction()

  const donateNative = async (amountEth: string): Promise<DonationResult> => {
    try {
      // Check if wallet is connected
      if (!isConnected || !address) {
        return {
          success: false,
          error: 'Please connect your wallet first'
        }
      }

      // Get donation address
      const donationAddress = getDonationAddress()
      if (!donationAddress) {
        return {
          success: false,
          error: 'Donation address not configured. Please contact support.'
        }
      }

      // Validate amount
      const amount = parseFloat(amountEth)
      if (isNaN(amount) || amount <= 0) {
        return {
          success: false,
          error: 'Please enter a valid donation amount'
        }
      }

      // Parse ETH amount to wei
      const value = parseEther(amountEth)

      // Send transaction
      const hash = await sendTransactionAsync({
        to: donationAddress,
        value: value,
        data: '0x' // Empty data for simple ETH transfer
      })

      return {
        success: true,
        hash: hash
      }
    } catch (err) {
      console.error('Donation error:', err)
      
      // Handle specific error cases
      let errorMessage = 'Donation failed. Please try again.'
      
      if (err instanceof Error) {
        if (err.message.includes('User rejected')) {
          errorMessage = 'Transaction cancelled by user'
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient ETH balance for donation'
        } else if (err.message.includes('gas')) {
          errorMessage = 'Transaction failed due to gas issues'
        }
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  return {
    donateNative,
    isPending,
    error: error?.message
  }
}

/**
 * Utility function to format donation amount for display
 */
export function formatDonationAmount(amount: string): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  // Format with appropriate decimal places
  if (num >= 1) {
    return num.toFixed(2)
  } else if (num >= 0.01) {
    return num.toFixed(4)
  } else {
    return num.toFixed(6)
  }
}

/**
 * Get preset donation amounts in ETH
 */
export const DONATION_PRESETS = {
  small: '0.001',    // ~$3
  medium: '0.005',    // ~$15
  large: '0.01',      // ~$30
  generous: '0.05'    // ~$150
} as const

export type DonationPreset = keyof typeof DONATION_PRESETS
