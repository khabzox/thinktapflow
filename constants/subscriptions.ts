export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    daily_generations: 5,
    monthly_words: 10000,
    features: [
      'Basic content generation',
      '3 social media platforms',
      'Standard templates',
      'Email support'
    ]
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    daily_generations: 50,
    monthly_words: 100000,
    features: [
      'Advanced content generation',
      'All social media platforms',
      'Premium templates',
      'Analytics dashboard',
      'Priority support',
      'Content calendar',
      'Team collaboration'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    daily_generations: 200,
    monthly_words: 500000,
    features: [
      'Unlimited content generation',
      'All platforms + custom integrations',
      'Custom templates',
      'Advanced analytics',
      'Dedicated support',
      'White-label solution',
      'API access',
      'Custom workflows'
    ]
  }
} as const;

export const TIER_LIMITS = {
  free: SUBSCRIPTION_TIERS.FREE,
  pro: SUBSCRIPTION_TIERS.PRO,
  enterprise: SUBSCRIPTION_TIERS.ENTERPRISE
} as const;

export const DEFAULT_TIER = 'free';

export const getTierLimits = (tier: string) => {
  return TIER_LIMITS[tier as keyof typeof TIER_LIMITS] || TIER_LIMITS.free;
};
