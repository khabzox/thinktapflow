import { BasePostGenerator } from './generators/base-post-generator';
import { TwitterGenerator } from './generators/twitter-generator';
import { LinkedInGenerator } from './generators/linkedin-generator';
import { InstagramGenerator } from './generators/instagram-generator';
import { FacebookGenerator } from './generators/facebook-generator';
import { YouTubeGenerator } from './generators/youtube-generator';
import { TikTokGenerator } from './generators/tiktok-generator';
import { BaseAIProvider } from '../ai/core/base-ai-provider';
import { SupportedPlatforms, GeneratedPosts, AIGenerationOptions } from '@/types/ai';

export class SocialService {
  private generators = new Map<SupportedPlatforms, BasePostGenerator>();

  constructor() {
    this.registerGenerator(
      'twitter',
      new TwitterGenerator('twitter')
    );
    this.registerGenerator(
      'linkedin',
      new LinkedInGenerator('linkedin')
    );
    this.registerGenerator(
      'instagram',
      new InstagramGenerator('instagram')
    );
    this.registerGenerator(
      'facebook',
      new FacebookGenerator('facebook')
    );
    this.registerGenerator(
      'youtube',
      new YouTubeGenerator('youtube')
    );
    this.registerGenerator(
      'tiktok',
      new TikTokGenerator('tiktok')
    );
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
      posts: {}
    };

    const startTime = Date.now();
    let totalTokens = 0;

    for (const platform of platforms) {
      const generator = this.generators.get(platform);
      if (!generator) {
        console.warn(`No generator found for platform: ${platform}`);
        continue;
      }

      try {
        const prompt = generator.generatePrompt(content, options);
        const response = await aiProvider.generateCompletion(prompt, options);
        const posts = generator.processResponse(response);

        if (posts.length > 0) {
          results.posts[platform] = posts.map(post => ({
            content: post.content,
            hashtags: post.hashtags || [],
            mentions: post.mentions || [],
            metadata: {
              characterCount: post.characterCount,
              platform,
              timestamp: Date.now()
            }
          }));
          totalTokens += response.length / 4; // Rough estimate of tokens
        }
      } catch (error) {
        console.warn(`Failed to generate posts for ${platform}:`, error);
        results.posts[platform] = [];
      }
    }

    results.metadata.generationTime = Date.now() - startTime;
    results.metadata.tokensUsed = totalTokens;

    return results;
  }
}
