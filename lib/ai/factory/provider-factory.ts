import { createGroqProvider } from "../providers/groq-provider";
import { AIProvider } from "../core/base-ai-provider";
import { AIServiceConfig } from "@/types/ai";
import { AI_PROVIDERS, DEFAULT_AI_PROVIDER } from "@/constants/ai";

export type AIProviderType = "groq";

// Functional factory for creating AI providers (GROQ as default)
export const createAIProvider = (
  type: AIProviderType = DEFAULT_AI_PROVIDER,
  config: AIServiceConfig,
): AIProvider => {
  switch (type) {
    case AI_PROVIDERS.GROQ:
      return createGroqProvider(config);
    default:
      // Always fall back to GROQ if unsupported provider is requested
      console.warn(`Unsupported AI provider: ${type}, falling back to Groq`);
      return createGroqProvider(config);
  }
};

// Helper function to get the default provider (always Groq)
export const getDefaultAIProvider = (config: AIServiceConfig): AIProvider => {
  return createGroqProvider(config);
};

// Provider registry for dynamic provider selection
export const providerRegistry = {
  groq: createGroqProvider,
} as const;

// Get available provider types
export const getAvailableProviders = (): AIProviderType[] => {
  return Object.keys(providerRegistry) as AIProviderType[];
};

// Create provider with validation
export const createValidatedAIProvider = async (
  type: AIProviderType,
  config: AIServiceConfig,
): Promise<AIProvider> => {
  const provider = createAIProvider(type, config);

  // Validate credentials before returning
  const isValid = await provider.validateCredentials();
  if (!isValid) {
    throw new Error(`Invalid credentials for ${type} provider`);
  }

  return provider;
};

// Batch create multiple providers
export const createProviders = (
  configs: Array<{ type: AIProviderType; config: AIServiceConfig }>,
): AIProvider[] => {
  return configs.map(({ type, config }) => createAIProvider(type, config));
};
