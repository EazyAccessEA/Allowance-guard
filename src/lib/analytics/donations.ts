// Donation analytics events
// Note: auditUserAction is server-side only, so we'll handle analytics differently for client components

export interface DonationAnalyticsEvent {
  event: string
  amount?: string
  currency?: string
  method?: 'native' | 'giveth' | 'gitcoin'
  success?: boolean
  error?: string
  walletAddress?: string
}

/**
 * Track donation analytics events
 * Uses existing audit system for consistency
 */
export async function trackDonationEvent(
  event: DonationAnalyticsEvent,
  request?: Request
): Promise<void> {
  try {
    // Only track in production or when explicitly enabled
    if (process.env.NODE_ENV !== 'production' && process.env.ENABLE_ANALYTICS !== 'true') {
      return
    }

    // Map donation events to audit actions
    const auditAction = `donation.${event.event}`
    const auditMeta = {
      amount: event.amount,
      currency: event.currency || 'ETH',
      method: event.method,
      success: event.success,
      error: event.error,
      timestamp: new Date().toISOString()
    }

    // For now, just log the event - server-side tracking will be handled in API routes
    console.log('Donation Analytics Event:', auditAction, auditMeta)

    // Also log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Donation Analytics:', event)
    }

  } catch (error) {
    // Don't break the donation flow if analytics fails
    console.warn('Analytics tracking failed:', error)
  }
}

/**
 * Convenience functions for common donation events
 */
export const donationAnalytics = {
  pageView: (request?: Request) => 
    trackDonationEvent({ event: 'page_view' }, request),

  copyAddress: (request?: Request) => 
    trackDonationEvent({ event: 'copy_address' }, request),

  copyEIP681: (request?: Request) => 
    trackDonationEvent({ event: 'copy_eip681' }, request),

  submitStarted: (amount: string, method: 'native' | 'giveth' | 'gitcoin', walletAddress?: string, request?: Request) => 
    trackDonationEvent({ 
      event: 'submit_started', 
      amount, 
      method, 
      walletAddress 
    }, request),

  submitSuccess: (amount: string, method: 'native' | 'giveth' | 'gitcoin', walletAddress?: string, request?: Request) => 
    trackDonationEvent({ 
      event: 'submit_success', 
      amount, 
      method, 
      success: true,
      walletAddress 
    }, request),

  submitFailed: (amount: string, method: 'native' | 'giveth' | 'gitcoin', error: string, walletAddress?: string, request?: Request) => 
    trackDonationEvent({ 
      event: 'submit_failed', 
      amount, 
      method, 
      success: false,
      error,
      walletAddress 
    }, request),

  tipEnabled: (amount: string, request?: Request) => 
    trackDonationEvent({ 
      event: 'tip_enabled', 
      amount, 
      method: 'native' 
    }, request),

  tipDisabled: (request?: Request) => 
    trackDonationEvent({ 
      event: 'tip_disabled' 
    }, request),

  externalLinkClick: (platform: 'giveth' | 'gitcoin', request?: Request) => 
    trackDonationEvent({ 
      event: 'external_link_click', 
      method: platform 
    }, request)
}

/**
 * Hook for client-side donation analytics
 */
export function useDonationAnalytics() {
  const trackEvent = (event: DonationAnalyticsEvent) => {
    // Client-side tracking (no-op for now, could integrate with Google Analytics, etc.)
    if (process.env.NODE_ENV === 'development') {
      console.log('Client Donation Analytics:', event)
    }
  }

  return {
    trackEvent,
    ...donationAnalytics
  }
}
