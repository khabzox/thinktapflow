import {
  SupportedPlatforms,
  PlatformConstraints,
  PlatformPost,
  AIGenerationOptions,
} from '@/types/ai';
import { PLATFORM_CONSTRAINTS } from '@/constants/ai/ai';

export abstract class BasePostGenerator {
  protected platform: SupportedPlatforms;
  protected constraints: PlatformConstraints;

  constructor(platform: SupportedPlatforms) {
    this.platform = platform;
    this.constraints = PLATFORM_CONSTRAINTS[platform];
  }

  protected getAdjustedLength(baseLength: number, contentLength: number = 50): number {
    // Convert percentage to a multiplier (0.5 to 1.5)
    const multiplier = 0.5 + (contentLength / 100);
    return Math.floor(baseLength * multiplier);
  }

  protected getTemperatureFromCreativity(creativityLevel: number = 50): number {
    // Convert creativity level (0-100) to temperature (0.1-1.0)
    return 0.1 + (creativityLevel / 100) * 0.9;
  }

  protected getHashtagCount(includeHashtags: boolean = true): number {
    if (!includeHashtags) return 0;
    return this.constraints.hashtagCount;
  }

  protected getPromptInstructions(options: AIGenerationOptions = {}): string {
    const instructions = [];
    
    // Add base instructions based on platform constraints
    instructions.push(`- Use ${this.constraints.tone} tone`);
    instructions.push(`- Maximum length: ${this.getAdjustedLength(this.constraints.maxLength, options.contentLength)} characters`);
    
    // Add hashtag instructions
    if (options.includeHashtags !== false) {
      instructions.push(`- Include relevant hashtags (max ${this.getHashtagCount(options.includeHashtags)})`);
    }

    // Add emoji instructions
    if (options.includeEmojis) {
      instructions.push('- Include relevant emojis');
    }

    // Add target audience if specified
    if (options.targetAudience) {
      instructions.push(`- Target audience: ${options.targetAudience}`);
    }

    // Add creativity level instructions
    const creativity = options.creativityLevel || 50;
    if (creativity < 33) {
      instructions.push('- Keep the tone professional and straightforward');
    } else if (creativity > 66) {
      instructions.push('- Be creative and experimental with the content');
    }

    return instructions.join('\n');
  }

  abstract generatePrompt(content: string, options?: AIGenerationOptions): string;
  abstract processResponse(response: string): PlatformPost[];
  abstract validatePost(post: PlatformPost): boolean;
}
