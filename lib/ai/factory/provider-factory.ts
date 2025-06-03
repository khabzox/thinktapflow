import { GroqProvider } from '../providers/groq-provider';
import { OpenAIProvider } from '../providers/openai-provider';
import { BaseAIProvider } from '../core/base-ai-provider';
import { AIServiceConfig } from '@/types/ai';

export type AIProviderType = 'groq' | 'openai' | 'anthropic';

export class AIProviderFactory {
  static create(type: AIProviderType, config: AIServiceConfig): BaseAIProvider {
    switch (type) {
      case 'groq':
        return new GroqProvider(config);
      case 'openai':
        return new OpenAIProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${type}`);
    }
  }
}
