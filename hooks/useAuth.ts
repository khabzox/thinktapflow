import { useRouter, usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useCallback, useEffect, useState } from 'react';
import { type User, AuthError } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
}

const protectedPaths = ['/dashboard', '/settings'];
const authPaths = ['/auth/login', '/auth/signup', '/auth/verify-email'];

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        isLoading: false,
      }));

      // Handle protected routes
      const isProtectedPath = protectedPaths.some(path => pathname?.startsWith(path));
      const isAuthPath = authPaths.some(path => pathname?.startsWith(path));

      if (isProtectedPath && !session) {
        router.push('/auth/login');
      } else if (isAuthPath && session) {
        router.push('/dashboard');
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        isLoading: false,
      }));

      if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const signIn = useCallback(
    async (email: string, password: string, redirectTo?: string | null) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirectTo || '/dashboard');
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as AuthError,
          isLoading: false,
        }));
      }
    },
    [supabase, router]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as AuthError,
          isLoading: false,
        }));
      }
    },
    [supabase, router]
  );

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error as AuthError,
        isLoading: false,
      }));
    }
  }, [supabase, router]);

  const signInWithProvider = useCallback(
    async (provider: 'google' | 'github', redirectTo?: string | null) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectTo 
              ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
              : `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as AuthError,
          isLoading: false,
        }));
      }
    },
    [supabase]
  );

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithProvider,
  };
} 