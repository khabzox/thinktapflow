import { BaseContentExtractor } from './extractors/base-content-extractor';
import { WebContentExtractor } from './extractors/web-content-extractor';
import { ContentParsingResult, ContentParsingError } from '@/types/ai';

export class ContentService {
  private extractors: BaseContentExtractor[] = [];

  constructor() {
    this.registerExtractor(new WebContentExtractor());
  }

  registerExtractor(extractor: BaseContentExtractor): void {
    this.extractors.push(extractor);
  }

  async extractContent(url: string): Promise<ContentParsingResult> {
    const extractor = this.extractors.find((e) => e.canHandle(url));

    if (!extractor) {
      throw new ContentParsingError('No suitable extractor found', url);
    }

    return extractor.extract(url);
  }
}
