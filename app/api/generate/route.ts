import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { createAIService } from '@/lib/ai';
import { generatePostsSchema } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { GenerationError } from '@/lib/api/errors';
import { env } from '@/lib/env';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
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
                    subscription_tier: 'free',
                    usage_count: 0,
                    usage_limit: 10
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

            profile = newProfile;
        }

        // Check usage limits
        if (profile.usage_count >= profile.usage_limit) {
            throw new GenerationError('Usage limit reached', 'LIMIT_REACHED', 429);
        }

        // Parse request body
        const body = await req.json();
        const validatedData = generatePostsSchema.safeParse(body);
        
        if (!validatedData.success) {
            throw new GenerationError('Invalid request data', 'INVALID_REQUEST', 400);
        }

        // Initialize AI service with API key
        const aiService = createAIService('groq', {
            apiKey: env.groq.apiKey,
            model: 'llama-3.3-70b-versatile'
        });

        // Generate posts
        const result = await aiService.generateSocialPosts(
            validatedData.data.content,
            validatedData.data.platforms,
            validatedData.data.options
        );

        console.log('[Generation] Result:', {
            platforms: validatedData.data.platforms,
            hasContent: !!result,
            postCount: Object.keys(result.posts || {}).length
        });

        // Save generation
        const { data: generation, error: saveError } = await supabase
            .from('generations')
            .insert({
                user_id: user.id,
                input_content: validatedData.data.content,
                platforms: validatedData.data.platforms,
                posts: result.posts || {},
                tokens_used: Math.round(result.metadata?.tokensUsed || 0),
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (saveError) {
            console.error('[Generation] Save error:', saveError);
            throw new GenerationError('Failed to save generation', 'SAVE_FAILED', 500);
        }

        // Update usage count
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                usage_count: profile.usage_count + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('[Usage] Update error:', updateError);
        }

        return NextResponse.json({
            success: true,
            data: {
                generation_id: generation.id,
                posts: result.posts,
                remaining_usage: profile.usage_limit - profile.usage_count - 1
            }
        });
    } catch (error) {
        console.error('[API] Error:', error);
        return handleApiError(error);
    }
}