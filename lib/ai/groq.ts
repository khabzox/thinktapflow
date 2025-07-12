import { aiConfig } from '@/config/ai';
import { config } from '@/config/env';

export interface GroqChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
  stop?: string[];
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Configuration interface for Groq service
export interface GroqServiceConfig {
  apiKey: string;
  baseURL: string;
  defaultModel: string;
}

// Create default configuration
const createDefaultConfig = (): GroqServiceConfig => {
  if (!config.ai.groq.apiKey) {
    throw new Error('Groq API key is required');
  }

  return {
    apiKey: config.ai.groq.apiKey,
    baseURL: aiConfig.providers.groq.baseURL,
    defaultModel: aiConfig.providers.groq.models.chat,
  };
};

// Helper function to build system prompt
const buildSystemPrompt = (platform: string, options: any): string => {
  let systemPrompt: string = aiConfig.prompts.system.default;

  if (options.tone === 'professional') {
    systemPrompt = aiConfig.prompts.system.professional;
  } else if (options.tone === 'casual') {
    systemPrompt = aiConfig.prompts.system.casual;
  } else if (options.tone === 'marketing') {
    systemPrompt = aiConfig.prompts.system.marketing;
  }

  return `${systemPrompt}\n\nYou are creating content specifically for ${platform}. Follow the platform's best practices and character limits.`;
};

// Helper function to build user prompt
const buildUserPrompt = (content: string, platform: string, options: any): string => {
  let prompt = `Create engaging ${platform} content based on: ${content}`;

  if (options.contentType) {
    prompt += `\nContent type: ${options.contentType}`;
  }

  if (options.includeHashtags) {
    prompt += '\nInclude relevant hashtags.';
  }

  if (options.includeEmojis) {
    prompt += '\nInclude appropriate emojis.';
  }

  if (options.tone) {
    prompt += `\nTone: ${options.tone}`;
  }

  return prompt;
};

// Create chat completion function
export const createChatCompletion =
  (config: GroqServiceConfig) =>
  async (
    messages: GroqChatMessage[],
    options: GroqCompletionOptions = {}
  ): Promise<GroqResponse> => {
    const requestBody = {
      model: options.model || config.defaultModel,
      messages,
      temperature: options.temperature || aiConfig.providers.groq.limits.temperature,
      max_tokens: options.maxTokens || aiConfig.providers.groq.limits.maxTokens,
      top_p: options.topP || aiConfig.providers.groq.limits.topP,
      frequency_penalty: aiConfig.providers.groq.limits.frequencyPenalty,
      presence_penalty: aiConfig.providers.groq.limits.presencePenalty,
      stream: options.stream || false,
      stop: options.stop,
    };

    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API error: ${response.status} - ${error.message || response.statusText}`
      );
    }

    return response.json();
  };

// Generate completion function
export const generateCompletion =
  (config: GroqServiceConfig) =>
  async (prompt: string, options: GroqCompletionOptions = {}): Promise<string> => {
    const messages: GroqChatMessage[] = [
      {
        role: 'user',
        content: prompt,
      },
    ];

    const chatCompletion = createChatCompletion(config);
    const response = await chatCompletion(messages, options);
    return response.choices[0]?.message?.content || '';
  };

// Generate content for platform function
export const generateContentForPlatform =
  (config: GroqServiceConfig) =>
  async (
    content: string,
    platform: string,
    options: {
      tone?: string;
      includeHashtags?: boolean;
      includeEmojis?: boolean;
      contentType?: string;
    } = {}
  ): Promise<string> => {
    const platformConfig =
      aiConfig.generation.platformSpecific[
        platform as keyof typeof aiConfig.generation.platformSpecific
      ];

    const systemPrompt = buildSystemPrompt(platform, options);
    const userPrompt = buildUserPrompt(content, platform, options);

    const messages: GroqChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const completionOptions: GroqCompletionOptions = {
      temperature: platformConfig?.temperature || aiConfig.generation.defaultSettings.temperature,
      maxTokens: platformConfig?.maxTokens || aiConfig.generation.defaultSettings.maxTokens,
    };

    const chatCompletion = createChatCompletion(config);
    const response = await chatCompletion(messages, completionOptions);
    return response.choices[0]?.message?.content || '';
  };

// Stream chat completion function
export const streamChatCompletion =
  (config: GroqServiceConfig) =>
  async (
    messages: GroqChatMessage[],
    options: GroqCompletionOptions = {},
    onChunk: (chunk: string) => void
  ): Promise<void> => {
    const requestBody = {
      model: options.model || config.defaultModel,
      messages,
      temperature: options.temperature || aiConfig.providers.groq.limits.temperature,
      max_tokens: options.maxTokens || aiConfig.providers.groq.limits.maxTokens,
      stream: true,
    };

    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (error) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  };

// Health check function
export const healthCheck = (config: GroqServiceConfig) => async (): Promise<boolean> => {
  try {
    const generateCompletionFn = generateCompletion(config);
    const response = await generateCompletionFn('Hello', { maxTokens: 10 });
    return response.length > 0;
  } catch (error) {
    console.error('Groq health check failed:', error);
    return false;
  }
};

// Get models function
export const getModels = (config: GroqServiceConfig) => async (): Promise<string[]> => {
  try {
    const response = await fetch(`${config.baseURL}/models`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((model: any) => model.id) || [];
  } catch (error) {
    console.error('Failed to fetch Groq models:', error);
    return Object.values(aiConfig.providers.groq.models);
  }
};

// Create a complete Groq service with all functions
export const createGroqService = (serviceConfig?: Partial<GroqServiceConfig>) => {
  const config = { ...createDefaultConfig(), ...serviceConfig };

  return {
    createChatCompletion: createChatCompletion(config),
    generateCompletion: generateCompletion(config),
    generateContentForPlatform: generateContentForPlatform(config),
    streamChatCompletion: streamChatCompletion(config),
    healthCheck: healthCheck(config),
    getModels: getModels(config),
    config,
  };
};

// Default service instance using environment configuration
export const groqService = createGroqService();
