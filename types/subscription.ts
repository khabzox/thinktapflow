export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';

export interface Subscription {
  id: string;
  user_id: string;
  plan_name: SubscriptionTier;
  status: SubscriptionStatus;
  paddle_subscription_id: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyUsage {
  id: string;
  user_id: string;
  month_year: string;
  generation_count: number;
  created_at: string;
  updated_at: string;
} 