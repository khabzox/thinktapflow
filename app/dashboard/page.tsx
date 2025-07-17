"use client";

import { useState } from "react";
import { Clock, Sparkles, BarChart3, Zap, Plus, Users, Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PostsDisplay } from "@/components/dashboard/PostsDisplay";
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useDashboard } from "@/hooks/use-dashboard";

const chartConfig = {
  generations: {
    label: "Generations",
    color: "hsl(var(--primary))",
  },
  engagement: {
    label: "Engagement",
    color: "hsl(var(--chart-2))",
  },
  reach: {
    label: "Reach",
    color: "hsl(var(--chart-3))",
  },
};

export default function UserDashboardPage() {
  const { data, isLoading, error } = useDashboard();
  const [generatedPosts, setGeneratedPosts] = useState<
    Array<{
      id: string;
      platform: string;
      platformId: string;
      icon: string;
      content: string;
      characterCount: number;
      limit: number;
      hashtags: string[];
      createdAt: string;
    }>
  >([]);

  const handleGeneration = (
    posts: Array<{
      id: string;
      platform: string;
      platformId: string;
      icon: string;
      content: string;
      characterCount: number;
      limit: number;
      hashtags: string[];
      createdAt: string;
    }>,
  ) => {
    setGeneratedPosts(posts);
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="user">
        <div className="space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-1/3 rounded bg-muted"></div>
            <div className="grid gap-6 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="space-y-0 pb-2">
                    <div className="h-4 w-1/2 rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-1/3 rounded bg-muted"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userRole="user">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="space-y-4 text-center">
            <p className="text-destructive">Failed to load dashboard data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasGenerations = (data?.generations.total || 0) > 0;

  return (
    <DashboardLayout userRole="user">
      <div className="space-y-8">
        {/* User Dashboard Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="bg-gradient-to-r from-popover-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              Welcome back, {data?.user?.name || data?.user?.email?.split("@")[0] || "User"}!
            </h1>
            <Zap className="h-8 w-8 text-popover-foreground" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg text-secondary-foreground">
              Ready to create amazing content? Let's see what you've accomplished.
            </p>
          </div>
        </div>

        {/* User-focused Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 transition-all duration-300 hover:shadow-lg dark:from-blue-950/50 dark:to-blue-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Content Created
              </CardTitle>
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {data?.generations.total || 0}
              </div>
              <div className="flex items-center text-sm">
                <span className="text-muted-foreground">Total generations</span>
              </div>
              <Progress
                value={((data?.user?.usage_count || 0) / (data?.user?.usage_limit || 1)) * 100}
                className="mt-3 h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {data?.user?.usage_limit && data?.user?.usage_count
                  ? `${data.user.usage_limit - data.user.usage_count} generations left`
                  : "No usage data"}
              </p>
            </CardContent>
          </Card>

          {/* Generate Content Card */}
          <Card className="group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-green-50 to-green-100/50 transition-all duration-300 hover:shadow-lg dark:from-green-950/50 dark:to-green-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Create Content
              </CardTitle>
              <div className="rounded-lg bg-green-500/10 p-2">
                <Plus className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-lg font-bold text-green-900 dark:text-green-100">
                Generate Posts
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Create engaging content for all your social media platforms
              </p>
              <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => (window.location.href = "/dashboard/generate")}
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>

          {/* Community Card */}
          <Card className="group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 transition-all duration-300 hover:shadow-lg dark:from-purple-950/50 dark:to-purple-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Community
              </CardTitle>
              <div className="rounded-lg bg-purple-500/10 p-2">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-lg font-bold text-purple-900 dark:text-purple-100">
                Join Community
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Connect with creators and share your experiences
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-purple-200 hover:bg-purple-50"
                onClick={() => (window.location.href = "/community")}
              >
                Explore Community
              </Button>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="group relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 transition-all duration-300 hover:shadow-lg dark:from-orange-950/50 dark:to-orange-900/30">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Settings
              </CardTitle>
              <div className="rounded-lg bg-orange-500/10 p-2">
                <Settings className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-lg font-bold text-orange-900 dark:text-orange-100">
                Preferences
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                Customize your account and content preferences
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full border-orange-200 hover:bg-orange-50"
                onClick={() => (window.location.href = "/dashboard/settings")}
              >
                Manage Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User Dashboard Content */}
        {hasGenerations ? (
          <>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Your Content Performance
                </CardTitle>
                <CardDescription>Monthly generation and engagement trends</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[250px] w-full">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={data?.performance?.monthly || []}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis
                          dataKey="month"
                          className="text-xs"
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis className="text-xs" axisLine={false} tickLine={false} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="generations"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="engagement"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Generated Posts */}
            {generatedPosts.length > 0 && <PostsDisplay posts={generatedPosts} />}

            {/* Recent Generations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Recent Generations
                    </CardTitle>
                    <CardDescription>Your latest content with performance metrics</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/dashboard/generations">View All</a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.generations?.recentGenerations?.map(generation => (
                    <div
                      key={generation.id}
                      className="flex items-center justify-between rounded-xl border p-4 transition-all duration-200 hover:bg-muted/50 hover:shadow-md"
                    >
                      <div className="flex-1 space-y-2">
                        <p className="text-sm font-medium leading-none">{generation.content}</p>
                        <div className="flex items-center gap-4">
                          <p className="text-xs text-muted-foreground">
                            {new Date(generation.created_at).toLocaleString()}
                          </p>
                          <div className="flex gap-1">
                            {generation.platforms.map(platform => (
                              <Badge key={platform} variant="secondary" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-green-600 text-green-600">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your first content to see analytics and performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-4 text-center text-muted-foreground">
                No content generated yet. Start creating amazing content for your social media
                platforms!
              </p>
              <Button onClick={() => (window.location.href = "/dashboard/generate")}>
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
