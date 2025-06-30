export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify'
  },
  
  // Content Generation
  GENERATE: '/api/generate',
  GENERATIONS: '/api/generations',
  EXTRACT_CONTENT: '/api/extract-content',
  
  // User Management
  USER: {
    PROFILE: '/api/user/profile',
    SETTINGS: '/api/user/settings',
    USAGE: '/api/usage'
  },
  
  // Subscription
  SUBSCRIPTION: {
    CREATE: '/api/subscription/create',
    UPDATE: '/api/subscription/update',
    CANCEL: '/api/subscription/cancel',
    WEBHOOK: '/api/webhooks/stripe'
  },
  
  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    ANALYTICS: '/api/admin/analytics',
    SYSTEM: '/api/admin/system'
  }
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

export const API_LIMITS = {
  REQUEST_TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  MAX_CONTENT_LENGTH: 10000, // 10KB
  MAX_BATCH_SIZE: 10
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please try again later.',
  VALIDATION_ERROR: 'Invalid input data.',
  UNAUTHORIZED_ERROR: 'Please log in to continue.',
  FORBIDDEN_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND_ERROR: 'The requested resource was not found.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again.',
  MAINTENANCE_ERROR: 'The service is temporarily unavailable for maintenance.'
} as const;
