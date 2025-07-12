import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { GenerationRequest } from '@/types/api';
import { aiProvider, AIGenerationOptions } from '@/lib/ai';
import { AI_ERRORS } from '@/constants/ai';
import { generateContent as generateContentAction } from '@/actions';

interface GenerationError {
  message: string;
  code: string;
  details?: {
    current?: number;
    limit?: number;
    subscription_tier?: string;
  };
}

export function useGenerate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<GenerationError | null>(null);
  const supabase = createClientComponentClient<Database>();

  const generateContent = async (request: GenerationRequest) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Create FormData for server action
      const formData = new FormData();
      formData.append('content', request.content);
      formData.append('platforms', JSON.stringify(request.platforms));
      formData.append('options', JSON.stringify(request.options || {}));

      // Call the server action
      const result = await generateContentAction(formData);

      if (!result.success) {
        // Handle specific error cases
        if (result.error?.code === 'DAILY_LIMIT_REACHED' || result.error?.code === 'MONTHLY_LIMIT_REACHED') {
          throw {
            message: result.error.message || 'Usage limit reached',
            code: 'LIMIT_REACHED',
            details: result.error
          };
        }
        throw {
          message: result.error?.message || AI_ERRORS.GENERATION_FAILED,
          code: result.error?.code || 'GENERATION_FAILED'
        };
      }

      return result.data;
    } catch (err) {
      console.error('Generation error:', err);
      setError(err as GenerationError);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // New method using the Groq AI service directly
  const generateWithAI = async (
    input: string,
    platforms: string[],
    options: AIGenerationOptions = {}
  ) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Generate content using the AI provider
      const content = await aiProvider.generateContent(input, platforms, options);

      // Save to database if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: saveError } = await supabase
          .from('generations')
          .insert({
            user_id: user.id,
            input_content: input,
            generated_content: content,
            platforms: platforms,
            metadata: {
              options,
              timestamp: Date.now(),
              provider: 'groq' // LOCKED TO GROQ
            }
          });

        if (saveError) {
          console.warn('Failed to save generation to database:', saveError);
        }
      }

      return content;
    } catch (err) {
      console.error('AI Generation error:', err);
      setError({
        message: err instanceof Error ? err.message : AI_ERRORS.GENERATION_FAILED,
        code: 'AI_GENERATION_FAILED'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateContent,
    generateWithAI,
    isGenerating,
    error,
  };
}