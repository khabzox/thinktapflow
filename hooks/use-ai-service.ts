import { useMemo } from 'react';
import { createAIService, AIProviderType } from '@/lib/ai';

export function useAIService(provider: AIProviderType = 'groq') {
  return useMemo(() => createAIService(provider), [provider]);
}
