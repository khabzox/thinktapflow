import Groq from 'groq-sdk';
import { BaseAIProvider } from '../core/base-ai-provider';
import { AIGenerationOptions, ModelInfo, AIServiceError, AIServiceConfig } from '@/types/ai';
import { DEFAULT_CONFIG } from '@/constants/ai/ai';

export class GroqProvider extends BaseAIProvider {
  private client: Groq;
  private defaultModel = DEFAULT_CONFIG.model as string;

  constructor(config: AIServiceConfig) {
    super(config);
    this.client = new Groq({ apiKey: config.apiKey });
  }

  async generateCompletion(prompt: string, options: AIGenerationOptions = {}): Promise<string> {
    const completion = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: this.config.model || this.defaultModel,
      temperature: options.temperature ?? DEFAULT_CONFIG.temperature,
      max_tokens: options.maxOutputTokens ?? DEFAULT_CONFIG.maxOutputTokens,
      top_p: options.topP ?? DEFAULT_CONFIG.topP,
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
      name: this.config.model || this.defaultModel,
      provider: 'groq',
      maxTokens: DEFAULT_CONFIG.maxTokens as number,
      contextWindow: DEFAULT_CONFIG.maxInputTokens as number,
    };
  }
}
