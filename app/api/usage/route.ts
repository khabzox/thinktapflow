import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { handleApiError } from '@/lib/api/errors';
import { GenerationError } from '@/lib/api/errors';
import { SubscriptionTier } from '@/types/subscription';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient(cookies());

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new GenerationError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    // Get current month's usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage } = await supabase
      .from('monthly_usage')
      .select('generation_count')
      .eq('user_id', user.id)
      .eq('month_year', currentMonth)
      .single();

    // Get subscription details
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_name, status')
      .eq('user_id', user.id)
      .single();

    const limits: Record<SubscriptionTier, number> = {
      free: 5,
      starter: 50,
      pro: 200,
      enterprise: 1000
    };

    const plan = (subscription?.plan_name as SubscriptionTier) || 'free';
    const limit = limits[plan];
    const used = usage?.generation_count || 0;

    return new Response(
      JSON.stringify({
        usage: {
          limit,
          used,
          remaining: Math.max(0, limit - used),
          plan
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
} 