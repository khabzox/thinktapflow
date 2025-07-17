import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

interface DashboardData {
  user: {
    id: string;
    email: string;
    name?: string;
    subscription_tier: string;
    usage_count: number;
    usage_limit: number;
  } | null;
  generations: {
    total: number;
    recentGenerations: Array<{
      id: string;
      content: string;
      platforms: string[];
      created_at: string;
      engagement: {
        views: number;
        likes: number;
        shares: number;
      };
      status: string;
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
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // Get user profile and usage data
      const { data: userData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Get total generations count
      const { count: totalGenerations, error: countError } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) throw countError;

      // Get recent generations
      const { data: recentGens, error: recentError } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      // Transform recent generations
      const recentGenerations = recentGens.map(gen => ({
        id: gen.id,
        content: gen.input_content,
        platforms: gen.platforms,
        created_at: gen.created_at,
        engagement: {
          views: Math.floor(Math.random() * 1000), // Placeholder for MVP
          likes: Math.floor(Math.random() * 100), // Placeholder for MVP
          shares: Math.floor(Math.random() * 50), // Placeholder for MVP
        },
        status: "Published", // Placeholder for MVP
      }));

      // Get monthly performance data
      const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleString("default", { month: "short" }),
          generations: Math.floor(Math.random() * 50), // Placeholder for MVP
          engagement: Math.floor(Math.random() * 100), // Placeholder for MVP
          reach: Math.floor(Math.random() * 1000), // Placeholder for MVP
        };
      }).reverse();

      // Get platform performance data
      const platformData = ["Twitter", "LinkedIn", "Instagram"].map(platform => ({
        platform,
        posts: Math.floor(Math.random() * 20), // Placeholder for MVP
        engagement: Math.floor(Math.random() * 10), // Placeholder for MVP
        growth: Math.floor(Math.random() * 30), // Placeholder for MVP
      }));

      setData({
        user: {
          id: user.id,
          email: user.email || "",
          name: userData.name,
          subscription_tier: userData.subscription_tier,
          usage_count: userData.usage_count,
          usage_limit: userData.usage_limit,
        },
        generations: {
          total: totalGenerations || 0,
          recentGenerations,
        },
        performance: {
          monthly: monthlyData,
          platforms: platformData,
        },
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error };
}
