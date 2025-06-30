// Main AI provider service (Functional approach with Groq as default)
export { aiProvider } from './provider';
export type { AIMessage, GeneratedContent } from './provider';

// Groq service (primary AI provider)
export { groqService } from './groq';
export type { GroqChatMessage, GroqCompletionOptions, GroqResponse } from './groq';

// Functional AI service factory
export { createAIService } from './ai-service';

// Legacy class wrapper for backward compatibility
export { AIService } from './ai-service';

// Factory functions for creating providers
export { createAIProvider, getDefaultAIProvider } from './factory/provider-factory';

// Re-export AI configuration and constants
export { aiConfig } from '@/config/ai';
export * from '@/constants/ai';

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
  ModelInfo
} from '@/types/ai';

// Import for utility functions
import { aiProvider } from './provider';
import { AIGenerationOptions } from '@/types/ai';

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
export const generateContent = (input: string, platforms: string[], options?: AIGenerationOptions) =>
  aiProvider.generateContent(input, platforms, options);

export const generateForPlatform = (input: string, platform: string, options?: AIGenerationOptions) =>
  aiProvider.generateForPlatform(input, platform, options);