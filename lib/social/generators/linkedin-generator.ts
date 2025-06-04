import { BasePostGenerator } from './base-post-generator';
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from '@/types/ai';

export class LinkedInGenerator extends BasePostGenerator {
    constructor(platform: SupportedPlatforms) {
        super(platform);
    }

    generatePrompt(content: string, options: AIGenerationOptions = {}): string {
        return `Create engaging LinkedIn posts from this content:

${content}

Requirements:
- Professional and insightful tone
- Include relevant hashtags (max 3)
- Focus on business value and insights
- Break text into readable paragraphs
${options.includeEmojis ? '- Include relevant professional emojis' : ''}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ''}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "content": "Your post text here with\\nline breaks for paragraphs",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "mentions": ["@company1", "@person2"],
    "characterCount": 123
  }
]`;
    }

    processResponse(response: string): PlatformPost[] {
        try {
            const posts = JSON.parse(response) as any[];
            return posts
                .map((post) => ({
                    content: post.content || '',
                    hashtags: (post.hashtags || []).slice(0, 3),
                    mentions: post.mentions || [],
                    characterCount: post.content?.length || 0,
                }))
                .filter((post) => this.validatePost(post));
        } catch {
            throw new AIServiceError('Failed to parse LinkedIn response', 'PARSE_ERROR');
        }
    }

    validatePost(post: PlatformPost): boolean {
        return (
            post.content.length > 0 &&
            post.content.length <= 3000 &&
            post.hashtags.length <= 3
        );
    }
} 