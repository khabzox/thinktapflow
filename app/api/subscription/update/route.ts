import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@/lib/api/errors';

const TIER_LIMITS = {
    free: 10,
    pro: 100,
    plus: 1000,
};

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: { message: 'Unauthorized', code: 'UNAUTHORIZED' } },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json(
                { success: false, error: { message: 'Invalid token', code: 'UNAUTHORIZED' } },
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

        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                subscription_tier: tier,
                usage_limit: TIER_LIMITS[tier as keyof typeof TIER_LIMITS],
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json(
                { success: false, error: { message: 'Failed to update subscription', code: 'UPDATE_FAILED' } },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { user: updatedUser },
        });
    } catch (error) {
        return handleApiError(error);
    }
}