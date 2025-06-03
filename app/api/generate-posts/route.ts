import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { GenerationService } from '@/lib/api/services/generation-service';
import { generatePostsSchema } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { GenerationError } from '@/lib/api/errors';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Initialize services
    const supabase = createServerClient(cookies());
    const generationService = new GenerationService();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new GenerationError('Unauthorized', 'UNAUTHORIZED', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = generatePostsSchema.safeParse(body);
    
    if (!validatedData.success) {
      throw new GenerationError('Invalid request data', 'INVALID_REQUEST', 400);
    }

    // Generate posts
    const result = await generationService.generatePosts(
      user.id,
      validatedData.data.content,
      validatedData.data.platforms
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return handleApiError(error);
  }
} 