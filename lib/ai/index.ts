// Main AI provider service (Functional approach with Groq as default)
export {
  aiProvider,
  createAIProviderService,
  createContentGenerator,
  createContentImprover,
  createTemplateGenerator,
  generateContentForPlatforms,
  generateSinglePlatformContent,
  checkAIProviderHealth,
} from "./provider";
export type {
  AIMessage,
  GeneratedContent,
  AIProviderServiceInterface,
  ContentGeneratorInterface,
  ContentImproverInterface,
  TemplateGeneratorInterface,
} from "./provider";

// Groq service (primary AI provider) - both functional and service object
export {
  groqService,
  createGroqService,
  createChatCompletion,
  generateCompletion,
  generateContentForPlatform,
  streamChatCompletion,
  healthCheck,
  getModels,
} from "./groq";
export type {
  GroqChatMessage,
  GroqCompletionOptions,
  GroqResponse,
  GroqServiceConfig,
} from "./groq";

// Functional AI service factory and utilities
export {
  createAIService,
  createContentParser,
  createSocialGenerator,
  createDefaultAIService,
} from "./ai-service";
export type { AIServiceInterface } from "./ai-service";

// Factory functions for creating providers (functional approach)
export {
  createAIProvider,
  getDefaultAIProvider,
  getAvailableProviders,
  createValidatedAIProvider,
  createProviders,
  providerRegistry,
} from "./factory/provider-factory";

// Re-export AI configuration and constants
export { aiConfig } from "@/config/ai";
export * from "@/constants/ai";

// Explicit re-exports from types to avoid conflicts
export type {
  AIProviderType,
  DefaultAIProvider,
  SupportedPlatforms,
  AIServiceConfig,
  AIGenerationOptions,
  ContentParsingResult,
  GeneratedPosts,
  GenerationMetrics,
  ModelInfo,
} from "@/types/ai";

// Import for utility functions
import { aiProvider } from "./provider";
import { AIGenerationOptions } from "@/types/ai";

// Utility functions (Groq-first)
export const getAIProvider = () => aiProvider;
export const isAIHealthy = () => aiProvider.healthCheck();
export const getProviderInfo = () => aiProvider.getProvider();

// Groq-first utility functions
export const getGroqProvider = () => aiProvider; // Always returns Groq since it's default
export const isGroqConfigured = () => {
  return process.env.GROQ_API_KEY !== undefined;
};

// Quick generation helpers
export const generateContent = (
  input: string,
  platforms: string[],
  options?: AIGenerationOptions,
) => aiProvider.generateContent(input, platforms, options);

export const generateForPlatform = (
  input: string,
  platform: string,
  options?: AIGenerationOptions,
) => aiProvider.generateForPlatform(input, platform, options);
