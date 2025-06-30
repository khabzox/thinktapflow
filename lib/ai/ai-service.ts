import { BaseAIProvider } from './core/base-ai-provider';
import { createAIProvider, AIProviderType } from './factory/provider-factory';
import { ContentService } from '../content/content-service';
import { SocialService } from '../social/social-service';
import {
  AIServiceConfig,
  AIGenerationOptions,
  ContentParsingResult,
  GeneratedPosts,
  GenerationMetrics,
  SupportedPlatforms,
} from '@/types/ai';
import { AI_DEFAULTS, DEFAULT_AI_PROVIDER, AI_LIMITS } from '../../constants/ai';

// Build default config using our AI constants
const buildDefaultConfig = (): AIServiceConfig => ({
  provider: DEFAULT_AI_PROVIDER,
  apiKey: process.env.GROQ_API_KEY || '',
  temperature: AI_DEFAULTS.TEMPERATURE,
  maxTokens: AI_LIMITS.MAX_TOKENS,
  topP: AI_DEFAULTS.TOP_P,
  timeout: AI_LIMITS.TIMEOUT_MS,
  maxContentLength: AI_LIMITS.MAX_INPUT_LENGTH,
  maxInputTokens: AI_LIMITS.MAX_TOKENS,
  maxOutputTokens: AI_LIMITS.MAX_OUTPUT_LENGTH
});

// Functional AI Service with state management through closure
export const createAIService = (
  providerType: AIProviderType = DEFAULT_AI_PROVIDER, 
  config: Partial<AIServiceConfig> = {}
) => {
  const fullConfig = { ...buildDefaultConfig(), ...config };
  let aiProvider = createAIProvider(providerType, fullConfig);
  const contentService = new ContentService();
  const socialService = new SocialService();
  let metrics: GenerationMetrics[] = [];

  const recordMetrics = (newMetrics: GenerationMetrics): void => {
    metrics.push(newMetrics);
    if (metrics.length > 100) {
      metrics = metrics.slice(-50); // Keep last 50
    }
  };

  const parseContentFromUrl = async (url: string): Promise<ContentParsingResult> => {
    return contentService.extractContent(url);
  };

  const generateSocialPosts = async (
    content: string,
    platforms: SupportedPlatforms[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedPosts> => {
    const startTime = Date.now();

    try {
      const result = await socialService.generatePosts(
        content,
        platforms,
        aiProvider,
        options
      );

      recordMetrics({
        requestTime: startTime,
        responseTime: Date.now(),
        tokensUsed: result.metadata.tokensUsed,
        characterCount: content.length,
        platformCount: platforms.length,
        success: true,
      });

      return result;
    } catch (error) {
      recordMetrics({
        requestTime: startTime,
        responseTime: Date.now(),
        tokensUsed: 0,
        characterCount: content.length,
        platformCount: platforms.length,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  };

  const switchProvider = (newProviderType: AIProviderType, newConfig?: Partial<AIServiceConfig>): void => {
    const fullNewConfig = { ...buildDefaultConfig(), ...newConfig };
    aiProvider = createAIProvider(newProviderType, fullNewConfig);
  };

  const getMetrics = (): GenerationMetrics[] => {
    return [...metrics];
  };

  const getCurrentProvider = (): BaseAIProvider => aiProvider;

  const healthCheck = async () => {
    // Implement health check logic
    return {
      status: 'healthy',
      provider: aiProvider.constructor.name,
      timestamp: Date.now()
    };
  };

  return {
    parseContentFromUrl,
    generateSocialPosts,
    switchProvider,
    getMetrics,
    getCurrentProvider,
    healthCheck
  };
};

// Legacy class wrapper for backward compatibility
export class AIService {
  private service: ReturnType<typeof createAIService>;

  constructor(providerType: AIProviderType = DEFAULT_AI_PROVIDER, config: Partial<AIServiceConfig> = {}) {
    this.service = createAIService(providerType, config);
  }

  async parseContentFromUrl(url: string): Promise<ContentParsingResult> {
    return this.service.parseContentFromUrl(url);
  }

  async generateSocialPosts(
    content: string,
    platforms: SupportedPlatforms[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedPosts> {
    return this.service.generateSocialPosts(content, platforms, options);
  }

  switchProvider(providerType: AIProviderType, config?: Partial<AIServiceConfig>): void {
    this.service.switchProvider(providerType, config);
  }

  getMetrics(): GenerationMetrics[] {
    return this.service.getMetrics();
  }
}
