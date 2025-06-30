import { z } from 'zod';

// Environment variables schema
const envSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Payment
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  
  // AI Services - GROQ is primary and required
  GROQ_API_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Analytics
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
  
  // Email
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Social Media APIs
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
});

// Enhanced environment validation with better error handling
let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
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
    console.error('   - NEXT_PUBLIC_SUPABASE_URL: Get from Supabase dashboard');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Get from Supabase dashboard');
    console.error('   - GROQ_API_KEY: Get from https://console.groq.com/keys');
    console.error('3. Restart your development server');
    
    // In development, provide fallback values to prevent complete failure
    if (process.env.NODE_ENV === 'development') {
      console.warn('\n⚠️  Using fallback values for development...');
      env = {
        ...process.env,
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
        GROQ_API_KEY: process.env.GROQ_API_KEY || 'placeholder-groq-key',
        NODE_ENV: 'development' as const,
      } as z.infer<typeof envSchema>;
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
  auth: {
    secret: env.NEXTAUTH_SECRET,
    url: env.NEXTAUTH_URL,
  },
  
  // Payment
  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
  
  // AI Services
  ai: {
    groq: {
      apiKey: env.GROQ_API_KEY,
    },
    openai: {
      apiKey: env.OPENAI_API_KEY,
    },
    anthropic: {
      apiKey: env.ANTHROPIC_API_KEY,
    },
  },
  
  // App
  app: {
    url: env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  
  // Email
  email: {
    apiKey: env.RESEND_API_KEY,
    from: env.EMAIL_FROM || 'noreply@thinktapflow.com',
  },
  
  // Social Media APIs
  social: {
    twitter: {
      apiKey: env.TWITTER_API_KEY,
      apiSecret: env.TWITTER_API_SECRET,
    },
    facebook: {
      appId: env.FACEBOOK_APP_ID,
      appSecret: env.FACEBOOK_APP_SECRET,
    },
    linkedin: {
      clientId: env.LINKEDIN_CLIENT_ID,
      clientSecret: env.LINKEDIN_CLIENT_SECRET,
    },
  },
} as const;

export type Config = typeof config;
