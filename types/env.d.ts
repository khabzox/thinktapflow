declare namespace NodeJS {
  interface ProcessEnv {
    // App
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;

    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // Google AI
    GOOGLE_AI_API_KEY: string;
    GOOGLE_AI_MODEL: string;

    // Groq AI
    GROQ_API_KEY: string;

    // Paddle
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: string;
    PADDLE_SECRET_KEY: string;
    PADDLE_WEBHOOK_SECRET: string;

    // Rate Limiting & Usage
    MAX_REQUESTS_PER_DAY: string;
    MAX_TOKENS_PER_REQUEST: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_BLOG_GENERATION: string;
    NEXT_PUBLIC_ENABLE_SOCIAL_GENERATION: string;
  }
} 