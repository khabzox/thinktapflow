import OpenAI from 'openai';
import { BaseAIProvider } from '../core/base-ai-provider';
import { AIGenerationOptions, ModelInfo, AIServiceError, AIServiceConfig } from '@/types/ai';

export class OpenAIProvider extends BaseAIProvider {
  private client: OpenAI;

  constructor(config: AIServiceConfig) {
    super(config);
    this.client = new OpenAI({ apiKey: config.apiKey });
  }

  async generateCompletion(prompt: string, options: AIGenerationOptions = {}): Promise<string> {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.config.model || 'gpt-3.5-turbo',
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? 2048,
      top_p: options.topP ?? 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new AIServiceError('Empty response from AI', 'EMPTY_AI_RESPONSE');

    return content;
  }

  async validateCredentials(): Promise<boolean> {
    try {
      await this.client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  getModelInfo(): ModelInfo {
    return {
      name: this.config.model || 'gpt-3.5-turbo',
      provider: 'openai',
      maxTokens: 4096,
      contextWindow: 16384,
    };
  }
}