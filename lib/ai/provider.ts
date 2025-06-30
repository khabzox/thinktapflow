import { groqService, GroqChatMessage } from './groq';
import { aiConfig } from '@/config/ai';
import { 
  DEFAULT_AI_PROVIDER, 
  AI_MODELS, 
  AI_TONES, 
  CONTENT_TYPES, 
  AI_LIMITS,
  AI_ERRORS 
} from '@/constants/ai';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIGenerationOptions {
  platform?: string;
  tone?: keyof typeof AI_TONES;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  contentType?: keyof typeof CONTENT_TYPES;
  temperature?: number;
  maxTokens?: number;
  model?: keyof typeof AI_MODELS;
}

export interface GeneratedContent {
  content: string;
  platform: string;
  hashtags?: string[];
  mentions?: string[];
  metadata: {
    model: string;
    tokens?: number;
    timestamp: number;
    characterCount: number;
    formattedDate?: string;
  };
}

// Functional AI Provider Service (GROQ as default)
const createAIProviderService = () => {
  const defaultProvider = DEFAULT_AI_PROVIDER; // LOCKED TO GROQ

  const selectModel = (preference?: keyof typeof AI_MODELS): string => {
    if (!preference) {
      return aiConfig.providers.groq.models.chatUltra; // Default to ADVANCED/Ultra
    }
    
    switch (preference) {
      case 'FAST':
        return aiConfig.providers.groq.models.chat;
      case 'ADVANCED':
        return aiConfig.providers.groq.models.chatAdvanced;
      case 'ULTRA':
        return aiConfig.providers.groq.models.chatUltra;
      case 'BALANCED':
      default:
        return aiConfig.providers.groq.models.chatUltra;
    }
  };

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches ? [...new Set(matches.map(tag => tag.slice(1)))] : [];
  };

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@[\w]+/g;
    const matches = content.match(mentionRegex);
    return matches ? [...new Set(matches)] : [];
  };

  const getMaxTokensForPlatform = (platform: string): number => {
    const platformConfig = aiConfig.generation.platformSpecific[platform as keyof typeof aiConfig.generation.platformSpecific];
    return platformConfig?.maxTokens || aiConfig.generation.defaultSettings.maxTokens;
  };

  const buildTemplatePrompt = (templateId: string, variables: Record<string, string>): string => {
    let prompt = `Generate content using template ${templateId}`;
    
    Object.entries(variables).forEach(([key, value]) => {
      prompt += ` with ${key}: ${value}`;
    });

    return prompt;
  };

  const generateContent = async (
    input: string,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> => {
    const results: GeneratedContent[] = [];

    for (const platform of platforms) {
      try {
        const content = await generateForPlatform(input, platform, options);
        results.push(content);
      } catch (error) {
        console.error(`Failed to generate content for ${platform}:`, error);
        // Continue with other platforms
      }
    }

    return results;
  };

  const generateForPlatform = async (
    input: string,
    platform: string,
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent> => {
    const model = selectModel(options.model);
    const content = await groqService.generateContentForPlatform(
      input,
      platform,
      {
        tone: options.tone,
        includeHashtags: options.includeHashtags,
        includeEmojis: options.includeEmojis,
        contentType: options.contentType,
      }
    );

    // Extract hashtags and mentions if they exist
    const hashtags = extractHashtags(content);
    const mentions = extractMentions(content);

    return {
      content: content.trim(),
      platform,
      hashtags,
      mentions,
      metadata: {
        model,
        timestamp: Date.now(),
        characterCount: content.trim().length,
        formattedDate: new Date().toLocaleString()
      },
    };
  };

  const generateVariations = async (
    originalContent: string,
    platform: string,
    count: number = 3,
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> => {
    const variations: GeneratedContent[] = [];

    for (let i = 0; i < count; i++) {
      try {
        const variationPrompt = `Create a variation of this ${platform} content: "${originalContent}". Make it unique while maintaining the same message and tone.`;
        
        const content = await groqService.generateCompletion(variationPrompt, {
          temperature: 0.8 + (i * 0.1), // Increase randomness for each variation
          maxTokens: getMaxTokensForPlatform(platform),
        });

        const hashtags = extractHashtags(content);
        const mentions = extractMentions(content);

        variations.push({
          content: content.trim(),
          platform,
          hashtags,
          mentions,
          metadata: {
            model: selectModel(options.model),
            timestamp: Date.now(),
            characterCount: content.trim().length,
            formattedDate: new Date().toLocaleString()
          },
        });
      } catch (error) {
        console.error(`Failed to generate variation ${i + 1}:`, error);
      }
    }

    return variations;
  };

  const improveContent = async (
    content: string,
    platform: string,
    improvements: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent> => {
    const improvementPrompts = improvements.join(', ');
    const prompt = `Improve this ${platform} content by: ${improvementPrompts}. Original content: "${content}"`;

    const improvedContent = await groqService.generateCompletion(prompt, {
      temperature: options.temperature || 0.7,
      maxTokens: getMaxTokensForPlatform(platform),
    });

    const hashtags = extractHashtags(improvedContent);
    const mentions = extractMentions(improvedContent);

    return {
      content: improvedContent.trim(),
      platform,
      hashtags,
      mentions,
      metadata: {
        model: selectModel(options.model),
        timestamp: Date.now(),
        characterCount: improvedContent.trim().length,
        formattedDate: new Date().toLocaleString()
      },
    };
  };

  const generateFromTemplate = async (
    templateId: string,
    variables: Record<string, string>,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> => {
    const prompt = buildTemplatePrompt(templateId, variables);
    return generateContent(prompt, platforms, options);
  };

  const healthCheck = async (): Promise<{ status: string; provider: string; available: boolean }> => {
    try {
      const isHealthy = await groqService.healthCheck();
      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        provider: defaultProvider,
        available: isHealthy,
      };
    } catch (error) {
      return {
        status: 'error',
        provider: defaultProvider,
        available: false,
      };
    }
  };

  return {
    generateContent,
    generateForPlatform,
    generateVariations,
    improveContent,
    generateFromTemplate,
    healthCheck,
    getProvider: () => defaultProvider
  };
};

// Create and export the functional AI provider service
export const aiProvider = createAIProviderService();

// Legacy class wrapper for backward compatibility
export class AIProviderService {
  private service: ReturnType<typeof createAIProviderService>;

  constructor() {
    this.service = createAIProviderService();
  }

  async generateContent(
    input: string,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> {
    return this.service.generateContent(input, platforms, options);
  }

  async generateForPlatform(
    input: string,
    platform: string,
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent> {
    return this.service.generateForPlatform(input, platform, options);
  }

  async generateVariations(
    originalContent: string,
    platform: string,
    count: number = 3,
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> {
    return this.service.generateVariations(originalContent, platform, count, options);
  }

  async improveContent(
    content: string,
    platform: string,
    improvements: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent> {
    return this.service.improveContent(content, platform, improvements, options);
  }

  async generateFromTemplate(
    templateId: string,
    variables: Record<string, string>,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedContent[]> {
    return this.service.generateFromTemplate(templateId, variables, platforms, options);
  }

  async healthCheck(): Promise<{ status: string; provider: string; available: boolean }> {
    return this.service.healthCheck();
  }
}
