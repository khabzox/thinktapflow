import { BaseAIProvider } from './core/base-ai-provider';
import { AIProviderFactory, AIProviderType } from './factory/provider-factory';
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
import { DEFAULT_CONFIG } from '@/constants/ai';

export class AIService {
  private aiProvider: BaseAIProvider;
  private contentService: ContentService;
  private socialService: SocialService;
  private metrics: GenerationMetrics[] = [];

  constructor(providerType: AIProviderType = 'groq', config: Partial<AIServiceConfig> = {}) {
    const fullConfig = { ...DEFAULT_CONFIG, ...config };
    this.aiProvider = AIProviderFactory.create(providerType, fullConfig);
    this.contentService = new ContentService();
    this.socialService = new SocialService();
  }

  async parseContentFromUrl(url: string): Promise<ContentParsingResult> {
    return this.contentService.extractContent(url);
  }

  async generateSocialPosts(
    content: string,
    platforms: SupportedPlatforms[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedPosts> {
    const startTime = Date.now();

    try {
      const result = await this.socialService.generatePosts(
        content,
        platforms,
        this.aiProvider,
        options
      );

      this.recordMetrics({
        requestTime: startTime,
        responseTime: Date.now(),
        tokensUsed: result.metadata.tokensUsed,
        characterCount: content.length,
        platformCount: platforms.length,
        success: true,
      });

      return result;
    } catch (error) {
      this.recordMetrics({
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
  }

  switchProvider(providerType: AIProviderType, config?: Partial<AIServiceConfig>): void {
    const fullConfig = { ...DEFAULT_CONFIG, ...config };
    this.aiProvider = AIProviderFactory.create(providerType, fullConfig);
  }

  getMetrics(): GenerationMetrics[] {
    return [...this.metrics];
  }

  private recordMetrics(metrics: GenerationMetrics): void {
    this.metrics.push(metrics);
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50); // Keep last 50
    }
  }
}
