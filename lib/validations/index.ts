import { z } from "zod";
import { VALIDATION_RULES } from "@/constants";

// Base validation schemas
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(
    VALIDATION_RULES.EMAIL.MAX_LENGTH,
    `Email must be less than ${VALIDATION_RULES.EMAIL.MAX_LENGTH} characters`,
  );

export const passwordSchema = z
  .string()
  .min(
    VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters`,
  )
  .refine(password => {
    if (!VALIDATION_RULES.PASSWORD.REQUIRE_UPPERCASE) return true;
    return /[A-Z]/.test(password);
  }, "Password must contain at least one uppercase letter")
  .refine(password => {
    if (!VALIDATION_RULES.PASSWORD.REQUIRE_LOWERCASE) return true;
    return /[a-z]/.test(password);
  }, "Password must contain at least one lowercase letter")
  .refine(password => {
    if (!VALIDATION_RULES.PASSWORD.REQUIRE_NUMBERS) return true;
    return /\d/.test(password);
  }, "Password must contain at least one number")
  .refine(password => {
    if (!VALIDATION_RULES.PASSWORD.REQUIRE_SYMBOLS) return true;
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }, "Password must contain at least one special character");

export const usernameSchema = z
  .string()
  .min(
    VALIDATION_RULES.USERNAME.MIN_LENGTH,
    `Username must be at least ${VALIDATION_RULES.USERNAME.MIN_LENGTH} characters`,
  )
  .max(
    VALIDATION_RULES.USERNAME.MAX_LENGTH,
    `Username must be less than ${VALIDATION_RULES.USERNAME.MAX_LENGTH} characters`,
  )
  .regex(
    VALIDATION_RULES.USERNAME.ALLOWED_CHARS,
    "Username can only contain letters, numbers, and underscores",
  );

export const contentSchema = z
  .string()
  .min(
    VALIDATION_RULES.CONTENT.MIN_LENGTH,
    `Content must be at least ${VALIDATION_RULES.CONTENT.MIN_LENGTH} characters`,
  )
  .max(
    VALIDATION_RULES.CONTENT.MAX_LENGTH,
    `Content must be less than ${VALIDATION_RULES.CONTENT.MAX_LENGTH} characters`,
  );

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    acceptTerms: z
      .boolean()
      .refine(val => val === true, "You must accept the terms and conditions"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Content generation validation schemas
export const generateContentSchema = z.object({
  input: contentSchema,
  platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
  options: z
    .object({
      tone: z.enum(["professional", "casual", "marketing", "friendly"]).optional(),
      includeHashtags: z.boolean().optional(),
      includeEmojis: z.boolean().optional(),
      contentType: z.enum(["post", "thread", "story", "video", "article"]).optional(),
      model: z.enum(["fast", "balanced", "advanced"]).optional(),
      variations: z.number().min(1).max(5).optional(),
    })
    .optional(),
});

export const urlExtractionSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
});

// Profile and settings validation schemas
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: usernameSchema.optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
});

export const socialAccountSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  username: z.string().min(1, "Username is required"),
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Template validation schemas
export const templateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  category: z.string().min(1, "Category is required"),
  platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
  prompt: contentSchema,
  variables: z
    .array(
      z.object({
        name: z.string().min(1, "Variable name is required"),
        type: z.enum(["text", "number", "select", "boolean"]),
        description: z.string().min(1, "Description is required"),
        required: z.boolean(),
        options: z.array(z.string()).optional(),
        defaultValue: z.any().optional(),
      }),
    )
    .optional(),
});

// API validation schemas
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const generationFilterSchema = z.object({
  platforms: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  search: z.string().optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.any(),
  type: z.enum(["image", "document", "video", "audio"]),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
});

// Subscription validation schemas
export const subscriptionUpdateSchema = z.object({
  tier: z.enum(["free", "pro", "enterprise"]),
  paymentMethodId: z.string().optional(),
});

export const usageTrackingSchema = z.object({
  action: z.string().min(1, "Action is required"),
  resource: z.string().min(1, "Resource is required"),
  metadata: z.record(z.any()).optional(),
});

// Utility validation functions
export const validatePlatformContent = (content: string, platform: string): boolean => {
  const platformLimits: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 2000,
    instagram: 2200,
    tiktok: 150,
    youtube: 5000,
  };

  const limit = platformLimits[platform];
  return limit ? content.length <= limit : true;
};

export const validateHashtags = (hashtags: string[]): boolean => {
  const hashtagRegex = /^#[a-zA-Z0-9_]+$/;
  return hashtags.every(tag => hashtagRegex.test(tag) && tag.length <= 100);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type GenerateContentFormData = z.infer<typeof generateContentSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type TemplateFormData = z.infer<typeof templateSchema>;
export type SocialAccountFormData = z.infer<typeof socialAccountSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
export type GenerationFilters = z.infer<typeof generationFilterSchema>;
