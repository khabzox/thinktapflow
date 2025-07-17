import { BasePostGenerator } from "./base-post-generator";
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from "@/types/ai";

export class TikTokGenerator extends BasePostGenerator {
  constructor(platform: SupportedPlatforms) {
    super(platform);
  }

  generatePrompt(content: string, options: AIGenerationOptions = {}): string {
    return `Create engaging TikTok content from this:

${content}

Requirements:
- Create a catchy video title/hook (max 100 characters)
- Write engaging caption with trending hooks
- Include viral hashtags (max 10)
- Add trending sounds/effects suggestions
- Use short, punchy sentences
${options.includeEmojis ? "- Include trending emojis" : ""}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "title": "Your attention-grabbing hook/title here",
    "caption": "Main caption with trending phrases\\nand engaging hooks",
    "hashtags": ["hashtag1", "hashtag2", "...up to 10 hashtags"],
    "mentions": ["@creator1", "@sound2"],
    "characterCount": 123,
    "soundSuggestions": ["Trending Sound 1", "Popular Effect 2"],
    "trendingTopics": ["trend1", "trend2"]
  }
]`;
  }

  processResponse(response: string): PlatformPost[] {
    try {
      const posts = JSON.parse(response) as any[];
      return posts
        .map(post => {
          const formattedContent = this.formatTikTokContent(
            post.title,
            post.caption,
            post.soundSuggestions || [],
            post.trendingTopics || [],
          );
          return {
            content: formattedContent,
            hashtags: (post.hashtags || []).slice(0, 10),
            mentions: post.mentions || [],
            characterCount: formattedContent.length || 0,
            title: post.title,
            soundSuggestions: post.soundSuggestions || [],
            trendingTopics: post.trendingTopics || [],
          };
        })
        .filter(post => this.validatePost(post));
    } catch {
      throw new AIServiceError("Failed to parse TikTok response", "PARSE_ERROR");
    }
  }

  private formatTikTokContent(
    title: string,
    caption: string,
    sounds: string[] = [],
    trends: string[] = [],
  ): string {
    const soundSection =
      sounds.length > 0 ? "\n\n🎵 Suggested Sounds:\n" + sounds.map(s => `• ${s}`).join("\n") : "";

    const trendSection =
      trends.length > 0 ? "\n\n🔥 Trending Topics:\n" + trends.map(t => `• ${t}`).join("\n") : "";

    return `${title}\n\n${caption}${soundSection}${trendSection}`;
  }

  validatePost(post: PlatformPost & { title?: string }): boolean {
    return (
      post.content.length > 0 &&
      post.content.length <= 2200 &&
      post.hashtags.length <= 10 &&
      (!post.title || post.title.length <= 100)
    );
  }
}
