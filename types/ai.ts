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

export interface PostMetadata {
  characterCount: number;
  platform: SupportedPlatforms;
  timestamp: number;
}

export interface GeneratedPosts {
  metadata: {
    originalContent: string;
    tokensUsed: number;
    generationTime: number;
    platforms: SupportedPlatforms[];
    model: string;
    timestamp: number;
  };
  posts: {
    [key in SupportedPlatforms]?: Array<{
      content: string;
      hashtags: string[];
      mentions: string[];
      metadata: PostMetadata;
    }>;
  };
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

export type SupportedPlatforms = 'twitter' | 'linkedin' | 'instagram';

export interface PlatformConstraints {
  maxLength: number;
  maxPosts: number;
  hashtagCount: number;
  tone: string;
  format: string;
}

export class AIServiceError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.statusCode = statusCode;
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
