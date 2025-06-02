// Core AI service types for ContentSprout

export enum SupportedPlatforms {
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
}

export interface PlatformPost {
  content: string;
  hashtags: string[];
  mentions: string[];
  characterCount: number;
}

export interface GeneratedPosts {
  [SupportedPlatforms.TWITTER]?: PlatformPost[];
  [SupportedPlatforms.LINKEDIN]?: PlatformPost[];
  [SupportedPlatforms.INSTAGRAM]?: PlatformPost[];
  [SupportedPlatforms.FACEBOOK]?: PlatformPost[];
  metadata: {
    originalContent: string;
    tokensUsed: number;
    generationTime: number;
    platforms: string[];
    model?: string;
    timestamp?: number;
  };
}

export interface PlatformConstraints {
  maxLength: number;
  maxPosts: number;
  tone: string;
  hashtagCount: number;
  format: string;
}

export interface AIGenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
  customInstructions?: string;
  includeEmojis?: boolean;
  targetAudience?: string;
}

export interface ContentParsingResult {
  title: string;
  content: string;
  url: string;
  extractedAt: number;
  wordCount: number;
  readingTime: number;
}

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  maxInputTokens?: number;
  maxContentLength?: number;
  timeout?: number;
}

export interface GenerationMetrics {
  requestTime: number;
  responseTime: number;
  tokensUsed: number;
  characterCount: number;
  platformCount: number;
  success: boolean;
  error?: string;
}

// Error types
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class ContentParsingError extends Error {
  constructor(
    message: string,
    public url: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'ContentParsingError';
  }
}

export class TokenLimitError extends Error {
  constructor(
    message: string,
    public tokensUsed: number,
    public limit: number
  ) {
    super(message);
    this.name = 'TokenLimitError';
  }
}
