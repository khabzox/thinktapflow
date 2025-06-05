import { NextRequest, NextResponse } from 'next/server';
import { GenerationError } from '@/lib/api/errors';

export const runtime = 'edge';

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        if (!body.url) {
            throw new GenerationError('URL is required', 'INVALID_REQUEST', 400);
        }

        // Validate URL format
        try {
            new URL(body.url);
        } catch {
            throw new GenerationError('Invalid URL format', 'INVALID_URL', 400);
        }

        // Add basic security check for URL
        const url = body.url.toLowerCase();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new GenerationError('Invalid URL protocol', 'INVALID_URL', 400);
        }

        const result = await extractContent(body.url);

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('API Error:', error);
        
        // Enhanced error handling
        const errorMessage = error instanceof Error ? error.message : 'Failed to extract content';
        const errorCode = error instanceof GenerationError ? error.code : 'UNKNOWN_ERROR';
        const statusCode = error instanceof GenerationError ? error.statusCode : 500;

        return NextResponse.json({
            success: false,
            error: {
                message: errorMessage,
                code: errorCode,
                details: {
                    timestamp: new Date().toISOString()
                }
            }
        }, {
            status: statusCode
        });
    }
} 