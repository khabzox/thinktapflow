import { BasePostGenerator } from './base-post-generator';
import { AIGenerationOptions, SupportedPlatforms, PlatformPost } from '@/types/ai';
import { PLATFORM_CONSTRAINTS } from '@/constants/ai';

export class YouTubeGenerator extends BasePostGenerator {
    constructor() {
        super(SupportedPlatforms.YouTube);
    }

    generatePrompt(content: string, options?: AIGenerationOptions): string {
        const constraints = PLATFORM_CONSTRAINTS[SupportedPlatforms.YouTube];

        return `
Generate engaging YouTube video content based on the following content.

Original Content:
${content.slice(0, 2000)}

Requirements:
- Create a compelling title (max 100 characters)
- Write an engaging description (max ${constraints.maxLength} characters)
- Include up to ${constraints.hashtagCount} relevant hashtags
- Add 3-5 key timestamps/chapters for the video
- Maintain an ${constraints.tone} tone
- Optimize for YouTube SEO

${options?.customInstructions ? `Additional Instructions:\n${options.customInstructions}` : ''}

Response Format:
{
  "title": "Engaging Video Title",
  "description": "Main description with proper formatting and line breaks",
  "tags": ["tag1", "tag2", "tag3"],
  "timestamps": [
    { "time": "0:00", "description": "Introduction" },
    { "time": "2:30", "description": "Main Topic" }
  ]
}
`;
    }

    processResponse(response: string): PlatformPost[] {
        try {
            const parsed = JSON.parse(response);
            return [{
                content: this.formatDescription(parsed.description, parsed.timestamps),
                hashtags: parsed.tags || [],
                mentions: [],
                characterCount: parsed.description.length
            }];
        } catch (error) {
            console.error('Failed to parse YouTube response:', error);
            return [];
        }
    }

    validatePost(post: PlatformPost): boolean {
        return post.content.length <= this.constraints.maxLength &&
            post.hashtags.length <= this.constraints.hashtagCount;
    }

    private formatDescription(description: string, timestamps: { time: string; description: string }[]): string {
        const timestampSection = timestamps?.length
            ? '\n\n📋 Chapters:\n' + timestamps.map(t => `${t.time} - ${t.description}`).join('\n')
            : '';

        return `${description.trim()}${timestampSection}\n\n#ThinkTapFlow`;
    }
} 