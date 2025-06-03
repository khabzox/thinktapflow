import { BasePostGenerator } from './generators/base-post-generator';
import { TwitterGenerator } from './generators/twitter-generator';
import { YouTubeGenerator } from './generators/youtube-generator';
import { BaseAIProvider } from '../ai/core/base-ai-provider';
import { SupportedPlatforms, GeneratedPosts, AIGenerationOptions } from '@/types/ai';

export class SocialService {
  private generators = new Map<SupportedPlatforms, BasePostGenerator>();

  constructor() {
    this.registerGenerator(
      SupportedPlatforms.Twitter,
      new TwitterGenerator(SupportedPlatforms.Twitter)
    );
    this.registerGenerator(
      SupportedPlatforms.YouTube,
      new YouTubeGenerator()
    );
    // Add other platform generators...
  }

  registerGenerator(platform: SupportedPlatforms, generator: BasePostGenerator): void {
    this.generators.set(platform, generator);
  }

  async generatePosts(
    content: string,
    platforms: SupportedPlatforms[],
    aiProvider: BaseAIProvider,
    options: AIGenerationOptions = {}
  ): Promise<GeneratedPosts> {
    const results: GeneratedPosts = {
      metadata: {
        originalContent: content.substring(0, 500),
        tokensUsed: 0,
        generationTime: 0,
        platforms,
        model: aiProvider.getModelInfo().name,
        timestamp: Date.now(),
      },
    } as GeneratedPosts;

    const startTime = Date.now();

    for (const platform of platforms) {
      const generator = this.generators.get(platform);
      if (!generator) continue;

      try {
        const prompt = generator.generatePrompt(content, options);
        const response = await aiProvider.generateCompletion(prompt, options);
        const posts = generator.processResponse(response);

        if (posts.length > 0) {
          results[platform] = posts.map(post => post.content);
        }
      } catch (error) {
        console.warn(`Failed to generate posts for ${platform}:`, error);
        // Continue with other platforms
      }
    }

    results.metadata.generationTime = Date.now() - startTime;
    return results;
  }
}
