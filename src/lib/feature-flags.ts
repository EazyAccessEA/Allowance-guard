// Feature Flags System - Safe Deployment Control
// This allows instant rollback of any feature without code changes

export interface FeatureFlags {
  // UX/UI Improvements
  enhancedMicroInteractions: boolean
  sophisticatedLoadingStates: boolean
  contextualErrorHandling: boolean
  delightfulSuccessFeedback: boolean
  progressiveOnboarding: boolean
  advancedGestureSupport: boolean
  smoothPageTransitions: boolean
  contextualHelpSystem: boolean
  
  // Gradual Rollout Controls
  enableNewUXForPercentage: number // 0-100, percentage of users to see new UX
  enableABTesting: boolean
  enableGradualRollout: boolean
  
  // Emergency Controls
  emergencyDisableAllNewFeatures: boolean
  forceLegacyUI: boolean
}

// Default feature flags - ALL DISABLED for safety
const defaultFlags: FeatureFlags = {
  // All new features disabled by default
  enhancedMicroInteractions: false,
  sophisticatedLoadingStates: false,
  contextualErrorHandling: false,
  delightfulSuccessFeedback: false,
  progressiveOnboarding: false,
  advancedGestureSupport: false,
  smoothPageTransitions: false,
  contextualHelpSystem: false,
  
  // Rollout controls
  enableNewUXForPercentage: 0, // Start with 0% rollout
  enableABTesting: false,
  enableGradualRollout: false,
  
  // Emergency controls
  emergencyDisableAllNewFeatures: false,
  forceLegacyUI: false,
}

// Get feature flags with environment variable overrides
export function getFeatureFlags(): FeatureFlags {
  // Check for emergency disable first
  if (process.env.EMERGENCY_DISABLE_NEW_FEATURES === 'true') {
    return {
      ...defaultFlags,
      emergencyDisableAllNewFeatures: true,
      forceLegacyUI: true,
    }
  }
  
  // Check for force legacy UI
  if (process.env.FORCE_LEGACY_UI === 'true') {
    return {
      ...defaultFlags,
      forceLegacyUI: true,
    }
  }
  
  // Environment variable overrides
  const flags: FeatureFlags = {
    enhancedMicroInteractions: process.env.ENABLE_MICRO_INTERACTIONS === 'true' || defaultFlags.enhancedMicroInteractions,
    sophisticatedLoadingStates: process.env.ENABLE_SOPHISTICATED_LOADING === 'true' || defaultFlags.sophisticatedLoadingStates,
    contextualErrorHandling: process.env.ENABLE_CONTEXTUAL_ERRORS === 'true' || defaultFlags.contextualErrorHandling,
    delightfulSuccessFeedback: process.env.ENABLE_SUCCESS_FEEDBACK === 'true' || defaultFlags.delightfulSuccessFeedback,
    progressiveOnboarding: process.env.ENABLE_ONBOARDING === 'true' || defaultFlags.progressiveOnboarding,
    advancedGestureSupport: process.env.ENABLE_GESTURES === 'true' || defaultFlags.advancedGestureSupport,
    smoothPageTransitions: process.env.ENABLE_PAGE_TRANSITIONS === 'true' || defaultFlags.smoothPageTransitions,
    contextualHelpSystem: process.env.ENABLE_CONTEXTUAL_HELP === 'true' || defaultFlags.contextualHelpSystem,
    
    enableNewUXForPercentage: parseInt(process.env.NEW_UX_PERCENTAGE || '0'),
    enableABTesting: process.env.ENABLE_AB_TESTING === 'true',
    enableGradualRollout: process.env.ENABLE_GRADUAL_ROLLOUT === 'true',
    
    emergencyDisableAllNewFeatures: process.env.EMERGENCY_DISABLE === 'true' || defaultFlags.emergencyDisableAllNewFeatures,
    forceLegacyUI: process.env.FORCE_LEGACY_UI === 'true' || defaultFlags.forceLegacyUI,
  }
  
  return flags
}

// Check if user should see new UX based on gradual rollout
export function shouldShowNewUX(userId?: string): boolean {
  const flags = getFeatureFlags()
  
  // Emergency disable
  if (flags.emergencyDisableAllNewFeatures || flags.forceLegacyUI) {
    return false
  }
  
  // If gradual rollout is disabled, use feature flags
  if (!flags.enableGradualRollout) {
    return true // Let individual feature flags control
  }
  
  // Gradual rollout logic
  if (!userId) {
    return Math.random() * 100 < flags.enableNewUXForPercentage
  }
  
  // Consistent user experience - hash userId for consistent rollout
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return Math.abs(hash) % 100 < flags.enableNewUXForPercentage
}

// Individual feature checks
export function isFeatureEnabled(feature: keyof Omit<FeatureFlags, 'enableNewUXForPercentage' | 'enableABTesting' | 'enableGradualRollout' | 'emergencyDisableAllNewFeatures' | 'forceLegacyUI'>): boolean {
  const flags = getFeatureFlags()
  
  // Emergency disable overrides everything
  if (flags.emergencyDisableAllNewFeatures || flags.forceLegacyUI) {
    return false
  }
  
  return flags[feature]
}

// Rollback helper - instantly disable all new features
export function emergencyRollback(): FeatureFlags {
  return {
    ...defaultFlags,
    emergencyDisableAllNewFeatures: true,
    forceLegacyUI: true,
  }
}

// Gradual rollout helper - increase percentage safely
export function increaseRolloutPercentage(currentPercentage: number, increment: number = 10): number {
  return Math.min(100, currentPercentage + increment)
}
