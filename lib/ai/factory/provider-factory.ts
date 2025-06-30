import { GroqProvider } from '../providers/groq-provider';
import { OpenAIProvider } from '../providers/openai-provider';
import { BaseAIProvider } from '../core/base-ai-provider';
import { AIServiceConfig } from '@/types/ai';
import { AI_PROVIDERS, DEFAULT_AI_PROVIDER } from '@/constants/ai';

export type AIProviderType = 'groq' | 'openai' | 'anthropic';

// Functional factory for creating AI providers (GROQ as default)
export const createAIProvider = (
  type: AIProviderType = DEFAULT_AI_PROVIDER, 
  config: AIServiceConfig
): BaseAIProvider => {
  switch (type) {
    case AI_PROVIDERS.GROQ:
      return new GroqProvider(config);
    case AI_PROVIDERS.OPENAI:
      return new OpenAIProvider(config);
    default:
      // Always fall back to GROQ if unsupported provider is requested
      console.warn(`Unsupported AI provider: ${type}, falling back to Groq`);
      return new GroqProvider(config);
  }
};

// Helper function to get the default provider (always Groq)
export const getDefaultAIProvider = (config: AIServiceConfig): BaseAIProvider => {
  return new GroqProvider(config);
};

// Legacy class wrapper for backward compatibility
export class AIProviderFactory {
  static create = createAIProvider;
  static getDefaultProvider = getDefaultAIProvider;
}
