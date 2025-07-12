'use server';

import { GenerationError } from '@/lib/api/errors';

// Types for better type safety
interface ExtractedContent {
  content: string;
  title: string;
  description: string;
  metadata: {
    author: string;
    url: string;
    date: string;
    originalLength: number;
    wordCount: number;
  };
}

interface ExtractionResult {
  success: boolean;
  data?: ExtractedContent;
  error?: {
    message: string;
    code: string;
    details?: {
      timestamp: string;
    };
  };
}

// Constants
const MAX_CONTENT_LENGTH = 5000;
const FETCH_TIMEOUT = 10000; // 10 seconds
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

// HTML entity mapping for better decoding
const HTML_ENTITIES = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&apos;': "'",
  '&hellip;': '...',
  '&mdash;': '—',
  '&ndash;': '–',
  '&rsquo;': "'",
  '&lsquo;': "'",
  '&rdquo;': '"',
  '&ldquo;': '"',
} as const;

// Patterns to remove common non-content elements
const NOISE_PATTERNS = [
  /menu|navigation|sidebar|footer|header|copyright|cookie|privacy|terms/gi,
  /skip to|jump to|back to top|read more|continue reading/gi,
  /share|tweet|facebook|linkedin|pinterest|instagram/gi,
  /advertisement|ads|sponsored|affiliate/gi,
  /loading|please wait|javascript|cookies required/gi,
];

/**
 * Validates URL format and security
 */
function validateUrl(url: string): { isValid: boolean; error?: string } {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url.trim());

    if (!ALLOWED_PROTOCOLS.includes(urlObj.protocol)) {
      return { isValid: false, error: 'Invalid URL protocol' };
    }

    // Block localhost and private IP ranges for security
    const hostname = urlObj.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2\d|3[01])\./)
    ) {
      return { isValid: false, error: 'URL not allowed' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Decodes HTML entities using predefined mapping
 */
function decodeHtmlEntities(text: string): string {
  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => {
    return HTML_ENTITIES[entity as keyof typeof HTML_ENTITIES] || entity;
  });
}

/**
 * Extracts metadata from HTML using regex patterns
 */
function extractMetadata(html: string) {
  const extractMeta = (pattern: RegExp) => {
    const match = html.match(pattern);
    return match ? match[1].trim() : '';
  };

  return {
    title: extractMeta(/<title[^>]*>([^<]+)<\/title>/i),
    description:
      extractMeta(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i) ||
      extractMeta(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/i),
    author:
      extractMeta(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i) ||
      extractMeta(/<meta[^>]*property="article:author"[^>]*content="([^"]*)"[^>]*>/i),
  };
}

/**
 * Cleans and processes extracted content
 */
function processContent(content: string): string {
  // Remove noise patterns
  let cleanContent = content;
  NOISE_PATTERNS.forEach((pattern) => {
    cleanContent = cleanContent.replace(pattern, ' ');
  });

  return cleanContent
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Extracts content from HTML string
 */
function extractContentFromHtml(html: string): string {
  return (
    html
      // Remove script tags and their content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove style tags and their content
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove all HTML tags
      .replace(/<[^>]+>/g, ' ')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Main content extraction function
 */
async function extractContent(url: string): Promise<ExtractedContent> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ContentExtractor/1.0)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new GenerationError(
        `HTTP ${response.status}: ${response.statusText}`,
        'FETCH_ERROR',
        response.status
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('text/html')) {
      throw new GenerationError('URL does not point to HTML content', 'INVALID_CONTENT_TYPE', 400);
    }

    const html = await response.text();

    // Extract metadata
    const metadata = extractMetadata(html);

    // Extract and clean content
    let content = extractContentFromHtml(html);
    content = decodeHtmlEntities(content);
    content = processContent(content);

    // Truncate if too long
    const originalLength = content.length;
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.substring(0, MAX_CONTENT_LENGTH) + '...';
    }

    // Calculate word count
    const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;

    return {
      content,
      title: metadata.title,
      description: metadata.description,
      metadata: {
        author: metadata.author,
        url,
        date: new Date().toISOString(),
        originalLength,
        wordCount,
      },
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof GenerationError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new GenerationError(
          'Request timeout - URL took too long to respond',
          'TIMEOUT_ERROR',
          408
        );
      }

      throw new GenerationError(
        `Failed to extract content: ${error.message}`,
        'EXTRACTION_FAILED',
        500
      );
    }

    throw new GenerationError(
      'Unknown error occurred during content extraction',
      'UNKNOWN_ERROR',
      500
    );
  }
}

/**
 * Server action for extracting content from URL
 */
export async function extractContentFromUrl(formData: FormData): Promise<ExtractionResult> {
  try {
    const url = formData.get('url') as string;

    // Validate URL
    const validation = validateUrl(url);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          message: validation.error!,
          code: validation.error === 'URL is required' ? 'INVALID_REQUEST' : 'INVALID_URL',
        },
      };
    }

    // Extract content
    const result = await extractContent(url);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Content extraction error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to extract content';
    const errorCode = error instanceof GenerationError ? error.code : 'UNKNOWN_ERROR';

    return {
      success: false,
      error: {
        message: errorMessage,
        code: errorCode,
        details: {
          timestamp: new Date().toISOString(),
        },
      },
    };
  }
}
