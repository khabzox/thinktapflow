'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

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

function getMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function updateSubscription(formData: FormData) {
    try {
        // Initialize services - consistent with other endpoints
        const cookieStore = cookies();
        const supabase = createServerClient(await cookieStore);

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
            };
        }

        const tier = formData.get('tier') as string;

        if (!['free', 'pro', 'plus'].includes(tier)) {
            return {
                success: false,
                error: { message: 'Invalid subscription tier', code: 'INVALID_TIER' }
            };
        }

        const tierLimits = TIER_LIMITS[tier as keyof typeof TIER_LIMITS];

        // When upgrading/downgrading, reset usage counters
        const updateData = {
            subscription_tier: tier,
            daily_usage_limit: tierLimits.daily_generations,
            monthly_words_limit: tierLimits.monthly_words,
            daily_usage_count: 0, // Reset daily count on tier change
            monthly_words_used: 0, // Reset monthly count on tier change
            daily_reset_date: new Date().toISOString(),
            monthly_reset_date: getMonthStart(),
            updated_at: new Date().toISOString(),
        };

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            console.error('[Subscription] Update error:', updateError);
            return {
                success: false,
                error: { message: 'Failed to update subscription', code: 'UPDATE_FAILED' }
            };
        }

        return {
            success: true,
            data: {
                user: updatedUser,
                message: `Successfully updated subscription to ${tier} tier. Usage counters have been reset.`
            },
        };
    } catch (error) {
        console.error('[Action] Error:', error);
        return {
            success: false,
            error: {
                message: 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR'
            }
        };
    }
}

export async function getSubscriptionDetails() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(cookieStore);

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: { message: 'Unauthorized', code: 'UNAUTHORIZED' }
            };
        }

        const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('subscription_tier, daily_usage_count, daily_usage_limit, monthly_words_used, monthly_words_limit')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return {
                success: false,
                error: { message: 'Profile not found', code: 'USER_NOT_FOUND' }
            };
        }

        return {
            success: true,
            data: profile
        };
    } catch (error) {
        console.error('[Action] Error:', error);
        return {
            success: false,
            error: {
                message: 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR'
            }
        };
    }
}
