import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { GenerationRequest } from '@/types/api';

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
          message: data.error?.message || 'Failed to generate content',
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

  return {
    generateContent,
    isGenerating,
    error,
  };
} 