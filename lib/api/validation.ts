import { z } from 'zod';
import { SupportedPlatforms } from '@/types/ai';

export const generatePostsSchema = z.object({
  content: z.string().min(1).max(10000),
  platforms: z.array(z.nativeEnum(SupportedPlatforms)).min(1).max(10)
});

export const webhookSchema = z.object({
  alert_name: z.string(),
  subscription_id: z.string(),
  status: z.enum(['active', 'cancelled', 'past_due']),
  effective_from: z.string(),
  user_id: z.string(),
  signature: z.string()
});

export type GeneratePostsRequest = z.infer<typeof generatePostsSchema>;
export type WebhookRequest = z.infer<typeof webhookSchema>; 