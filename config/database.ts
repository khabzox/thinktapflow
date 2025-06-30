import { config } from './env';

export const databaseConfig = {
  url: config.database.url,
  anonKey: config.database.anonKey,
  serviceRoleKey: config.database.serviceRoleKey,
  
  // Connection settings
  options: {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': 'thinktapflow@1.0.0'
      }
    }
  },
  
  // Table names
  tables: {
    profiles: 'profiles',
    generations: 'generations',
    subscriptions: 'subscriptions',
    usage_tracking: 'usage_tracking',
    content_templates: 'content_templates',
    social_accounts: 'social_accounts'
  },
  
  // RLS policies
  policies: {
    enableRLS: true,
    userOwnedResources: true
  }
} as const;

export const cacheConfig = {
  // Redis configuration (if using Redis)
  redis: {
    url: process.env.REDIS_URL,
    ttl: {
      session: 60 * 60 * 24, // 24 hours
      userProfile: 60 * 30, // 30 minutes
      generations: 60 * 60 * 2, // 2 hours
      templates: 60 * 60 * 24, // 24 hours
    }
  },
  
  // In-memory cache configuration
  memory: {
    maxSize: 100, // Maximum number of items
    ttl: 60 * 10, // 10 minutes default TTL
  }
} as const;

export const rateLimitConfig = {
  // API rate limits
  api: {
    general: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    },
    generate: {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5,
    }
  },
  
  // User-based limits
  user: {
    contentGeneration: {
      freeUser: {
        daily: 5,
        monthly: 150
      },
      proUser: {
        daily: 50,
        monthly: 1500
      },
      enterpriseUser: {
        daily: 200,
        monthly: 6000
      }
    }
  }
} as const;
