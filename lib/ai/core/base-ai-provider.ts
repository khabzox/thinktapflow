import { AIServiceConfig, AIGenerationOptions, ModelInfo } from '@/types/ai';

export interface AIProvider {
  generateCompletion(prompt: string, options?: AIGenerationOptions): Promise<string>;
  validateCredentials(): Promise<boolean>;
  getModelInfo(): ModelInfo;
}

export interface AIProviderFactory {
  (config: AIServiceConfig): AIProvider;
}

export function createBaseAIProvider(
  generateCompletion: (
    config: AIServiceConfig
  ) => (prompt: string, options?: AIGenerationOptions) => Promise<string>,
  validateCredentials: (config: AIServiceConfig) => () => Promise<boolean>,
  getModelInfo: (config: AIServiceConfig) => () => ModelInfo
): AIProviderFactory {
  return (config: AIServiceConfig): AIProvider => ({
    generateCompletion: generateCompletion(config),
    validateCredentials: validateCredentials(config),
    getModelInfo: getModelInfo(config),
  });
}
