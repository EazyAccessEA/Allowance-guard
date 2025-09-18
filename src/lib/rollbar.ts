// Official Rollbar SDK integration for Next.js
// Documentation: https://docs.rollbar.com/docs/react

import Rollbar from 'rollbar'
import { rollbarServerConfig, rollbarClientConfig } from './rollbar-config'

// Server-side Rollbar instance (for API routes and server-side code)
const rollbar = new Rollbar({
  ...rollbarServerConfig,
  enabled: !!process.env.ROLLBAR_ACCESS_TOKEN && process.env.ROLLBAR_ACCESS_TOKEN !== 'YOUR_SERVER_ACCESS_TOKEN_HERE',
})

// Client-side Rollbar instance (for browser/React components)
export const rollbarClient = typeof window !== 'undefined' ? new Rollbar({
  ...rollbarClientConfig,
  enabled: !!process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN && process.env.NEXT_PUBLIC_ROLLBAR_ACCESS_TOKEN !== 'YOUR_CLIENT_ACCESS_TOKEN_HERE',
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

// Client-side helper functions
export const reportClientError = (error: Error, context?: Record<string, unknown>) => {
  if (rollbarClient) {
    rollbarClient.error(error, context)
  } else {
    console.error('Client Error (Rollbar not configured):', error, context)
  }
}

export const reportClientWarning = (message: string, context?: Record<string, unknown>) => {
  if (rollbarClient) {
    rollbarClient.warning(message, context)
  } else {
    console.warn('Client Warning (Rollbar not configured):', message, context)
  }
}

export const reportClientInfo = (message: string, context?: Record<string, unknown>) => {
  if (rollbarClient) {
    rollbarClient.info(message, context)
  } else {
    console.info('Client Info (Rollbar not configured):', message, context)
  }
}
