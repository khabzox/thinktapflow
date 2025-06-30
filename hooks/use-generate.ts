import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { GenerationRequest } from '@/types/api';
import { aiProvider, AIGenerationOptions } from '@/lib/ai';
import { AI_ERRORS } from '@/constants/ai';

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

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      // Call the generate API endpoint
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 429) {
          throw {
            message: data.error?.message || 'Usage limit reached',
            code: 'LIMIT_REACHED',
            details: data.error?.details
          };
        }
        throw {
          message: data.error?.message || AI_ERRORS.GENERATION_FAILED,
          code: data.error?.code || 'GENERATION_FAILED'
        };
      }

      return data.data;
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