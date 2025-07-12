'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { aiProvider } from '@/lib/ai';
import { generatePostsSchema } from '@/lib/api/validation';
import { GenerationError } from '@/lib/api/errors';

// Type definitions
type SubscriptionTier = 'free' | 'pro' | 'plus';

interface TierLimit {
    monthly_words: number; // -1 for unlimited
    daily_generations: number; // -1 for unlimited
}

interface UserProfile {
    id: string;
    email: string;
    subscription_tier: SubscriptionTier;
    daily_usage_count: number;
    daily_usage_limit: number;
    monthly_words_used: number;
    monthly_words_limit: number;
    daily_reset_date: string | null;
    monthly_reset_date: string | null;
    updated_at?: string;
}

interface GenerationResult {
    posts: Record<string, any>;
    metadata?: {
        tokensUsed?: number;
    };
}

interface Post {
    content?: string;
}

interface UpdateData {
    daily_usage_count?: number;
    daily_reset_date?: string;
    monthly_words_used?: number;
    monthly_reset_date?: string;
    updated_at?: string;
}

// Updated tier limits based on your pricing plans
const TIER_LIMITS: Record<SubscriptionTier, TierLimit> = {
    free: {
        monthly_words: 5000,
        daily_generations: 5,
    },
    pro: {
        monthly_words: 50000,
        daily_generations: 50,
    },
    plus: {
        monthly_words: -1, // unlimited
        daily_generations: -1, // unlimited
    }
} as const;

// Helper function to check if it's a new day
function isNewDay(lastResetDate: string | null): boolean {
    if (!lastResetDate) return true;

    const today = new Date();
    const lastReset = new Date(lastResetDate);

    // Reset if it's a different day
    return today.toDateString() !== lastReset.toDateString();
}

// Helper function to get start of current month
function getMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

// Helper function to estimate words from posts
function estimateWordsFromPosts(posts: Record<string, any>): number {
    let totalWords = 0;

    for (const platform in posts) {
        const platformPosts = posts[platform];
        if (Array.isArray(platformPosts)) {
            platformPosts.forEach((post: string | Post) => {
                if (typeof post === 'string') {
                    totalWords += post.split(/\s+/).filter((word: string) => word.length > 0).length;
                } else if (post && typeof post.content === 'string') {
                    totalWords += post.content.split(/\s+/).filter((word: string) => word.length > 0).length;
                }
            });
        }
    }

    return Math.max(1, totalWords); // Minimum 1 word
}

// Helper function to backfill monthly words usage for existing user
async function backfillMonthlyWordsUsage(
    supabase: any,
    userId: string,
    monthStart: string
): Promise<number> {
    try {
        // Get all generations for this user in the current month
        const { data: monthlyGenerations, error } = await supabase
            .from('generations')
            .select('words_generated')
            .eq('user_id', userId)
            .gte('created_at', monthStart);

        if (error) {
            console.error('[Backfill] Error fetching monthly generations:', error);
            return 0;
        }

        // Sum up all words generated this month
        const totalWordsThisMonth = monthlyGenerations.reduce((sum: number, gen: any) => {
            return sum + (gen.words_generated || 0);
        }, 0);

        console.log('[Backfill] Monthly words calculated:', {
            userId,
            monthStart,
            generationsCount: monthlyGenerations.length,
            totalWords: totalWordsThisMonth
        });

        return totalWordsThisMonth;
    } catch (error) {
        console.error('[Backfill] Error:', error);
        return 0;
    }
}

