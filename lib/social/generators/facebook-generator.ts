import { BasePostGenerator } from "./base-post-generator";
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from "@/types/ai";

export class FacebookGenerator extends BasePostGenerator {
  constructor(platform: SupportedPlatforms) {
    super(platform);
  }

  generatePrompt(content: string, options: AIGenerationOptions = {}): string {
    return `Create engaging Facebook posts from this content:

${content}

Requirements:
- Casual, friendly tone
- Include relevant hashtags (max 5)
- Break text into readable paragraphs
- Focus on engagement and shareability
${options.includeEmojis ? "- Include relevant emojis" : ""}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "content": "Your post text here with\\nline breaks for paragraphs",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
    "mentions": ["@page1", "@person2"],
    "characterCount": 123
  }
]`;
  }

  processResponse(response: string): PlatformPost[] {
    try {
      const posts = JSON.parse(response) as any[];
      return posts
        .map(post => ({
          content: post.content || "",
          hashtags: (post.hashtags || []).slice(0, 5),
          mentions: post.mentions || [],
          characterCount: post.content?.length || 0,
        }))
        .filter(post => this.validatePost(post));
    } catch {
      throw new AIServiceError("Failed to parse Facebook response", "PARSE_ERROR");
    }
  }

  validatePost(post: PlatformPost): boolean {
    return post.content.length > 0 && post.content.length <= 63206 && post.hashtags.length <= 5;
  }
}
