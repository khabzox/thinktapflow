import { BasePostGenerator } from './base-post-generator';
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from '@/types/ai';

export class InstagramGenerator extends BasePostGenerator {
    constructor(platform: SupportedPlatforms) {
        super(platform);
    }

    generatePrompt(content: string, options: AIGenerationOptions = {}): string {
        return `Create engaging Instagram captions from this content:

${content}

Requirements:
- Engaging and visual-focused tone
- Include relevant hashtags (max 15)
- Use line breaks for readability
- Create hook in first line
${options.includeEmojis ? '- Include relevant emojis' : ''}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ''}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "content": "Your caption here with\\nline breaks for readability",
    "hashtags": ["hashtag1", "hashtag2", "...up to 15 hashtags"],
    "mentions": ["@user1", "@brand2"],
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
                    hashtags: (post.hashtags || []).slice(0, 15),
                    mentions: post.mentions || [],
                    characterCount: post.content?.length || 0,
                }))
                .filter((post) => this.validatePost(post));
        } catch {
            throw new AIServiceError('Failed to parse Instagram response', 'PARSE_ERROR');
        }
    }

    validatePost(post: PlatformPost): boolean {
        return (
            post.content.length > 0 &&
            post.content.length <= 2200 &&
            post.hashtags.length <= 15
        );
    }
} 