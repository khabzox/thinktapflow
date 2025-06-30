// Main AI provider service (Functional approach with Groq as default)
export { aiProvider } from './provider';
export type { AIMessage, AIGenerationOptions, GeneratedContent } from './provider';

// Groq service (primary AI provider)
export { groqService } from './groq';
export type { GroqChatMessage, GroqCompletionOptions, GroqResponse } from './groq';

// Functional AI service factory
export { createAIService } from './ai-service';

// Factory functions for creating providers
export { createAIProvider, getDefaultAIProvider } from './factory/provider-factory';

// Re-export AI configuration and constants
export { aiConfig } from '@/config/ai';
export * from '@/constants/ai';

// Legacy exports for backward compatibility
export * from '@/types/ai';

// Import for utility functions
import { aiProvider, AIGenerationOptions } from './provider';

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