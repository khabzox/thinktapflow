export type AIProviderType = 'gemini' | 'groq' | 'openai'

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  timeout: number;
  maxContentLength: number;
  maxInputTokens: number;
  maxOutputTokens: number;
}

export interface AIGenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  includeEmojis?: boolean;
  targetAudience?: string;
  customInstructions?: string;
}

export interface ModelInfo {
  name: string;
  provider: string;
  maxTokens: number;
  contextWindow: number;
}

export interface ContentParsingResult {
  title: string;
  content: string;
  url: string;
  extractedAt: number;
  wordCount: number;
  readingTime: number;
}

export interface PlatformPost {
  content: string;
  hashtags: string[];
  mentions: string[];
  characterCount: number;
}

export interface GeneratedPosts {
  metadata: {
    originalContent: string;
    tokensUsed: number;
    generationTime: number;
    platforms: string[];
    model: string;
    timestamp: number;
  };
  twitter?: string[];
  linkedin?: string[];
  instagram?: string[];
  facebook?: string[];
  youtube?: {
    title: string;
    description: string;
    tags: string[];
    timestamps?: { time: string; description: string }[];
  }[];
  [key: string]: PlatformPost[] | any;
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

export enum SupportedPlatforms {
  Twitter = 'twitter',
  LinkedIn = 'linkedin',
  Instagram = 'instagram',
  Facebook = 'facebook',
  YouTube = 'youtube',
  Threads = 'threads',
  TikTok = 'tiktok'
}

export interface PlatformConstraints {
  maxLength: number;
  maxPosts: number;
  hashtagCount: number;
  tone: string;
  format: string;
}

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
