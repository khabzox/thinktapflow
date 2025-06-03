import { AIServiceConfig, AIGenerationOptions, ModelInfo } from '@/types/ai';

export abstract class BaseAIProvider {
  protected config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  abstract generateCompletion(prompt: string, options?: AIGenerationOptions): Promise<string>;
  abstract validateCredentials(): Promise<boolean>;
  abstract getModelInfo(): ModelInfo;
}