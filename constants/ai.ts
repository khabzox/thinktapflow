import type { SupportedPlatforms, PlatformConstraints, AIServiceConfig } from '@/types/ai';

export const DEFAULT_CONFIG: AIServiceConfig = {
  apiKey: process.env.GROQ_API_KEY || '',
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  maxTokens: 8192,
  topP: 0.8,
  timeout: 30000,
  maxContentLength: 10000,
  maxInputTokens: 4096,
  maxOutputTokens: 2048
};

export const PLATFORM_CONSTRAINTS: Record<SupportedPlatforms, PlatformConstraints> = {
  twitter: {
    maxLength: 280,
    maxPosts: 3,
    hashtagCount: 3,
    tone: 'conversational',
    format: 'text'
  },
  linkedin: {
    maxLength: 3000,
    maxPosts: 2,
    hashtagCount: 3,
    tone: 'professional',
    format: 'text'
  },
  instagram: {
    maxLength: 2200,
    maxPosts: 2,
    hashtagCount: 15,
    tone: 'engaging',
    format: 'text'
  }
} as const;
