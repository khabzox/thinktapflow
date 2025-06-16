import { SubscriptionTier } from "@/types/subscription";

const getGenerationLimitConfig = (tier: SubscriptionTier): number => {
    const limits: Record<SubscriptionTier, number> = {
        free: 5,
        starter: 50,
        pro: 200,
        plus: 1000
    };
    return limits[tier] || limits.free;
};

export { getGenerationLimitConfig };