import { BasePostGenerator } from "./base-post-generator";
import { AIGenerationOptions, PlatformPost, AIServiceError, SupportedPlatforms } from "@/types/ai";

export class YouTubeGenerator extends BasePostGenerator {
  constructor(platform: SupportedPlatforms) {
    super(platform);
  }

  generatePrompt(content: string, options: AIGenerationOptions = {}): string {
    return `Create engaging YouTube video content from this:

${content}

Requirements:
- Create a compelling title (max 100 characters)
- Write an SEO-friendly description
- Include relevant hashtags (max 15)
- Add timestamps/chapters
- Include call-to-action
${options.includeEmojis ? "- Include relevant emojis" : ""}
${options.targetAudience ? `- Target audience: ${options.targetAudience}` : ""}

Return ONLY a JSON array of objects with this exact format:
[
  {
    "title": "Your attention-grabbing video title here",
    "description": "Main description with proper formatting\\n\\nKey Points:\\n- Point 1\\n- Point 2\\n\\nTimestamps:\\n0:00 - Intro\\n1:30 - Main Topic\\n\\nLinks and CTA:\\n▶ Subscribe for more!\\n▶ Follow us on social media",
    "hashtags": ["hashtag1", "hashtag2", "...up to 15 hashtags"],
    "mentions": ["@channel1", "@creator2"],
    "characterCount": 123,
    "timestamps": [
      { "time": "0:00", "label": "Introduction" },
      { "time": "1:30", "label": "Main Topic" }
    ]
  }
]`;
  }

  processResponse(response: string): PlatformPost[] {
    try {
      const posts = JSON.parse(response) as any[];
      return posts
        .map(post => {
          const formattedContent = this.formatVideoContent(
            post.title,
            post.description,
            post.timestamps || [],
          );
          return {
            content: formattedContent,
            hashtags: (post.hashtags || []).slice(0, 15),
            mentions: post.mentions || [],
            characterCount: formattedContent.length || 0,
            title: post.title,
            timestamps: post.timestamps || [],
          };
        })
        .filter(post => this.validatePost(post));
    } catch {
      throw new AIServiceError("Failed to parse YouTube response", "PARSE_ERROR");
    }
  }

  private formatVideoContent(
    title: string,
    description: string,
    timestamps: Array<{ time: string; label: string }> = [],
  ): string {
    const timestampSection =
      timestamps.length > 0
        ? "\n\n⏰ Timestamps:\n" + timestamps.map(t => `${t.time} - ${t.label}`).join("\n")
        : "";

    return `📺 ${title}\n\n${description}${timestampSection}`;
  }

  validatePost(post: PlatformPost & { title?: string }): boolean {
    return (
      post.content.length > 0 &&
      post.content.length <= 5000 &&
      post.hashtags.length <= 15 &&
      (!post.title || post.title.length <= 100)
    );
  }
}
