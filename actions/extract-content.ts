'use server';

import { GenerationError } from '@/lib/api/errors';

async function extractContent(url: string) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Basic content extraction using regex patterns
        let content = html
            // Remove script tags and their content
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Remove style tags and their content
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            // Remove HTML comments
            .replace(/<!--[\s\S]*?-->/g, '')
            // Remove all HTML tags
            .replace(/<[^>]+>/g, ' ')
            // Replace multiple spaces, newlines, and tabs with a single space
            .replace(/\s+/g, ' ')
            // Decode HTML entities
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .trim();

        // Extract title using regex
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract meta description using regex
        const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
        const description = descriptionMatch ? descriptionMatch[1].trim() : '';

        // Extract meta author using regex
        const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"[^>]*>/i);
        const author = authorMatch ? authorMatch[1].trim() : '';

        // Clean up the content
        content = content
            // Remove excessive whitespace
            .replace(/\s+/g, ' ')
            // Remove common navigation text patterns
            .replace(/menu|navigation|sidebar|footer|header|copyright/gi, '')
            // Trim again
            .trim();

        // If content is too long, take a reasonable excerpt
        const maxLength = 5000;
        if (content.length > maxLength) {
            content = content.substring(0, maxLength) + '...';
        }

        return {
            content,
            title,
            description,
            metadata: {
                author,
                url,
                date: new Date().toISOString(),
                originalLength: content.length
            }
        };
    } catch (error) {
        console.error('Content extraction error:', error);
        throw new GenerationError(
            'Failed to extract content from URL',
            'EXTRACTION_FAILED',
            500
        );
    }
}

export async function extractContentFromUrl(formData: FormData) {
    try {
        const url = formData.get('url') as string;
        
        if (!url) {
            return {
                success: false,
                error: {
                    message: 'URL is required',
                    code: 'INVALID_REQUEST'
                }
            };
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return {
                success: false,
                error: {
                    message: 'Invalid URL format',
                    code: 'INVALID_URL'
                }
            };
        }

        // Add basic security check for URL
        const urlLower = url.toLowerCase();
        if (!urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
            return {
                success: false,
                error: {
                    message: 'Invalid URL protocol',
                    code: 'INVALID_URL'
                }
            };
        }

        const result = await extractContent(url);

        return {
            success: true,
            data: result
        };
    } catch (error) {
        console.error('Action Error:', error);
        
        // Enhanced error handling
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract content';
        const errorCode = error instanceof GenerationError ? error.code : 'UNKNOWN_ERROR';

        return {
            success: false,
            error: {
                message: errorMessage,
                code: errorCode,
                details: {
                    timestamp: new Date().toISOString()
                }
            }
        };
    }
}
