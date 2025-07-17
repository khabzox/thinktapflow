// Re-export all constants for easy imports
export * from "./platforms";
export * from "./subscriptions";
export * from "./routes";
export * from "./ui";
export * from "./templates";
export * from "./api";
export * from "./ai";

// Application-wide constants
export const APP_CONFIG = {
  NAME: "ThinkTapFlow",
  DESCRIPTION: "AI-powered content generation for social media",
  VERSION: "1.0.0",
  AUTHOR: "ThinkTapFlow Team",
  URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Feature flags
  FEATURES: {
    ANALYTICS: true,
    CHAT_SUPPORT: true,
    TEAM_COLLABORATION: true,
    API_ACCESS: true,
    CUSTOM_TEMPLATES: true,
    CONTENT_CALENDAR: true,
  },

  // Environment
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",

  // External services
  SERVICES: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM dd",
  MEDIUM: "MMM dd, yyyy",
  LONG: "MMMM dd, yyyy",
  TIME: "HH:mm",
  DATETIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
} as const;

export const FILE_TYPES = {
  IMAGES: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  DOCUMENTS: [".pdf", ".doc", ".docx", ".txt", ".md"],
  VIDEOS: [".mp4", ".mov", ".avi", ".mkv"],
  AUDIO: [".mp3", ".wav", ".ogg", ".m4a"],
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  CONTENT: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 10000,
  },
} as const;
