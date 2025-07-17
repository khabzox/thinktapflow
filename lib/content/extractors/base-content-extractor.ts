import { ContentParsingResult } from "@/types/ai";

export abstract class BaseContentExtractor {
  abstract canHandle(url: string): boolean;
  abstract extract(url: string): Promise<ContentParsingResult>;
}
