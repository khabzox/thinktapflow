import { BasePostGenerator } from "./base-post-generator";
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from "@/types/ai";

export class TwitterGenerator extends BasePostGenerator {
  constructor(platform: SupportedPlatforms) {
    super(platform);
  }

  generatePrompt(content: string, options: AIGenerationOptions = {}): string {
    return `Create engaging Twitter posts from this content:

${content}

Requirements:
- Maximum 280 characters per post
- Include relevant hashtags (max 3)
- Use engaging, conversational tone
- Focus on key insights or quotes
${options.includeEmojis ? "- Include relevant emojis" : ""}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "content": "Your post text here",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "mentions": ["@user1", "@user2"],
    "characterCount": 123
  }
]`;
  }

  processResponse(response: string): PlatformPost[] {
    try {
      const posts = JSON.parse(response) as any[];
      return posts
        .map(post => ({
          content: post.content?.substring(0, 280) || "",
          hashtags: (post.hashtags || []).slice(0, 3),
          mentions: post.mentions || [],
          characterCount: post.content?.length || 0,
        }))
        .filter(post => this.validatePost(post));
    } catch {
      throw new AIServiceError("Failed to parse Twitter response", "PARSE_ERROR");
    }
  }

  validatePost(post: PlatformPost): boolean {
    return post.content.length > 0 && post.content.length <= 280 && post.hashtags.length <= 3;
  }
}
