import { z } from 'zod';

// Base environment variables schema (development)
const baseEnvSchema = z.object({
  // Database
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Payment
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // AI Services
  GROQ_API_KEY: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Analytics
  ZIPY_ANALYTICS_ID: z.string().optional(),
  UMAMI_ANALYTICS_ID: z.string().optional(),
});

// Production environment variables schema (required fields)
const productionEnvSchema = z.object({
  // Database - Required in production
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // AI Services - Required in production
  GROQ_API_KEY: z.string().min(1),

  // Payment - Optional but validated if present
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),

  // Analytics
  ZIPY_ANALYTICS_ID: z.string().optional(),
  UMAMI_ANALYTICS_ID: z.string().optional(),
});

// Enhanced environment validation
let env: z.infer<typeof baseEnvSchema>;

try {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    // Use production schema with required fields
    env = productionEnvSchema.parse(process.env);
    console.log('✅ Production environment variables validated successfully');
  } else {
    // Use base schema with optional fields for development
    env = baseEnvSchema.parse(process.env);
    console.log('✅ Development environment variables validated');
  }
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    console.error('Missing or invalid environment variables:');

    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });

    console.error('\n🔧 To fix this issue:');
    console.error('1. Ensure your .env.local file exists with the required values');
    console.error('2. Required environment variables for production:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL: Get from Supabase dashboard');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Get from Supabase dashboard');
    console.error('   - GROQ_API_KEY: Get from https://console.groq.com/keys');
    console.error('3. Restart your application');

    // Don't use fallbacks in production - fail fast
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Required environment variables are missing in production');
    } else {
      // Provide fallbacks for development
      console.warn('\n⚠️  Using fallback values for development...');
      env = {
        ...process.env,
        NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      } as z.infer<typeof baseEnvSchema>;
    }
  } else {
    throw error;
  }
}

// Helper function to get config value with proper fallbacks
function getConfigValue<T>(
  value: T | undefined, 
  fallback: T, 
  fieldName?: string
): T {
  if (value !== undefined && value !== null && value !== '') {
    return value;
  }
  
  // In production, don't allow fallbacks for critical fields
  if (env.NODE_ENV === 'production' && fieldName) {
    const criticalFields = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
      'GROQ_API_KEY'
    ];
    
    if (criticalFields.includes(fieldName)) {
      throw new Error(`Critical environment variable ${fieldName} is missing in production`);
    }
  }
  
  return fallback;
}

export const config = {
  // Database
  database: {
    url: getConfigValue(
      env.NEXT_PUBLIC_SUPABASE_URL, 
      'https://placeholder.supabase.co',
      'NEXT_PUBLIC_SUPABASE_URL'
    ),
    anonKey: getConfigValue(
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 
      'placeholder-anon-key',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ),
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
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
      apiKey: getConfigValue(
        env.GROQ_API_KEY, 
        'placeholder-groq-key',
        'GROQ_API_KEY'
      ),
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
    zipyAnalyticsId: env.ZIPY_ANALYTICS_ID,
    umamiAnalyticsId: env.UMAMI_ANALYTICS_ID,
  },
} as const;

export type Config = typeof config;