import Rollbar from 'rollbar'

// Initialize Rollbar
const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: !!process.env.ROLLBAR_ACCESS_TOKEN,
})

// Client-side Rollbar (for browser)
export const rollbarClient = typeof window !== 'undefined' ? new Rollbar({
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN || '',
  environment: process.env.NODE_ENV || 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: !!process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN,
}) : null

export default rollbar

// Helper functions for common error reporting
export const reportError = (error: Error, context?: Record<string, unknown>) => {
  if (rollbar) {
    rollbar.error(error, context)
  } else {
    console.error('Error (Rollbar not configured):', error, context)
  }
}

export const reportWarning = (message: string, context?: Record<string, unknown>) => {
  if (rollbar) {
    rollbar.warning(message, context)
  } else {
    console.warn('Warning (Rollbar not configured):', message, context)
  }
}

export const reportInfo = (message: string, context?: Record<string, unknown>) => {
  if (rollbar) {
    rollbar.info(message, context)
  } else {
    console.info('Info (Rollbar not configured):', message, context)
  }
}
