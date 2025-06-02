import Groq from 'groq-sdk';
import * as cheerio from 'cheerio';
import {
  SupportedPlatforms,
  GeneratedPosts,
  AIGenerationOptions,
  ContentParsingResult,
  PlatformPost,
  PlatformConstraints,
  AIServiceError,
  ContentParsingError,
  TokenLimitError,
  GenerationMetrics,
  AIServiceConfig,
} from '@/types/ai';


import { PLATFORM_CONSTRAINTS, DEFAULT_CONFIG, GROQ_MODELS } from '@/constants/ai';


class AIService {
  private groq: Groq;
  private config: Required<AIServiceConfig>;
  private metrics: GenerationMetrics[] = [];

  constructor(config?: Partial<AIServiceConfig>) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      apiKey: config?.apiKey || process.env.GROQ_API_KEY || '',
    };

    if (!this.config.apiKey) {
      throw new AIServiceError(
        'GROQ_API_KEY environment variable or apiKey config is required',
        'MISSING_API_KEY'
      );
    }

    // Initialize Groq client
    this.groq = new Groq({
      apiKey: this.config.apiKey,
    });
  }

  /**
   * Parse content from URL using intelligent web scraping
   */
  async parseContentFromUrl(url: string): Promise<ContentParsingResult> {
    try {
      // Validate and normalize URL
      const urlObject = new URL(url);
      if (!['http:', 'https:'].includes(urlObject.protocol)) {
        throw new ContentParsingError('Invalid URL protocol', url);
      }

      // Fetch content with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ContentSprout/2.0; +https://contentsprout.app)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ContentParsingError(
          `HTTP ${response.status}: ${response.statusText}`,
          url,
          response.status
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Enhanced content extraction
      const result = this.extractContentFromHtml($, url);

      if (!result.content || result.content.length < 100) {
        throw new ContentParsingError('Unable to extract meaningful content from URL', url);
      }

      return {
        ...result,
        extractedAt: Date.now(),
        wordCount: this.countWords(result.content),
        readingTime: Math.ceil(this.countWords(result.content) / 200), // 200 WPM
      };
    } catch (error) {
      if (error instanceof ContentParsingError) {
        throw error;
      }

      throw new ContentParsingError(
        `Failed to parse content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        url
      );
    }
  }

  private extractContentFromHtml(
    $: cheerio.CheerioAPI,
    url: string
  ): { title: string; content: string; url: string } {
    // Remove unwanted elements
    $(
      'script, style, nav, footer, aside, .sidebar, .advertisement, .ads, .social-share, .comments'
    ).remove();

    // Extract title with fallbacks
    const title = this.extractTitle($);

    // Enhanced content extraction with multiple strategies
    let extractedContent = '';

    // Strategy 1: Look for article/main content
    const articleSelectors = [
      'article[role="main"]',
      'main article',
      '[role="main"]',
      'article',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.main-content',
      '#main-content',
      '.content-body',
      'main',
    ];

    for (const selector of articleSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > extractedContent.length) {
          extractedContent = text;
        }
      }
    }

    // Strategy 2: JSON-LD structured data
    if (!extractedContent) {
      $('script[type="application/ld+json"]').each((_, element) => {
        try {
          const jsonLd = JSON.parse($(element).html() || '');
          if (jsonLd.articleBody) {
            extractedContent = jsonLd.articleBody;
          }
        } catch {
          // Ignore JSON parsing errors
        }
      });
    }

    // Strategy 3: Fallback to body with intelligent filtering
    if (!extractedContent) {
      // Remove navigation, footer, and other non-content elements
      $('header, nav, footer, .header, .footer, .navigation, .menu').remove();
      extractedContent = $('body').text().trim();
    }

    // Clean and optimize content
    extractedContent = this.cleanExtractedContent(extractedContent);

    return {
      title: title.trim(),
      content: this.truncateContent(extractedContent),
      url,
    };
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    // Multiple title extraction strategies
    const titleSelectors = [
      'h1.title',
      'h1.post-title',
      'h1.entry-title',
      'h1.article-title',
      '.page-title h1',
      'header h1',
      'h1',
      'title',
      '[property="og:title"]',
      '[name="twitter:title"]',
    ];

    for (const selector of titleSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const title = element.attr('content') || element.text();
        if (title && title.trim().length > 0) {
          return title.trim();
        }
      }
    }

    return 'Untitled Content';
  }

  private cleanExtractedContent(content: string): string {
    return content
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/\n\s*\n/g, '\n') // Remove empty lines
      .replace(/[^\S\n]+/g, ' ') // Replace other whitespace with space
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
      .trim();
  }

  /**
   * Generate optimized prompts for multiple platforms
   */
  optimizePromptForPlatforms(
    content: string,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): string {
    const truncatedContent = this.truncateContent(content);
    const platformSpecs = this.generatePlatformSpecifications(platforms);

    const basePrompt = `You are an expert social media content creator and marketing specialist. Your task is to transform the provided content into engaging, platform-specific social media posts that drive engagement and maximize reach.

CONTENT TO TRANSFORM:
${truncatedContent}

PLATFORM REQUIREMENTS:
${platformSpecs}

GENERATION RULES:
1. Create unique, engaging posts tailored to each platform's audience and format
2. Ensure all posts stay within character limits (this is CRITICAL)
3. Include relevant, trending hashtags that are currently popular
4. Vary the angle/perspective for each post - don't repeat the same message
5. Make content shareable and engagement-focused
6. Use appropriate tone for each platform
7. Include compelling call-to-action when relevant
8. Focus on value-driven content that provides insights or entertainment
${options.includeEmojis ? '9. Include relevant emojis to increase engagement and visual appeal' : ''}
${options.targetAudience ? `10. Target content specifically for: ${options.targetAudience}` : ''}
${options.customInstructions ? `11. Additional instructions: ${options.customInstructions}` : ''}

CRITICAL: You must return ONLY a valid JSON object. No additional text, explanations, or markdown formatting.

RESPONSE FORMAT:
${JSON.stringify(
  Object.fromEntries(
    platforms.map((p) => [
      p,
      [
        {
          content: 'Your engaging post content here',
          hashtags: ['#relevant', '#hashtags'],
          mentions: [],
          characterCount: 0,
        },
      ],
    ])
  ),
  null,
  2
)}

Remember: The JSON must be valid and parseable. Each post must be engaging, platform-appropriate, and within character limits.`;

    return basePrompt;
  }

  private generatePlatformSpecifications(platforms: string[]): string {
    return platforms
      .filter((p) => Object.values(SupportedPlatforms).includes(p as SupportedPlatforms))
      .map((platform) => {
        const constraints = PLATFORM_CONSTRAINTS[platform as SupportedPlatforms];
        return `${platform.toUpperCase()}:
- Generate ${constraints.maxPosts} unique posts
- Maximum ${constraints.maxLength} characters per post
- Tone: ${constraints.tone}
- Include up to ${constraints.hashtagCount} relevant hashtags
- Style: ${constraints.format}`;
      })
      .join('\n\n');
  }

  /**
   * Main function to generate social media posts with Groq
   */
  async generateSocialPosts(
    content: string,
    platforms: string[],
    options: AIGenerationOptions = {}
  ): Promise<GeneratedPosts> {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    try {
      // Input validation
      this.validateInputs(content, platforms);

      // Filter and validate platforms
      const validPlatforms = this.validatePlatforms(platforms);

      // Generate and validate prompt
      const prompt = this.optimizePromptForPlatforms(content, validPlatforms, options);
      const tokensUsed = this.estimateTokens(prompt);

      this.validateTokenLimit(tokensUsed);

      // Generate content with Groq
      const generatedData = await this.callGroqAPI(prompt, options, requestId);

      // Process and validate results
      const processedPosts = await this.processGeneratedPosts(
        generatedData,
        validPlatforms,
        content,
        tokensUsed,
        startTime
      );

      // Record metrics
      this.recordMetrics({
        requestTime: startTime,
        responseTime: Date.now(),
        tokensUsed,
        characterCount: content.length,
        platformCount: validPlatforms.length,
        success: true,
      });

      return processedPosts;
    } catch (error) {
      // Record error metrics
      this.recordMetrics({
        requestTime: startTime,
        responseTime: Date.now(),
        tokensUsed: 0,
        characterCount: content.length,
        platformCount: platforms.length,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Generate fallback content
      console.warn(`AI generation failed (${requestId}), using fallback:`, error);
      return this.generateFallbackPosts(content, platforms, startTime);
    }
  }

  private validateInputs(content: string, platforms: string[]): void {
    if (!content || content.trim().length === 0) {
      throw new AIServiceError('Content cannot be empty', 'EMPTY_CONTENT');
    }

    if (!platforms || platforms.length === 0) {
      throw new AIServiceError('At least one platform must be specified', 'NO_PLATFORMS');
    }

    if (content.length > this.config.maxContentLength * 2) {
      throw new AIServiceError(
        `Content too long. Maximum length: ${this.config.maxContentLength * 2} characters`,
        'CONTENT_TOO_LONG'
      );
    }
  }

  private validatePlatforms(platforms: string[]): string[] {
    const validPlatforms = platforms.filter((p) =>
      Object.values(SupportedPlatforms).includes(p as SupportedPlatforms)
    );

    if (validPlatforms.length === 0) {
      throw new AIServiceError(
        `No valid platforms specified. Supported: ${Object.values(SupportedPlatforms).join(', ')}`,
        'INVALID_PLATFORMS'
      );
    }

    return validPlatforms;
  }

  private validateTokenLimit(tokensUsed: number): void {
    if (tokensUsed > this.config.maxInputTokens) {
      throw new TokenLimitError(
        'Content exceeds token limit',
        tokensUsed,
        this.config.maxInputTokens
      );
    }
  }

  private async callGroqAPI(
    prompt: string,
    options: AIGenerationOptions,
    requestId: string
  ): Promise<Record<string, unknown>> {
    try {
      console.debug(`Calling Groq API with request ID: ${requestId}`);

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: this.config.model,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxOutputTokens ?? 2048,
        top_p: options.topP ?? 0.8,
        stream: false,
      });

      const responseText = completion.choices[0]?.message?.content;

      if (!responseText) {
        throw new AIServiceError('Empty response from Groq AI', 'EMPTY_AI_RESPONSE');
      }

      return this.parseAIResponse(responseText);
    } catch (error) {
      console.error(`Groq API call failed for request ${requestId}:`, error);

      // Handle specific Groq errors
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          throw new AIServiceError(
            'Rate limit exceeded. Please try again later.',
            'RATE_LIMIT_ERROR'
          );
        }
        if (error.message.includes('authentication')) {
          throw new AIServiceError('Invalid API key or authentication failed', 'AUTH_ERROR');
        }
      }

      throw new AIServiceError(
        `Groq API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AI_API_ERROR'
      );
    }
  }

  private parseAIResponse(response: string): Record<string, unknown> {
    try {
      // Clean the response - remove markdown code blocks and extra whitespace
      const cleanResponse = response
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove any text before first {
        .replace(/[^}]*$/, '') // Remove any text after last }
        .trim();

      const parsed = JSON.parse(cleanResponse) as Record<string, unknown>;

      // Basic structure validation
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Response is not a valid object');
      }

      return parsed;
    } catch (error) {
      console.error('Failed to parse AI response:', response);
      throw new AIServiceError(
        `Failed to parse AI response: ${error instanceof Error ? error.message : 'Invalid JSON'}`,
        'PARSE_ERROR'
      );
    }
  }

  private async processGeneratedPosts(
    generatedData: Record<string, unknown>,
    platforms: string[],
    originalContent: string,
    tokensUsed: number,
    startTime: number
  ): Promise<GeneratedPosts> {
    const processedPosts: GeneratedPosts = {
      metadata: {
        originalContent: originalContent.substring(0, 500),
        tokensUsed,
        generationTime: Date.now() - startTime,
        platforms,
        model: this.config.model,
        timestamp: Date.now(),
      },
    } as GeneratedPosts;

    // Process each platform's posts
    for (const platform of platforms) {
      const platformKey = platform as SupportedPlatforms;
      const constraints = PLATFORM_CONSTRAINTS[platformKey];
      const rawPosts = generatedData[platform] as unknown[];

      if (!Array.isArray(rawPosts)) {
        console.warn(`Invalid posts structure for ${platform}, skipping`);
        continue;
      }

      const processedPlatformPosts: PlatformPost[] = rawPosts
        .slice(0, constraints.maxPosts)
        .map((post: unknown) => this.processPost(post, constraints))
        .filter((post) => post.content.length > 0 && post.content.length <= constraints.maxLength);

      if (processedPlatformPosts.length > 0) {
        processedPosts[platformKey] = processedPlatformPosts;
      }
    }

    // Ensure we have at least one valid post
    if (Object.keys(processedPosts).filter((k) => k !== 'metadata').length === 0) {
      throw new AIServiceError('No valid posts generated', 'NO_VALID_POSTS');
    }

    return processedPosts;
  }

  private processPost(post: unknown, constraints: PlatformConstraints): PlatformPost {
    // Type guard to ensure post is an object with expected properties
    const postObj = post as Record<string, unknown>;
    let content = (postObj.content || '').toString().trim();

    // Ensure content doesn't exceed platform limits
    if (content.length > constraints.maxLength) {
      // Try to truncate at sentence boundary
      const truncated = content.substring(0, constraints.maxLength - 3);
      const lastSentence = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?')
      );

      if (lastSentence > constraints.maxLength * 0.8) {
        content = truncated.substring(0, lastSentence + 1);
      } else {
        content = truncated + '...';
      }
    }

    return {
      content,
      hashtags: Array.isArray(postObj.hashtags)
        ? (postObj.hashtags as string[])
            .slice(0, constraints.hashtagCount)
            .filter((tag: string) => typeof tag === 'string' && tag.startsWith('#'))
        : [],
      mentions: Array.isArray(postObj.mentions)
        ? (postObj.mentions as string[]).filter((mention: string) => typeof mention === 'string')
        : [],
      characterCount: content.length,
    };
  }

  /**
   * Generate fallback posts when AI fails
   */
  private generateFallbackPosts(
    content: string,
    platforms: string[],
    startTime: number
  ): GeneratedPosts {
    const fallbackPosts: GeneratedPosts = {
      metadata: {
        originalContent: content.substring(0, 500),
        tokensUsed: 0,
        generationTime: Date.now() - startTime,
        platforms,
        model: 'fallback',
        timestamp: Date.now(),
      },
    } as GeneratedPosts;

    const excerpt = this.createSmartExcerpt(content, 200);

    platforms.forEach((platform) => {
      const platformKey = platform as SupportedPlatforms;
      const constraints = PLATFORM_CONSTRAINTS[platformKey];

      if (!constraints) return;

      const posts: PlatformPost[] = [];

      // Generate basic fallback posts
      for (let i = 0; i < Math.min(2, constraints.maxPosts); i++) {
        let postContent =
          i === 0
            ? `${excerpt} #ContentSprout #${platform}`
            : `Check out this content: ${excerpt.substring(0, 100)}... #${platform}`;

        if (postContent.length > constraints.maxLength) {
          postContent = postContent.substring(0, constraints.maxLength - 3) + '...';
        }

        posts.push({
          content: postContent,
          hashtags: [`#${platform}`, '#content', '#ContentSprout'],
          mentions: [],
          characterCount: postContent.length,
        });
      }

      fallbackPosts[platformKey] = posts;
    });

    return fallbackPosts;
  }

  private createSmartExcerpt(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;

    // Try to end at sentence boundary
    const truncated = content.substring(0, maxLength);
    const lastSentence = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1);
    }

    return truncated + '...';
  }

  /**
   * Utility functions
   */
  private truncateContent(content: string): string {
    if (content.length <= this.config.maxContentLength) {
      return content;
    }

    return this.createSmartExcerpt(content, this.config.maxContentLength);
  }

  private estimateTokens(text: string): number {
    // Rough estimation for Llama models: 1 token ≈ 3.5 characters for English text
    // Add buffer for JSON structure and instructions
    return Math.ceil((text.length / 3.5) * 1.2);
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }

  private recordMetrics(metrics: GenerationMetrics): void {
    this.metrics.push(metrics);

    // Keep only last 100 metrics to prevent memory issues
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * Public utility methods
   */
  getPlatformConstraints(platform: SupportedPlatforms): PlatformConstraints {
    return PLATFORM_CONSTRAINTS[platform];
  }

  validateContentForPlatform(content: string, platform: SupportedPlatforms): boolean {
    const constraints = PLATFORM_CONSTRAINTS[platform];
    return content.length <= constraints.maxLength;
  }

  getMetrics(): GenerationMetrics[] {
    return [...this.metrics];
  }

  getSupportedPlatforms(): SupportedPlatforms[] {
    return Object.values(SupportedPlatforms);
  }

  /**
   * Get available Groq models
   */
  getAvailableModels(): typeof GROQ_MODELS {
    return GROQ_MODELS;
  }

  /**
   * Switch model dynamically
   */
  setModel(model: string): void {
    this.config.model = model;
  }
}

// Export singleton instance with factory function for custom configs
let defaultInstance: AIService | null = null;

export function createAIService(config?: Partial<AIServiceConfig>): AIService {
  return new AIService(config);
}

export function getAIService(): AIService {
  if (!defaultInstance) {
    defaultInstance = new AIService();
  }
  return defaultInstance;
}

// Export main functions
const aiService = getAIService();
export const generateSocialPosts = aiService.generateSocialPosts.bind(aiService);
export const parseContentFromUrl = aiService.parseContentFromUrl.bind(aiService);
export const optimizePromptForPlatforms = aiService.optimizePromptForPlatforms.bind(aiService);

// Export utility functions
export const getPlatformConstraints = aiService.getPlatformConstraints.bind(aiService);
export const validateContentForPlatform = aiService.validateContentForPlatform.bind(aiService);
export const getSupportedPlatforms = aiService.getSupportedPlatforms.bind(aiService);

// Export the service class for advanced usage
export { AIService };

// Export default instance
export default aiService;
