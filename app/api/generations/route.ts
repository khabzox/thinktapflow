import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/api/errors';

const TIER_LIMITS = {
    free: {
        monthly_words: 5000,
        daily_generations: 5,
    },
    pro: {
        monthly_words: 50000,
        daily_generations: 50,
    },
    plus: {
        monthly_words: -1, // unlimited
        daily_generations: -1, // unlimited
    }
};

export async function GET(req: NextRequest) {
    try {
        // Initialize services - consistent with generate endpoint
        const cookieStore = cookies();
        const supabase = createServerClient(await cookieStore);

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
                { status: 401 }
            );
        }

        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select(`
                daily_usage_count,
                daily_usage_limit,
                monthly_words_used,
                monthly_words_limit,
                subscription_tier,
                daily_reset_date,
                monthly_reset_date
            `)
            .eq('id', user.id)
            .single();

        if (profileError) {
            return NextResponse.json(
                { success: false, error: { message: 'Profile not found', code: 'USER_NOT_FOUND' } },
                { status: 404 }
            );
        }

        // Get tier limits for calculations
        const tierLimits = TIER_LIMITS[profile.subscription_tier as keyof typeof TIER_LIMITS];

        // Get usage analytics for the last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const { data: analytics, error: analyticsError } = await supabase
            .from('generations')
            .select('created_at, tokens_used, words_generated')
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo)
            .order('created_at', { ascending: true });

        // Get daily analytics for the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const dailyStats = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
            const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();

            const { count } = await supabase
                .from('generations')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .gte('created_at', dayStart)
                .lt('created_at', dayEnd);

            dailyStats.push({
                date: date.toISOString().split('T')[0],
                generations: count || 0
            });
        }

        // Calculate remaining usage
        const dailyRemaining = tierLimits?.daily_generations === -1
            ? -1
            : (tierLimits?.daily_generations || 0) - profile.daily_usage_count;

        const monthlyWordsRemaining = tierLimits?.monthly_words === -1
            ? -1
            : (tierLimits?.monthly_words || 0) - profile.monthly_words_used;

        // Calculate percentages
        const dailyUsagePercentage = tierLimits?.daily_generations === -1
            ? 0
            : (profile.daily_usage_count / (tierLimits?.daily_generations || 1)) * 100;

        const monthlyWordsPercentage = tierLimits?.monthly_words === -1
            ? 0
            : (profile.monthly_words_used / (tierLimits?.monthly_words || 1)) * 100;

        return NextResponse.json({
            success: true,
            data: {
                // Daily usage
                daily_usage: {
                    current: profile.daily_usage_count,
                    limit: tierLimits?.daily_generations || 0,
                    remaining: dailyRemaining,
                    percentage: Math.min(dailyUsagePercentage, 100),
                    unlimited: tierLimits?.daily_generations === -1,
                    reset_date: profile.daily_reset_date
                },

                // Monthly word usage
                monthly_words: {
                    current: profile.monthly_words_used,
                    limit: tierLimits?.monthly_words || 0,
                    remaining: monthlyWordsRemaining,
                    percentage: Math.min(monthlyWordsPercentage, 100),
                    unlimited: tierLimits?.monthly_words === -1,
                    reset_date: profile.monthly_reset_date
                },

                // General info
                subscription_tier: profile.subscription_tier,

                // Analytics
                analytics: analytics || [],
                daily_stats: dailyStats,

                // Summary stats
                total_generations_30_days: analytics?.length || 0,
                total_words_30_days: analytics?.reduce((sum, item) => sum + (item.words_generated || 0), 0) || 0,
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}