import {
  SupportedPlatforms,
  PlatformConstraints,
  PlatformPost,
  AIGenerationOptions,
} from '@/types/ai';
import { PLATFORM_CONSTRAINTS } from '@/constants/ai';

export abstract class BasePostGenerator {
  protected platform: SupportedPlatforms;
  protected constraints: PlatformConstraints;

  constructor(platform: SupportedPlatforms) {
    this.platform = platform;
    this.constraints = PLATFORM_CONSTRAINTS[platform];
  }

  abstract generatePrompt(content: string, options?: AIGenerationOptions): string;
  abstract processResponse(response: string): PlatformPost[];
  abstract validatePost(post: PlatformPost): boolean;
}
