/**
 * AI Constants - Groq as Default Provider
 *
 * All AI-related constants with Groq locked as the primary provider
 */

// Default AI Provider - LOCKED TO GROQ
export const DEFAULT_AI_PROVIDER = "groq" as const;

// AI Provider Types
export const AI_PROVIDERS = {
  GROQ: "groq",
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

// Groq Model Configuration (Primary)
export const GROQ_MODELS = {
  FAST: "llama3-8b-8192",
  BALANCED: "llama3-70b-8192",
  ADVANCED: "mixtral-8x7b-32768",
  ULTRA: "llama-3.1-70b-versatile",
} as const;

// Model Mapping for Application
export const AI_MODELS = {
  FAST: GROQ_MODELS.FAST,
  BALANCED: GROQ_MODELS.BALANCED,
  ADVANCED: GROQ_MODELS.ADVANCED,
  ULTRA: GROQ_MODELS.ULTRA,
} as const;

// Content Generation Tones
export const AI_TONES = {
  PROFESSIONAL: "professional",
  CASUAL: "casual",
  MARKETING: "marketing",
  FRIENDLY: "friendly",
  FORMAL: "formal",
  CREATIVE: "creative",
  HUMOROUS: "humorous",
} as const;

// Content Types
export const CONTENT_TYPES = {
  POST: "post",
  THREAD: "thread",
  STORY: "video",
  ARTICLE: "article",
  CAPTION: "caption",
  DESCRIPTION: "description",
} as const;

// AI Generation Limits (Groq-optimized)
export const AI_LIMITS = {
  MAX_TOKENS: 8192,
  MAX_INPUT_LENGTH: 32000,
  MAX_OUTPUT_LENGTH: 4000,
  MIN_CONTENT_LENGTH: 10,
  MAX_PLATFORMS: 10,
  MAX_VARIATIONS: 5,
  TIMEOUT_MS: 30000,
} as const;

// AI Generation Defaults (Groq-optimized)
export const AI_DEFAULTS = {
  TEMPERATURE: 0.7,
  TOP_P: 1.0,
  FREQUENCY_PENALTY: 0.0,
  PRESENCE_PENALTY: 0.0,
  STREAM: true,
  MODEL: AI_MODELS.BALANCED,
} as const;

// Error Messages
export const AI_ERRORS = {
  PROVIDER_UNAVAILABLE: "Groq AI service is currently unavailable",
  INVALID_INPUT: "Invalid input provided for AI generation",
  TOKEN_LIMIT_EXCEEDED: "Content exceeds token limit",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded. Please try again later",
  AUTHENTICATION_FAILED: "AI service authentication failed",
  GENERATION_FAILED: "Content generation failed",
  TIMEOUT: "AI generation request timed out",
  UNKNOWN_ERROR: "An unknown error occurred during AI generation",
} as const;

// Quality Thresholds
export const QUALITY_THRESHOLDS = {
  MIN_WORD_COUNT: 5,
  MAX_WORD_COUNT: 2000,
  MIN_SENTENCE_COUNT: 1,
  MAX_HASHTAG_COUNT: 30,
  MAX_EMOJI_COUNT: 10,
} as const;

// Platform-specific limits
export const PLATFORM_LIMITS = {
  TWITTER: { maxLength: 280, hashtagLimit: 10 },
  INSTAGRAM: { maxLength: 2200, hashtagLimit: 30 },
  LINKEDIN: { maxLength: 3000, hashtagLimit: 10 },
  FACEBOOK: { maxLength: 63206, hashtagLimit: 20 },
  TIKTOK: { maxLength: 150, hashtagLimit: 10 },
  YOUTUBE: { maxLength: 5000, hashtagLimit: 15 },
  THREADS: { maxLength: 500, hashtagLimit: 10 },
} as const;

// System Prompts for Different Content Types
export const SYSTEM_PROMPTS = {
  SOCIAL_POST: "You are an expert social media content creator specializing in engaging posts.",
  THREAD: "You are an expert at creating engaging social media threads that tell stories.",
  MARKETING:
    "You are a professional marketing copywriter with expertise in conversion-focused content.",
  CASUAL: "You are a friendly content creator who writes in a conversational, approachable style.",
  PROFESSIONAL: "You are a professional business communicator creating formal, polished content.",
} as const;

// Feature flags for AI capabilities
export const AI_FEATURES = {
  STREAMING: true,
  VARIATIONS: true,
  HASHTAG_GENERATION: true,
  EMOJI_GENERATION: true,
  TONE_ANALYSIS: true,
  CONTENT_OPTIMIZATION: true,
  MULTI_PLATFORM: true,
  BATCH_GENERATION: true,
} as const;

// Default configuration for backward compatibility
export const DEFAULT_CONFIG = {
  provider: DEFAULT_AI_PROVIDER,
  model: GROQ_MODELS.BALANCED,
  temperature: AI_DEFAULTS.TEMPERATURE,
  maxOutputTokens: AI_LIMITS.MAX_OUTPUT_LENGTH,
  maxTokens: AI_LIMITS.MAX_TOKENS,
  topP: AI_DEFAULTS.TOP_P,
  timeout: AI_LIMITS.TIMEOUT_MS,
} as const;

// Platform constraints for social media platforms
export const PLATFORM_CONSTRAINTS = {
  twitter: {
    maxLength: PLATFORM_LIMITS.TWITTER.maxLength,
    hashtagLimit: PLATFORM_LIMITS.TWITTER.hashtagLimit,
    requiresHashtags: false,
    supportsEmojis: true,
    maxLines: 10,
  },
  instagram: {
    maxLength: PLATFORM_LIMITS.INSTAGRAM.maxLength,
    hashtagLimit: PLATFORM_LIMITS.INSTAGRAM.hashtagLimit,
    requiresHashtags: true,
    supportsEmojis: true,
    maxLines: 20,
  },
  linkedin: {
    maxLength: PLATFORM_LIMITS.LINKEDIN.maxLength,
    hashtagLimit: PLATFORM_LIMITS.LINKEDIN.hashtagLimit,
    requiresHashtags: false,
    supportsEmojis: false,
    maxLines: 50,
  },
  facebook: {
    maxLength: PLATFORM_LIMITS.FACEBOOK.maxLength,
    hashtagLimit: PLATFORM_LIMITS.FACEBOOK.hashtagLimit,
    requiresHashtags: false,
    supportsEmojis: true,
    maxLines: 100,
  },
  tiktok: {
    maxLength: PLATFORM_LIMITS.TIKTOK.maxLength,
    hashtagLimit: PLATFORM_LIMITS.TIKTOK.hashtagLimit,
    requiresHashtags: true,
    supportsEmojis: true,
    maxLines: 5,
  },
  youtube: {
    maxLength: PLATFORM_LIMITS.YOUTUBE.maxLength,
    hashtagLimit: PLATFORM_LIMITS.YOUTUBE.hashtagLimit,
    requiresHashtags: false,
    supportsEmojis: true,
    maxLines: 200,
  },
  threads: {
    maxLength: PLATFORM_LIMITS.THREADS.maxLength,
    hashtagLimit: PLATFORM_LIMITS.THREADS.hashtagLimit,
    requiresHashtags: false,
    supportsEmojis: true,
    maxLines: 10,
  },
} as const;

// Additional AI model configurations
export const MODEL_CONFIGS = {
  [GROQ_MODELS.FAST]: {
    name: "Llama 3.1 8B (Fast)",
    provider: "groq",
    maxTokens: 8192,
    contextWindow: 8192,
    costPer1kTokens: 0.0001,
  },
  [GROQ_MODELS.BALANCED]: {
    name: "Llama 3.1 70B (Balanced)",
    provider: "groq",
    maxTokens: 8192,
    contextWindow: 8192,
    costPer1kTokens: 0.0008,
  },
  [GROQ_MODELS.ADVANCED]: {
    name: "Mixtral 8x7B (Advanced)",
    provider: "groq",
    maxTokens: 32768,
    contextWindow: 32768,
    costPer1kTokens: 0.0005,
  },
  [GROQ_MODELS.ULTRA]: {
    name: "Llama 3.1 70B Versatile (Ultra)",
    provider: "groq",
    maxTokens: 131072,
    contextWindow: 131072,
    costPer1kTokens: 0.001,
  },
} as const;

// Type exports (derived from constants)
export type AIModelType = (typeof AI_MODELS)[keyof typeof AI_MODELS];
export type AIToneType = (typeof AI_TONES)[keyof typeof AI_TONES];
export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];
export type PlatformConstraintsType =
  (typeof PLATFORM_CONSTRAINTS)[keyof typeof PLATFORM_CONSTRAINTS];
export type ModelConfig = (typeof MODEL_CONFIGS)[keyof typeof MODEL_CONFIGS];
