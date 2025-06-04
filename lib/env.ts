const requiredEnvVars = [
    // App
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_APP_NAME',

    // Supabase
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',

    // Google AI
    'GOOGLE_AI_API_KEY',
    'GOOGLE_AI_MODEL',

    // Paddle
    'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN',
    'PADDLE_SECRET_KEY',
    'PADDLE_WEBHOOK_SECRET',
] as const;

export function validateEnv() {
    const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables:\n${missingVars.map((v) => `- ${v}`).join('\n')}\n\nPlease check your .env file and ensure all required variables are set.`
        );
    }
}

// Optional: Add type-safe getters for environment variables
export const env = {
    app: {
        url: process.env.NEXT_PUBLIC_APP_URL as string,
        name: process.env.NEXT_PUBLIC_APP_NAME as string,
    },
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    },
    googleAI: {
        apiKey: process.env.GOOGLE_AI_API_KEY as string,
        model: process.env.GOOGLE_AI_MODEL as string,
    },
    groq: {
        apiKey: process.env.GROQ_API_KEY as string,
    },
    paddle: {
        clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN as string,
        secretKey: process.env.PADDLE_SECRET_KEY as string,
        webhookSecret: process.env.PADDLE_WEBHOOK_SECRET as string,
    },
    limits: {
        maxRequestsPerDay: parseInt(process.env.MAX_REQUESTS_PER_DAY || '50', 10),
        maxTokensPerRequest: parseInt(process.env.MAX_TOKENS_PER_REQUEST || '4000', 10),
    },
    features: {
        enableBlogGeneration: process.env.NEXT_PUBLIC_ENABLE_BLOG_GENERATION === 'true',
        enableSocialGeneration: process.env.NEXT_PUBLIC_ENABLE_SOCIAL_GENERATION === 'true',
    },
} as const;