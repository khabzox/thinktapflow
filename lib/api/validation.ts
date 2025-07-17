import { z } from "zod";
// import type { SupportedPlatforms } from '@/types/ai';

const supportedPlatforms = [
  "twitter",
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
] as const;

export const generatePostsSchema = z.object({
  content: z.string().min(1).max(10000),
  platforms: z.array(z.enum(supportedPlatforms)).min(1).max(10),
  options: z
    .object({
      temperature: z.number().optional(),
      includeEmojis: z.boolean().optional(),
      includeHashtags: z.boolean().optional(),
      creativityLevel: z.number().min(0).max(100).optional(),
      contentLength: z.number().min(0).max(100).optional(),
      targetAudience: z.string().optional(),
      customInstructions: z.string().optional(),
    })
    .optional(),
});

export const webhookSchema = z.object({
  alert_name: z.string(),
  subscription_id: z.string(),
  status: z.enum(["active", "cancelled", "past_due"]),
  effective_from: z.string(),
  user_id: z.string(),
  signature: z.string(),
});

export type GeneratePostsRequest = z.infer<typeof generatePostsSchema>;
export type WebhookRequest = z.infer<typeof webhookSchema>;
