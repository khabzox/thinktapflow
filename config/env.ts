import { z } from 'zod';

// Client-side environment variables schema (available in browser)
const clientEnvSchema = z.object({
  // Database (public)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Payment (public)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),

  // App (public)
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Analytics (public)
  // NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
});

// Server-side environment variables schema (server only)
const serverEnvSchema = z.object({
  // Database (server)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Authentication
  // NEXTAUTH_SECRET: z.string().min(1).optional(),
  // NEXTAUTH_URL: z.string().url().optional(),

  // Payment (server)
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // AI Services - GROQ is primary and required (server only)
  GROQ_API_KEY: z.string().min(1),
  // OPENAI_API_KEY: z.string().min(1).optional(),
  // ANTHROPIC_API_KEY: z.string().min(1).optional(),

  // Analytics (server)
  ZIPY_ANALYTICS_ID: z.string().optional(),
  UMAMI_ANALYTICS_ID: z.string().optional(),

  // Email
  // RESEND_API_KEY: z.string().optional(),
  // EMAIL_FROM: z.string().email().optional(),

  // Social Media APIs
  // TWITTER_API_KEY: z.string().optional(),
  // TWITTER_API_SECRET: z.string().optional(),
  // FACEBOOK_APP_ID: z.string().optional(),
  // FACEBOOK_APP_SECRET: z.string().optional(),
  // LINKEDIN_CLIENT_ID: z.string().optional(),
  // LINKEDIN_CLIENT_SECRET: z.string().optional(),
});

// Combined schema for server-side validation
const envSchema = clientEnvSchema.merge(serverEnvSchema);

// Enhanced environment validation with better error handling
let env: z.infer<typeof envSchema>;

// Determine if we're on the client side
const isClient = typeof window !== 'undefined';

try {
  if (isClient) {
    // Client-side: only validate public environment variables
    const clientEnv = clientEnvSchema.parse(process.env);
    env = {
      ...clientEnv,
      // Provide safe defaults for server-only variables on client
      GROQ_API_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      STRIPE_SECRET_KEY: undefined,
      STRIPE_WEBHOOK_SECRET: undefined,
      ZIPY_ANALYTICS_ID: undefined,
      UMAMI_ANALYTICS_ID: undefined,
    } as z.infer<typeof envSchema>;
  } else {
    // Server-side: validate all environment variables
    env = envSchema.parse(process.env);
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    console.error('Missing or invalid environment variables:');

    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });

    console.error('\n🔧 To fix this issue:');
    console.error('1. Copy example.env.local to .env.local');
    console.error('2. Fill in the required values:');
    
    if (!isClient) {
      console.error('   - NEXT_PUBLIC_SUPABASE_URL: Get from Supabase dashboard');
      console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Get from Supabase dashboard');
      console.error('   - GROQ_API_KEY: Get from https://console.groq.com/keys');
    }
    
    console.error('3. Restart your development server');

    // In development, provide fallback values to prevent complete failure
    if (process.env.NODE_ENV === 'development') {
      console.warn('\n⚠️  Using fallback values for development...');
      
      if (isClient) {
        env = {
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
          NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
          NODE_ENV: 'development' as const,
          // Server-only defaults
          GROQ_API_KEY: '',
          SUPABASE_SERVICE_ROLE_KEY: undefined,
          STRIPE_SECRET_KEY: undefined,
          STRIPE_WEBHOOK_SECRET: undefined,
          ZIPY_ANALYTICS_ID: undefined,
          UMAMI_ANALYTICS_ID: undefined,
        } as z.infer<typeof envSchema>;
      } else {
        env = {
          ...process.env,
          NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
          GROQ_API_KEY: process.env.GROQ_API_KEY || 'placeholder-groq-key',
          NODE_ENV: 'development' as const,
        } as z.infer<typeof envSchema>;
      }
    } else {
      throw error;
    }
  } else {
    throw error;
  }
}

export const config = {
  // Database
  database: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Authentication
  // auth: {
  //   secret: env.NEXTAUTH_SECRET,
  //   url: env.NEXTAUTH_URL,
  // },

  // Payment
  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },

  // AI Services (server-side only)
  ai: {
    groq: {
      apiKey: env.GROQ_API_KEY || '', // Safe fallback for client-side
    },
    // openai: {
    //   apiKey: env.OPENAI_API_KEY,
    // },
    // anthropic: {
    //   apiKey: env.ANTHROPIC_API_KEY,
    // },
  },

  // App
  app: {
    url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isClient: typeof window !== 'undefined',
  },

  // Analytics
  analytics: {
    // googleAnalyticsId: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    zipyAnalyticsId: env.ZIPY_ANALYTICS_ID,
    umamiAnalyticsId: env.UMAMI_ANALYTICS_ID,
  },

  // Email
  email: {
    // apiKey: env.RESEND_API_KEY,
    // from: env.EMAIL_FROM || 'noreply@thinktapflow.com',
  },

  // Social Media APIs
  social: {
    // twitter: {
    //   apiKey: env.TWITTER_API_KEY,
    //   apiSecret: env.TWITTER_API_SECRET,
    // },
    // facebook: {
    //   appId: env.FACEBOOK_APP_ID,
    //   appSecret: env.FACEBOOK_APP_SECRET,
    // },
    // linkedin: {
    //   clientId: env.LINKEDIN_CLIENT_ID,
    //   clientSecret: env.LINKEDIN_CLIENT_SECRET,
    // },
  },
} as const;

export type Config = typeof config;
export const getServerEnv = (key: keyof typeof env) => {
  if (typeof window !== 'undefined') {
    console.warn(`⚠️  Attempted to access server-only environment variable '${key}' on client side`);
    return undefined;
  }
  return env[key];
};

export const getClientEnv = (key: keyof typeof env) => {
  if (!key.startsWith('NEXT_PUBLIC_') && typeof window !== 'undefined') {
    console.warn(`⚠️  Environment variable '${key}' should be prefixed with NEXT_PUBLIC_ for client access`);
  }
  return env[key];
};

// Safe getters for commonly used environment variables
export const getGroqApiKey = () => getServerEnv('GROQ_API_KEY');
export const getSupabaseUrl = () => env.NEXT_PUBLIC_SUPABASE_URL;
export const getSupabaseAnonKey = () => env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
