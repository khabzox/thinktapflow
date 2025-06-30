import { TIER_LIMITS, getTierLimits } from '@/constants/subscriptions';

export interface UsageStats {
  current: number;
  limit: number;
  percentage: number;
  remaining: number;
}

export interface UserUsage {
  dailyGenerations: UsageStats;
  monthlyWords: UsageStats;
  tier: string;
}

export const calculateUsagePercentage = (current: number, limit: number): number => {
  if (limit === 0) return 0;
  return Math.min((current / limit) * 100, 100);
};

export const getRemainingUsage = (current: number, limit: number): number => {
  return Math.max(limit - current, 0);
};

export const canPerformAction = (current: number, limit: number): boolean => {
  return current < limit;
};

export const getUsageStats = (current: number, limit: number): UsageStats => {
  return {
    current,
    limit,
    percentage: calculateUsagePercentage(current, limit),
    remaining: getRemainingUsage(current, limit)
  };
};

export const getUserUsageInfo = (
  dailyGenerations: number,
  monthlyWords: number,
  tier: string
): UserUsage => {
  const tierLimits = getTierLimits(tier);
  
  return {
    dailyGenerations: getUsageStats(dailyGenerations, tierLimits.daily_generations),
    monthlyWords: getUsageStats(monthlyWords, tierLimits.monthly_words),
    tier
  };
};

export const isUsageLimitReached = (usage: UsageStats): boolean => {
  return usage.current >= usage.limit;
};

export const getUsageWarningLevel = (percentage: number): 'safe' | 'warning' | 'danger' => {
  if (percentage >= 90) return 'danger';
  if (percentage >= 75) return 'warning';
  return 'safe';
};

export const formatUsageText = (usage: UsageStats): string => {
  return `${usage.current}/${usage.limit} (${Math.round(usage.percentage)}%)`;
};

export const getUpgradeRecommendation = (tier: string): string | null => {
  if (tier === 'free') {
    return 'Upgrade to Pro for 10x more generations and advanced features!';
  }
  if (tier === 'pro') {
    return 'Upgrade to Enterprise for unlimited generations and premium support!';
  }
  return null;
};
