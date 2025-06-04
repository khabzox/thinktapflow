import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { User } from '@/types/api';

interface DashboardData {
  user: User | null;
  generations: {
    total: number;
    monthlyCount: number;
    recentGenerations: Array<{
      id: string;
      content: string;
      platforms: string[];
      createdAt: string;
      status: string;
      engagement: {
        views: number;
        likes: number;
        shares: number;
      };
    }>;
  };
  performance: {
    monthly: Array<{
      month: string;
      generations: number;
      engagement: number;
      reach: number;
    }>;
    platforms: Array<{
      platform: string;
      posts: number;
      engagement: number;
      growth: number;
    }>;
  };
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Get current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', currentUser?.id)
          .single();
        if (profileError) throw profileError;

        // Get recent generations with engagement metrics
        const { data: generations, error: generationsError } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', currentUser?.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (generationsError) throw generationsError;

        // Get monthly usage statistics
        let monthlyStats = [];
        try {
          const { data: stats, error: monthlyError } = await supabase
            .from('monthly_usage')
            .select('*')
            .eq('user_id', currentUser?.id)
            .order('month_year', { ascending: true })
            .limit(6);
          
          if (!monthlyError) {
            monthlyStats = stats;
          }
        } catch (error) {
          console.warn('Monthly stats not available:', error);
        }

        // Transform the data
        const dashboardData: DashboardData = {
          user: profile,
          generations: {
            total: generations.length,
            monthlyCount: monthlyStats?.[monthlyStats.length - 1]?.generation_count || generations.length,
            recentGenerations: generations.map(gen => ({
              id: gen.id,
              content: gen.input_content,
              platforms: gen.platforms,
              createdAt: new Date(gen.created_at).toLocaleString(),
              status: 'completed',
              engagement: {
                views: Math.floor(Math.random() * 5000), // TODO: Replace with actual metrics
                likes: Math.floor(Math.random() * 200),  // TODO: Replace with actual metrics
                shares: Math.floor(Math.random() * 50)   // TODO: Replace with actual metrics
              }
            }))
          },
          performance: {
            monthly: monthlyStats.map(stat => ({
              month: new Date(stat.month_year).toLocaleString('default', { month: 'short' }),
              generations: stat.generation_count,
              engagement: Math.floor(Math.random() * 10000), // TODO: Replace with actual metrics
              reach: Math.floor(Math.random() * 70000)      // TODO: Replace with actual metrics
            })),
            platforms: ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map(platform => ({
              platform,
              posts: Math.floor(Math.random() * 50),       // TODO: Replace with actual metrics
              engagement: Math.floor(Math.random() * 10),  // TODO: Replace with actual metrics
              growth: Math.floor(Math.random() * 20)       // TODO: Replace with actual metrics
            }))
          }
        };

        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  return { data, isLoading, error };
} 