export async function generateContent(formData: FormData) {
    try {
        // Initialize services
        const cookieStore = cookies();
        const supabase = createServerClient(await cookieStore);

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        console.log('[Auth] User check:', {
            userId: user?.id,
            userEmail: user?.email,
            authError: authError?.message
        });

        if (authError || !user) {
            throw new GenerationError('Unauthorized', 'UNAUTHORIZED', 401);
        }

        // Extract data from FormData
        const content = formData.get('content') as string;
        const platformsStr = formData.get('platforms') as string;
        const optionsStr = formData.get('options') as string;

        const platforms = platformsStr ? JSON.parse(platformsStr) : [];
        const options = optionsStr ? JSON.parse(optionsStr) : {};

        // Validate data
        const validatedData = generatePostsSchema.safeParse({
            content,
            platforms,
            options
        });

        if (!validatedData.success) {
            throw new GenerationError('Invalid request data', 'INVALID_REQUEST', 400);
        }

        // Get user profile
        let { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        console.log('[Profile] Initial check:', {
            userId: user.id,
            hasProfile: !!profile,
            profileError: profileError?.message,
            details: profileError?.details
        });

        if (profileError?.code === 'PGRST116' || !profile) {
            console.log('[Profile] Attempting to create profile for user:', user.id);

            // Try to create the profile if it doesn't exist
            const { data: newProfile, error: createError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    email: user.email,
                    subscription_tier: 'free' as SubscriptionTier,
                    daily_usage_count: 0,
                    daily_usage_limit: TIER_LIMITS.free.daily_generations,
                    monthly_words_used: 0,
                    monthly_words_limit: TIER_LIMITS.free.monthly_words,
                    daily_reset_date: new Date().toISOString(),
                    monthly_reset_date: getMonthStart()
                }, {
                    onConflict: 'id'
                })
                .select()
                .single();

            console.log('[Profile] Creation attempt result:', {
                success: !!newProfile,
                error: createError ? {
                    message: createError.message,
                    code: createError.code,
                    details: createError.details
                } : null
            });

            if (createError || !newProfile) {
                throw new GenerationError(
                    `Failed to create user profile: ${createError?.message || 'Unknown error'}`,
                    'USER_NOT_FOUND',
                    404
                );
            }

            profile = newProfile as UserProfile;
        }

        // Type guard for subscription tier
        const subscriptionTier = profile.subscription_tier as SubscriptionTier;
        if (!TIER_LIMITS[subscriptionTier]) {
            throw new GenerationError('Invalid subscription tier', 'INVALID_TIER', 400);
        }

        // Get tier limits
        const tierLimits = TIER_LIMITS[subscriptionTier];

        // Check if daily reset is needed
        const needsDailyReset = isNewDay(profile.daily_reset_date);

        // Check if monthly reset is needed
        const currentMonthStart = getMonthStart();
        const needsMonthlyReset = !profile.monthly_reset_date ||
            profile.monthly_reset_date !== currentMonthStart;

        // Reset counters if needed
        if (needsDailyReset || needsMonthlyReset) {
            const updateData: UpdateData = {};

            if (needsDailyReset) {
                updateData.daily_usage_count = 0;
                updateData.daily_reset_date = new Date().toISOString();
                console.log('[Reset] Daily reset triggered');
            }

            if (needsMonthlyReset) {
                // Backfill monthly words usage from existing generations
                const actualMonthlyUsage = await backfillMonthlyWordsUsage(
                    supabase,
                    user.id,
                    currentMonthStart
                );

                updateData.monthly_words_used = actualMonthlyUsage;
                updateData.monthly_reset_date = currentMonthStart;
                console.log('[Reset] Monthly reset triggered, backfilled usage:', actualMonthlyUsage);
            }

            const { data: updatedProfile, error: resetError } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', user.id)
                .select()
                .single();

            if (resetError) {
                console.error('[Reset] Error:', resetError);
            } else {
                profile = { ...profile, ...updatedProfile } as UserProfile;
                console.log('[Reset] Profile updated successfully');
            }
        }

        // Check daily usage limits (if not unlimited)
        if (tierLimits.daily_generations !== -1 && profile.daily_usage_count >= tierLimits.daily_generations) {
            throw new GenerationError(
                `Daily generation limit reached. You can generate ${tierLimits.daily_generations} posts per day.`,
                'DAILY_LIMIT_REACHED',
                429
            );
        }

        // Use the Groq AI provider directly
        const generatedArray = await aiProvider.generateContent(
            validatedData.data.content,
            validatedData.data.platforms,
            validatedData.data.options
        );

        // Transform the array into the expected GenerationResult shape
        const result: GenerationResult = {
            posts: Array.isArray(generatedArray)
                ? generatedArray.reduce((acc: Record<string, any>, item: any) => {
                    if (item.platform && item.content) {
                        // Return the full GeneratedContent object, not just the content string
                        acc[item.platform] = [{
                            content: item.content,
                            platform: item.platform,
                            characterCount: item.characterCount || item.content?.length || 0,
                            hashtags: item.hashtags || [],
                            mentions: item.mentions || [],
                            metadata: {
                                characterCount: item.characterCount || item.content?.length || 0,
                                model: item.metadata?.model || 'groq',
                                timestamp: item.metadata?.timestamp || Date.now(),
                                formattedDate: new Date(item.metadata?.timestamp || Date.now()).toLocaleString(),
                                tokens: item.metadata?.tokens || 0
                            }
                        }];
                    }
                    return acc;
                }, {})
                : {},
            metadata: Array.isArray(generatedArray) && generatedArray[0]?.metadata
                ? { tokensUsed: generatedArray[0].metadata.tokens }
                : undefined
        };

        console.log('[Generation] Result:', {
            platforms: validatedData.data.platforms,
            hasContent: !!result,
            postCount: Object.keys(result.posts || {}).length
        });

        // Estimate words generated
        const wordsGenerated = estimateWordsFromPosts(result.posts);

        console.log('[Generation] Words estimated:', {
            wordsGenerated,
            posts: result.posts
        });

        // Check monthly word limits (if not unlimited)
        if (tierLimits.monthly_words !== -1) {
            const newMonthlyUsage = profile.monthly_words_used + wordsGenerated;
            if (newMonthlyUsage > tierLimits.monthly_words) {
                throw new GenerationError(
                    `Monthly word limit reached. You have used ${profile.monthly_words_used} of ${tierLimits.monthly_words} words this month.`,
                    'MONTHLY_LIMIT_REACHED',
                    429
                );
            }
        }

        // Save generation
        const { data: generation, error: saveError } = await supabase
            .from('generations')
            .insert({
                user_id: user.id,
                input_content: validatedData.data.content,
                platforms: validatedData.data.platforms,
                posts: result.posts || {},
                tokens_used: Math.round(result.metadata?.tokensUsed || 0),
                words_generated: wordsGenerated,
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (saveError) {
            console.error('[Generation] Save error:', saveError);
            throw new GenerationError('Failed to save generation', 'SAVE_FAILED', 500);
        }

        // Update usage counts
        const updateData: UpdateData = {
            daily_usage_count: profile.daily_usage_count + 1,
            updated_at: new Date().toISOString()
        };

        // Only update monthly words if not unlimited
        if (tierLimits.monthly_words !== -1) {
            updateData.monthly_words_used = profile.monthly_words_used + wordsGenerated;
        }

        const { error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', user.id);

        if (updateError) {
            console.error('[Usage] Update error:', updateError);
        }

        // Calculate remaining usage
        const remainingDaily = tierLimits.daily_generations === -1
            ? -1
            : tierLimits.daily_generations - profile.daily_usage_count - 1;

        const remainingMonthly = tierLimits.monthly_words === -1
            ? -1
            : tierLimits.monthly_words - profile.monthly_words_used - wordsGenerated;

        console.log('[Usage] Final counts:', {
            dailyUsed: profile.daily_usage_count + 1,
            dailyLimit: tierLimits.daily_generations,
            monthlyWordsUsed: profile.monthly_words_used + wordsGenerated,
            monthlyWordsLimit: tierLimits.monthly_words,
            remainingDaily,
            remainingMonthly
        });

        return {
            success: true,
            data: {
                generation_id: generation.id,
                posts: result.posts,
                usage: {
                    daily_remaining: remainingDaily,
                    monthly_words_remaining: remainingMonthly,
                    words_generated: wordsGenerated,
                    daily_used: profile.daily_usage_count + 1,
                    daily_limit: tierLimits.daily_generations,
                    monthly_words_used: profile.monthly_words_used + wordsGenerated,
                    monthly_words_limit: tierLimits.monthly_words
                }
            }
        };
    } catch (error) {
        console.error('[Action] Error:', error);
        
        // For server actions, we return the error instead of throwing
        if (error instanceof GenerationError) {
            return {
                success: false,
                error: {
                    message: error.message,
                    code: error.code
                }
            };
        }

        return {
            success: false,
            error: {
                message: 'An unexpected error occurred',
                code: 'UNKNOWN_ERROR'
            }
        };
    }
}
