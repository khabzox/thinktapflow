import { SupportedPlatforms, PlatformConstraints, AIServiceConfig } from '@/types/ai';

// Platform-specific constraints and optimization rules
const PLATFORM_CONSTRAINTS: Record<SupportedPlatforms, PlatformConstraints> = {
  [SupportedPlatforms.TWITTER]: {
    maxLength: 280,
    maxPosts: 5,
    tone: 'engaging and conversational',
    hashtagCount: 3,
    format: 'short, punchy, and viral-worthy',
  },
  [SupportedPlatforms.LINKEDIN]: {
    maxLength: 3000,
    maxPosts: 3,
    tone: 'professional and insightful',
    hashtagCount: 5,
    format: 'detailed, value-driven, and thought-provoking',
  },
  [SupportedPlatforms.INSTAGRAM]: {
    maxLength: 2200,
    maxPosts: 5,
    tone: 'casual and visually appealing',
    hashtagCount: 10,
    format: 'visual-first, story-driven, and lifestyle-focused',
  },
  [SupportedPlatforms.FACEBOOK]: {
    maxLength: 63206,
    maxPosts: 3,
    tone: 'friendly and community-focused',
    hashtagCount: 3,
    format: 'conversational, engaging, and shareable',
  },
};

// Default configuration for Groq
const DEFAULT_CONFIG: Required<AIServiceConfig> = {
  apiKey: '',
  model: 'llama-3.1-70b-versatile', // Groq's flagship model
  maxInputTokens: 8000, // Groq's context window
  maxContentLength: 6000, // Adjusted for Groq
  timeout: 30000, // Groq can be fast, but allow more time for complex requests
};

// Available Groq models
const GROQ_MODELS = {
  LLAMA_70B: 'llama-3.1-70b-versatile', // Best quality, slower
  LLAMA_8B: 'llama-3.1-8b-instant', // Faster, good quality
  MIXTRAL_8X7B: 'mixtral-8x7b-32768', // Alternative option
};

export { PLATFORM_CONSTRAINTS, DEFAULT_CONFIG, GROQ_MODELS };
