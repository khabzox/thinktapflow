import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { webhookSchema } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { WebhookError } from '@/lib/api/errors';
import { env } from '@/lib/env';
import crypto from 'crypto';

export const runtime = 'edge';

const verifyPaddleSignature = (payload: any, signature: string): boolean => {
  const serialized = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', env.paddle.webhookSecret);
  hmac.update(serialized);
  const calculatedSignature = hmac.digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
};

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient(cookies());
    const body = await request.json();

    // Validate webhook payload
    const validatedData = webhookSchema.safeParse(body);
    if (!validatedData.success) {
      throw new WebhookError('Invalid webhook payload', 'WEBHOOK_INVALID', 400);
    }

    const { alert_name, subscription_id, status, user_id, signature } = validatedData.data;

    // Verify webhook signature
    if (!verifyPaddleSignature(body, signature)) {
      throw new WebhookError('Invalid webhook signature', 'WEBHOOK_INVALID', 401);
    }

    // Handle different webhook events
    switch (alert_name) {
      case 'subscription_updated':
      case 'subscription_cancelled':
        await supabase
          .from('subscriptions')
          .update({
            status: status,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user_id)
          .eq('paddle_subscription_id', subscription_id);
        break;

      default:
        console.log(`Unhandled webhook event: ${alert_name}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
} 