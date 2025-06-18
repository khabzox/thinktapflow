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

function getMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function POST(req: NextRequest) {
    try {
        // Initialize services - consistent with other endpoints
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

        const body = await req.json();
        const { tier } = body;

        if (!['free', 'pro', 'plus'].includes(tier)) {
            return NextResponse.json(
                { success: false, error: { message: 'Invalid subscription tier', code: 'INVALID_TIER' } },
                { status: 400 }
            );
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
            return NextResponse.json(
                { success: false, error: { message: 'Failed to update subscription', code: 'UPDATE_FAILED' } },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                user: updatedUser,
                message: `Successfully upgraded to ${tier} tier. Usage counters have been reset.`
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}