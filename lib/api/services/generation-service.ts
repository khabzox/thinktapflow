import { createServerClient } from '@/lib/supabase';
import { AIService } from '@/lib/ai';
import { cookies } from 'next/headers';
import { GenerationError } from '../errors';
import { SubscriptionTier } from '@/types/subscription';
import { GeneratedPosts, SupportedPlatforms } from '@/types/ai';
import { Database } from '@/types/supabase';

export class GenerationService {
  private supabase;
  private aiService: AIService;

  constructor() {
    this.supabase = createServerClient(cookies());
    this.aiService = new AIService('groq');
  }

  async generatePosts(
    userId: string,
    content: string,
    platforms: SupportedPlatforms[]
  ): Promise<GeneratedPosts> {
    try {
      // Check subscription and usage limits
      const { remaining, allowed } = await this.checkUsageLimits(userId);
      if (remaining <= 0) {
        throw new GenerationError(
          'Monthly generation limit reached',
          'LIMIT_REACHED',
          429
        );
      }

      // Generate posts
      const result = await this.aiService.generateSocialPosts(content, platforms);

      // Save generation to database
      await this.saveGeneration(userId, content, result, platforms);

      // Update usage tracking
      await this.updateUsage(userId);

      return result;
    } catch (error) {
      if (error instanceof GenerationError) throw error;
      throw new GenerationError(
        'Failed to generate posts',
        'GENERATION_FAILED',
        500
      );
    }
  }

  private async checkUsageLimits(userId: string): Promise<{ remaining: number; allowed: number }> {
    const { data: subscription } = await this.supabase
      .from('subscriptions')
      .select('plan_name, status')
      .eq('user_id', userId)
      .single();

    const { data: usage } = await this.supabase
      .from('monthly_usage')
      .select('generation_count')
      .eq('user_id', userId)
      .eq('month_year', this.getCurrentMonthYear())
      .single();

    const limit = this.getGenerationLimit(subscription?.plan_name as SubscriptionTier);
    const current = usage?.generation_count || 0;

    return {
      remaining: Math.max(0, limit - current),
      allowed: limit
    };
  }

  private async saveGeneration(
    userId: string,
    content: string,
    result: GeneratedPosts,
    platforms: SupportedPlatforms[]
  ) {
    await this.supabase.from('generations').insert({
      user_id: userId,
      input_content: content,
      generated_posts: result,
      platforms: platforms
    });
  }

  private async updateUsage(userId: string) {
    const monthYear = this.getCurrentMonthYear();
    
    const { error } = await this.supabase.rpc('increment_monthly_usage', {
      p_user_id: userId,
      p_month_year: monthYear
    });

    if (error) throw new GenerationError('Failed to update usage', 'UPDATE_FAILED', 500);
  }

  private getCurrentMonthYear(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }

  private getGenerationLimit(tier: SubscriptionTier): number {
    const limits: Record<SubscriptionTier, number> = {
      free: 5,
      starter: 50,
      pro: 200,
      enterprise: 1000
    };
    return limits[tier] || limits.free;
  }
} 