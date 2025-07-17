import { DEFAULT_AI_PROVIDER, GROQ_MODELS, AI_DEFAULTS } from "@/constants/ai";

export const aiConfig = {
  // Default AI provider - LOCKED TO GROQ
  defaultProvider: DEFAULT_AI_PROVIDER,

  // Provider configurations
  providers: {
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
      models: {
        chat: GROQ_MODELS.FAST,
        chatAdvanced: GROQ_MODELS.BALANCED,
        chatUltra: GROQ_MODELS.ADVANCED,
        embedding: "text-embedding-ada-002", // Fallback to OpenAI for embeddings
      },
      limits: {
        maxTokens: 8192,
        temperature: AI_DEFAULTS.TEMPERATURE,
        topP: AI_DEFAULTS.TOP_P,
        frequencyPenalty: AI_DEFAULTS.FREQUENCY_PENALTY,
        presencePenalty: AI_DEFAULTS.PRESENCE_PENALTY,
        stream: AI_DEFAULTS.STREAM,
      },
    },

    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.openai.com/v1",
      models: {
        chat: "gpt-3.5-turbo",
        chatAdvanced: "gpt-4",
        embedding: "text-embedding-ada-002",
      },
      limits: {
        maxTokens: 4000,
        temperature: 0.7,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,
      },
    },

    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: "https://api.anthropic.com",
      models: {
        chat: "claude-3-sonnet-20240229",
        chatAdvanced: "claude-3-opus-20240229",
      },
      limits: {
        maxTokens: 4000,
        temperature: 0.7,
      },
    },
  },

  // Content generation settings
  generation: {
    defaultSettings: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    },

    platformSpecific: {
      twitter: {
        maxTokens: 100,
        temperature: 0.8,
      },
      linkedin: {
        maxTokens: 800,
        temperature: 0.6,
      },
      facebook: {
        maxTokens: 600,
        temperature: 0.7,
      },
      instagram: {
        maxTokens: 600,
        temperature: 0.8,
      },
      youtube: {
        maxTokens: 1500,
        temperature: 0.6,
      },
    },
  },

  // Prompt templates
  prompts: {
    system: {
      default:
        "You are a professional content creator specializing in social media marketing. Create engaging, authentic content that resonates with the target audience.",
      marketing:
        "You are a marketing expert. Create compelling content that drives engagement and conversions while maintaining brand authenticity.",
      casual:
        "You are a friendly content creator. Write in a conversational, approachable tone that feels natural and engaging.",
      professional:
        "You are a business communication expert. Create polished, professional content suitable for corporate environments.",
    },

    formats: {
      post: "Create a {platform} post about {topic}. Make it engaging and include relevant hashtags.",
      thread: "Create a {platform} thread about {topic}. Break it into multiple connected posts.",
      story: "Create a {platform} story about {topic}. Make it visual and engaging.",
      video:
        "Create a {platform} video script about {topic}. Include engaging hooks and clear structure.",
    },
  },

  // Content moderation
  moderation: {
    enabled: true,
    filters: ["hate", "harassment", "self-harm", "sexual", "violence"],
    threshold: 0.8,
  },
} as const;

export type AIConfig = typeof aiConfig;
