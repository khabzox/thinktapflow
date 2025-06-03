import * as cheerio from 'cheerio';
import { BaseContentExtractor } from './base-content-extractor';
import { ContentParsingResult, ContentParsingError } from '@/types/ai';

export class WebContentExtractor extends BaseContentExtractor {
  private readonly timeout: number;

  constructor(timeout = 10000) {
    super();
    this.timeout = timeout;
  }

  canHandle(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  async extract(url: string): Promise<ContentParsingResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ThinkTapFlow/2.0)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new ContentParsingError(`HTTP ${response.status}`, url, response.status);
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const result = this.extractFromHtml($, url);

      return {
        ...result,
        extractedAt: Date.now(),
        wordCount: this.countWords(result.content),
        readingTime: Math.ceil(this.countWords(result.content) / 200),
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private extractFromHtml($: cheerio.CheerioAPI, url: string) {
    // Remove unwanted elements
    $('script, style, nav, footer, aside, .sidebar, .advertisement').remove();

    const title = this.extractTitle($);
    const content = this.extractContent($);

    return { title, content, url };
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    const selectors = ['h1', 'title', '[property="og:title"]'];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const title = element.attr('content') || element.text();
        if (title?.trim()) return title.trim();
      }
    }

    return 'Untitled Content';
  }

  private extractContent($: cheerio.CheerioAPI): string {
    const selectors = [
      'article',
      'main',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.main-content',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const text = element.text().trim();
        if (text.length > 100) return this.cleanContent(text);
      }
    }

    return this.cleanContent($('body').text());
  }

  private cleanContent(content: string): string {
    return content
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).length;
  }
}
