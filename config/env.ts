import { z } from 'zod';

// Client-side environment variables schema (available in browser)
const clientEnvSchema = z.object({
  // Database (public) - required in production
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1, 'Supabase URL is required'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

  // Payment (public)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // App (public)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Development client schema (more lenient)
const clientEnvSchemaDev = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Server-side environment variables schema (server only)
const serverEnvSchema = z.object({
  // Database (server)
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // AI Services - GROQ is primary, required in production
  GROQ_API_KEY: z.string().min(1, 'GROQ API key is required'),

  // Payment (server)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Analytics (server)
  ZIPY_ANALYTICS_ID: z.string().optional(),
  UMAMI_ANALYTICS_ID: z.string().optional(),
});

// Development server schema (more lenient)
const serverEnvSchemaDev = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ZIPY_ANALYTICS_ID: z.string().optional(),
  UMAMI_ANALYTICS_ID: z.string().optional(),
});

// Determine if we're on the client side
const isClient = typeof window !== 'undefined';
const isDevelopment = process.env.NODE_ENV === 'development';

// Environment variable loader with better error handling
const loadEnvironmentVariables = () => {
  const env = {
    // Public variables (client + server) with fallbacks
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      (isDevelopment ? 'https://placeholder.supabase.co' : ''),
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (isDevelopment ? 'placeholder-anon-key' : ''),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || (isDevelopment ? 'http://localhost:3000' : ''),
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',

    // Server-only variables
    GROQ_API_KEY: isClient ? '' : process.env.GROQ_API_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: isClient ? undefined : process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET_KEY: isClient ? undefined : process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: isClient ? undefined : process.env.STRIPE_WEBHOOK_SECRET,
    ZIPY_ANALYTICS_ID: isClient ? undefined : process.env.ZIPY_ANALYTICS_ID,
    UMAMI_ANALYTICS_ID: isClient ? undefined : process.env.UMAMI_ANALYTICS_ID,
  };

  return env;
};

// Load environment variables
const env = loadEnvironmentVariables();

export const config = {
  // Database
  database: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Payment
  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },

  // AI Services (server-side only)
  ai: {
    groq: {
      apiKey: env.GROQ_API_KEY,
    },
  },

  // App
  app: {
    url: env.NEXT_PUBLIC_APP_URL,
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isClient: typeof window !== 'undefined',
  },

  // Analytics
  analytics: {
    zipyAnalyticsId: env.ZIPY_ANALYTICS_ID,
    umamiAnalyticsId: env.UMAMI_ANALYTICS_ID,
  },
} as const;

export type Config = typeof config;

// Environment validation function
export const validateEnvironment = () => {
  try {
    if (isClient) {
      // Use more lenient schema in development
      const schema = isDevelopment ? clientEnvSchemaDev : clientEnvSchema;
      const result = schema.safeParse(process.env);

      if (!result.success) {
        if (isDevelopment) {
          console.warn(
            '⚠️ Client environment validation warnings (development):',
            result.error.issues
          );
        } else {
          console.error('❌ Client environment validation failed:', result.error.issues);
        }
      }
      return result;
    } else {
      // Use more lenient schema in development
      const clientSchema = isDevelopment ? clientEnvSchemaDev : clientEnvSchema;
      const serverSchema = isDevelopment ? serverEnvSchemaDev : serverEnvSchema;
      const combinedSchema = clientSchema.merge(serverSchema);

      const result = combinedSchema.safeParse(process.env);

      if (!result.success) {
        if (isDevelopment) {
          console.warn(
            '⚠️ Server environment validation warnings (development):',
            result.error.issues
          );
        } else {
          console.error('❌ Server environment validation failed:', result.error.issues);
        }
      }
      return result;
    }
  } catch (error) {
    console.warn('Environment validation skipped:', error);
    return { success: true, data: process.env };
  }
};

// Helper to check if critical environment variables are available
export const isCriticalEnvAvailable = () => {
  try {
    if (isClient) {
      const hasSupabase = !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      return hasSupabase || isDevelopment; // Allow missing in development
    } else {
      const hasSupabase = !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const hasGroq = !!env.GROQ_API_KEY;
      return (hasSupabase && hasGroq) || isDevelopment; // Allow missing in development
    }
  } catch {
    return isDevelopment; // Fail gracefully in development
  }
};

// Enhanced server environment getter with better error handling
export const getServerEnv = (key: keyof typeof env) => {
  if (typeof window !== 'undefined') {
    console.warn(`⚠️ Attempted to access server-only environment variable '${key}' on client side`);
    return undefined;
  }

  const value = env[key];

  // In production, warn about missing critical variables
  if (!isDevelopment && !value && ['GROQ_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY'].includes(key)) {
    console.warn(`⚠️ Critical server environment variable '${key}' is missing`);
  }

  return value;
};

export const getClientEnv = (key: keyof typeof env) => {
  if (!key.toString().startsWith('NEXT_PUBLIC_') && typeof window !== 'undefined') {
    console.warn(
      `⚠️ Environment variable '${key}' should be prefixed with NEXT_PUBLIC_ for client access`
    );
  }

  const value = env[key];

  // In production, warn about missing critical public variables
  if (
    !isDevelopment &&
    !value &&
    ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].includes(key.toString())
  ) {
    console.warn(`⚠️ Critical client environment variable '${key}' is missing`);
  }

  return value;
};

// Safe getters for commonly used environment variables
export const getGroqApiKey = () => {
  const key = getServerEnv('GROQ_API_KEY');
  if (!key && !isDevelopment) {
    throw new Error('GROQ_API_KEY is required but not found in environment variables');
  }
  return key;
};

export const getSupabaseUrl = () => {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url && !isDevelopment) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required but not found in environment variables');
  }
  return url;
};

export const getSupabaseAnonKey = () => {
  const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!key && !isDevelopment) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not found in environment variables'
    );
  }
  return key;
};

// Utility function to check and display current environment status
export const debugEnvironment = () => {
  if (isDevelopment) {
    console.log('🔧 Environment Debug Info:');
    console.log('- NODE_ENV:', env.NODE_ENV);
    console.log('- Is Client:', isClient);
    console.log(
      '- NEXT_PUBLIC_SUPABASE_URL:',
      env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'
    );
    console.log(
      '- NEXT_PUBLIC_SUPABASE_ANON_KEY:',
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
    );

    if (!isClient) {
      console.log('- GROQ_API_KEY:', env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
      console.log(
        '- SUPABASE_SERVICE_ROLE_KEY:',
        env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'
      );
    }

    const validation = validateEnvironment();
    console.log('- Validation Status:', validation.success ? '✅ Passed' : '❌ Failed');
    console.log('- Critical Env Available:', isCriticalEnvAvailable() ? '✅ Yes' : '❌ No');
  }
};
