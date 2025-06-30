export const ROUTES = {
  // Public routes
  HOME: '/',
  PRICING: '/pricing',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify-email',
    CALLBACK: '/auth/callback'
  },
  
  // Dashboard routes
  DASHBOARD: {
    HOME: '/dashboard',
    GENERATE: '/dashboard/generate',
    GENERATIONS: '/dashboard/generations',
    ANALYTICS: '/dashboard/analytics',
    ASSISTANT: '/dashboard/assistant',
    BILLING: '/dashboard/billing',
    CALENDAR: '/dashboard/calendar',
    COMMUNITY: '/dashboard/community',
    HISTORY: '/dashboard/history',
    INPUT: '/dashboard/input',
    LIBRARY: '/dashboard/library',
    RESULT: '/dashboard/result',
    SETTINGS: '/dashboard/settings',
    TEMPLATES: '/dashboard/templates',
    WORKSPACE: '/dashboard/workspace',
    
    // Admin routes
    ADMIN: {
      HOME: '/dashboard/admin',
      USERS: '/dashboard/admin/users',
      ANALYTICS: '/dashboard/admin/analytics',
      SETTINGS: '/dashboard/admin/settings'
    }
  },
  
  // API routes
  API: {
    ADMIN: '/api/admin',
    EXTRACT_CONTENT: '/api/extract-content',
    GENERATE: '/api/generate',
    GENERATIONS: '/api/generations',
    SUBSCRIPTION: '/api/subscription',
    USAGE: '/api/usage',
    WEBHOOKS: '/api/webhooks'
  }
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRICING,
  ROUTES.PRIVACY_POLICY,
  ROUTES.TERMS_OF_SERVICE,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.VERIFY_EMAIL,
  ROUTES.AUTH.CALLBACK
] as const;

export const PROTECTED_ROUTES = [
  '/dashboard'
] as const;

export const ADMIN_ROUTES = [
  ROUTES.DASHBOARD.ADMIN.HOME,
  ROUTES.DASHBOARD.ADMIN.USERS,
  ROUTES.DASHBOARD.ADMIN.ANALYTICS,
  ROUTES.DASHBOARD.ADMIN.SETTINGS
] as const;
