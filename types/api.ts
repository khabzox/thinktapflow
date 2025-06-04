import { GeneratedPosts } from './ai';

export interface User {
    id: string;
    email: string;
    subscription_tier: 'free' | 'pro' | 'enterprise';
    usage_count: number;
    usage_limit: number;
    created_at: string;
    updated_at: string;
}

export interface GenerationRequest {
    content: string;
    platforms: string[];
    options?: {
        temperature?: number;
        includeEmojis?: boolean;
        targetAudience?: string;
        customInstructions?: string;
    };
}

export interface GenerationResponse {
    id: string;
    user_id: string;
    posts: GeneratedPosts;
    tokens_used: number;
    created_at: string;
}

export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
    };
}