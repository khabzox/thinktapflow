import { getGenerationsConfig } from '@/constants/ai/api/client';
import { APIResponse, User, GenerationRequest, GenerationResponse } from '@/types/api';

export class ThinkTapFlowAPI {
    private baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string = '/api') {
        this.baseURL = baseURL;
    }

    setToken(token: string) {
        this.token = token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...options.headers as Record<string, string>,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        return response.json();
    }

    // Auth methods
    async login(email: string, password: string) {
        return this.request<{ user: any; session: any }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async register(email: string, password: string, full_name: string) {
        return this.request<{ user: any; message: string }>('/auth/', {
            method: 'POST',
            body: JSON.stringify({ email, password, full_name }),
        });
    }

    // Generation methods
    async generatePosts(data: GenerationRequest) {
        return this.request<{
            generation_id: string;
            posts: any;
            remaining_usage: number;
        }>('/generate', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getGenerations(page = getGenerationsConfig.page, limit = getGenerationsConfig.limit) {
        return this.request<{
            generations: GenerationResponse[];
            pagination: any;
        }>(`/generations?page=${page}&limit=${limit}`);
    }

    async getUsage() {
        return this.request<{
            current_usage: number;
            usage_limit: number;
            subscription_tier: string;
            remaining: number;
            percentage: number;
            analytics: any[];
        }>('/usage');
    }

    // Subscription methods
    async updateSubscription(tier: 'free' | 'pro' | 'plus') {
        return this.request<{ user: User }>('/subscription/update', {
            method: 'POST',
            body: JSON.stringify({ tier }),
        });
    }

    // Admin methods
    async getUsers(page = 1, limit = 20) {
        return this.request<{
            users: User[];
            pagination: any;
        }>(`/admin/users?page=${page}&limit=${limit}`);
    }
}

// Usage example:
// const api = new ThinkTapFlowAPI();
// api.setToken('your-jwt-token');
// const response = await api.generatePosts({
//   content: 'Your content here',
//   platforms: ['twitter', 'linkedin'],
//   options: { includeEmojis: true }
// });