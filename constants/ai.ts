import { SupportedPlatforms, PlatformConstraints, AIServiceConfig } from '@/types/ai';

export const DEFAULT_CONFIG: AIServiceConfig = {
  apiKey: '',
  model: 'llama3-8b-8192',
  timeout: 30000,
  maxContentLength: 8000,
  maxInputTokens: 4000,
  maxOutputTokens: 2048,
};

export const PLATFORM_CONSTRAINTS: Record<SupportedPlatforms, PlatformConstraints> = {
  [SupportedPlatforms.Twitter]: {
    maxLength: 280,
    maxPosts: 3,
    hashtagCount: 3,
    tone: 'conversational',
    format: 'tweet',
  },
  [SupportedPlatforms.LinkedIn]: {
    maxLength: 3000,
    maxPosts: 2,
    hashtagCount: 5,
    tone: 'professional',
    format: 'article',
  },
  [SupportedPlatforms.Facebook]: {
    maxLength: 63206,
    maxPosts: 2,
    hashtagCount: 5,
    tone: 'casual',
    format: 'post',
  },
  [SupportedPlatforms.Instagram]: {
    maxLength: 2200,
    maxPosts: 2,
    hashtagCount: 10,
    tone: 'visual',
    format: 'caption',
  },
  [SupportedPlatforms.YouTube]: {
    maxLength: 5000,
    maxPosts: 1,
    hashtagCount: 15,
    tone: 'engaging',
    format: 'video-content',
  },
  [SupportedPlatforms.Threads]: {
    maxLength: 500,
    maxPosts: 3,
    hashtagCount: 3,
    tone: 'conversational',
    format: 'thread',
  },
  [SupportedPlatforms.TikTok]: {
    maxLength: 2200,
    maxPosts: 2,
    hashtagCount: 8,
    tone: 'energetic',
    format: 'caption',
  },
};
