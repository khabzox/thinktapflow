import { BasePostGenerator } from './base-post-generator';
import { AIGenerationOptions, PlatformPost, AIServiceError } from '@/types/ai';

export class TwitterGenerator extends BasePostGenerator {
  generatePrompt(content: string, options: AIGenerationOptions = {}): string {
    return `Create ${this.constraints.maxPosts} engaging Twitter posts from this content:

${content}

Requirements:
- Maximum ${this.constraints.maxLength} characters per post
- Include relevant hashtags (max ${this.constraints.hashtagCount})
- Use engaging, conversational tone
- Focus on key insights or quotes
${options.includeEmojis ? '- Include relevant emojis' : ''}

Return as JSON array of objects with: content, hashtags, mentions, characterCount`;
  }

  processResponse(response: string): PlatformPost[] {
    try {
      const posts = JSON.parse(response) as any[];
      return posts
        .map((post) => ({
          content: post.content?.substring(0, this.constraints.maxLength) || '',
          hashtags: (post.hashtags || []).slice(0, this.constraints.hashtagCount),
          mentions: post.mentions || [],
          characterCount: post.content?.length || 0,
        }))
        .filter((post) => this.validatePost(post));
    } catch {
      throw new AIServiceError('Failed to parse Twitter response', 'PARSE_ERROR');
    }
  }

  validatePost(post: PlatformPost): boolean {
    return (
      post.content.length > 0 &&
      post.content.length <= this.constraints.maxLength &&
      post.hashtags.length <= this.constraints.hashtagCount
    );
  }
}
