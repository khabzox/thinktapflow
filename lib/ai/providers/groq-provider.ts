import Groq from 'groq-sdk';
import { AIProvider, createBaseAIProvider } from '../core/base-ai-provider';
import { AIGenerationOptions, ModelInfo, AIServiceError, AIServiceConfig } from '@/types/ai';
import { DEFAULT_CONFIG } from '@/constants/ai';

const defaultModel = DEFAULT_CONFIG.model as string;

const createGroqCompletion = (config: AIServiceConfig) => 
  async (prompt: string, options: AIGenerationOptions = {}): Promise<string> => {
    const client = new Groq({ apiKey: config.apiKey });
    
    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: config.model || defaultModel,
      temperature: options.temperature ?? DEFAULT_CONFIG.temperature,
      max_tokens: options.maxOutputTokens ?? DEFAULT_CONFIG.maxOutputTokens,
      top_p: options.topP ?? DEFAULT_CONFIG.topP,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new AIServiceError('Empty response from AI', 'EMPTY_AI_RESPONSE');

    return content;
  };

const createGroqCredentialsValidator = (config: AIServiceConfig) => 
  async (): Promise<boolean> => {
    try {
      const client = new Groq({ apiKey: config.apiKey });
      await client.models.list();
      return true;
    } catch {
      return false;
    }
  };

const createGroqModelInfo = (config: AIServiceConfig) => 
  (): ModelInfo => ({
    name: config.model || defaultModel,
    provider: 'groq',
    maxTokens: DEFAULT_CONFIG.maxTokens as number,
    contextWindow: DEFAULT_CONFIG.maxTokens as number,
  });

export const createGroqProvider = createBaseAIProvider(
  createGroqCompletion,
  createGroqCredentialsValidator,
  createGroqModelInfo
);

// Helper functions for direct usage without factory
export const createGroqCompletionService = (config: AIServiceConfig) => {
  const provider = createGroqProvider(config);
  return {
    generateCompletion: provider.generateCompletion,
    getModelInfo: provider.getModelInfo,
  };
};

export const createGroqValidator = (config: AIServiceConfig) => {
  const provider = createGroqProvider(config);
  return {
    validateCredentials: provider.validateCredentials,
    getModelInfo: provider.getModelInfo,
  };
};

// Default Groq provider with environment config
export const createDefaultGroqProvider = () => {
  const config: AIServiceConfig = {
    provider: 'groq',
    apiKey: process.env.GROQ_API_KEY || '',
    model: defaultModel,
    temperature: DEFAULT_CONFIG.temperature,
    maxTokens: DEFAULT_CONFIG.maxTokens as number,
    topP: DEFAULT_CONFIG.topP,
  };
  return createGroqProvider(config);
};
