import { AIService } from './ai-service';
import type { AIProviderType } from './factory/provider-factory';
import type { AIServiceConfig } from '@/types/ai';
export * from '@/types/ai';
export * from '@/constants/ai';

// Factory function for easy instantiation
export function createAIService(
  provider: AIProviderType = 'groq',
  config?: Partial<AIServiceConfig>
): AIService {
  return new AIService(provider, config);
}