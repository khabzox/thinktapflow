"use client"

import { useState } from "react"
import {
    TrendingUp,
    Clock,
    Target,
    Sparkles,
    Globe,
    ArrowUp,
    Eye,
    Heart,
    Share2,
    Activity,
    BarChart3,
    Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerationForm } from "@/components/dashboard/GenerationForm"
import { PostsDisplay } from "@/components/dashboard/PostsDisplay"
import { UsageChart } from "@/components/dashboard/UsageChart"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

// User-specific sample data
const userPerformanceData = [
    { month: "Jan", generations: 45, engagement: 3200, reach: 18000 },
    { month: "Feb", generations: 78, engagement: 4500, reach: 25000 },
    { month: "Mar", generations: 92, engagement: 5200, reach: 32000 },
    { month: "Apr", generations: 134, engagement: 6800, reach: 45000 },
    { month: "May", generations: 127, engagement: 7200, reach: 52000 },
    { month: "Jun", generations: 150, engagement: 8100, reach: 68000 },
]

const userPlatformStats = [
    { platform: "Twitter", posts: 45, engagement: 4.2, growth: 12 },
    { platform: "LinkedIn", posts: 32, engagement: 6.8, growth: 8 },
    { platform: "Instagram", posts: 28, engagement: 5.4, growth: 15 },
    { platform: "Facebook", posts: 22, engagement: 3.9, growth: 5 },
]

const userRecentGenerations = [
    {
        id: 1,
        content: "Product launch announcement for new AI tool",
        platforms: ["Twitter", "LinkedIn", "Facebook"],
        createdAt: "2 hours ago",
        status: "completed",
        engagement: { views: 2400, likes: 89, shares: 23 },
    },
    {
        id: 2,
        content: "Weekly newsletter content about industry trends",
        platforms: ["Email", "Blog"],
        createdAt: "5 hours ago",
        status: "completed",
        engagement: { views: 1800, likes: 67, shares: 15 },
    },
    {
        id: 3,
        content: "Holiday campaign social media posts",
        platforms: ["Instagram", "Twitter", "TikTok"],
        createdAt: "1 day ago",
        status: "completed",
        engagement: { views: 3200, likes: 145, shares: 34 },
    },
]

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
}

export default function UserDashboardPage() {
    const [generatedPosts, setGeneratedPosts] = useState<Array<{
        id: string;
        platform: string;
        platformId: string;
        icon: string;
        content: string;
        characterCount: number;
        limit: number;
        hashtags: string[];
        createdAt: string;
    }>>([])
    const [selectedTab, setSelectedTab] = useState("overview")

    const handleGeneration = (posts: Array<{
        id: string;
        platform: string;
        platformId: string;
        icon: string;
        content: string;
        characterCount: number;
        limit: number;
        hashtags: string[];
        createdAt: string;
    }>) => {
        setGeneratedPosts(posts)
    }

    return (
        <DashboardLayout userRole="user">
            <div className="space-y-8">
                {/* User Dashboard Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Welcome back, John!
                        </h1>
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">
                        Ready to create amazing content? Let's see what you've accomplished.
                    </p>
                </div>

                {/* User-focused Stats Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/50 dark:to-blue-900/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Content Created</CardTitle>
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Sparkles className="h-4 w-4 text-blue-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">150</div>
                            <div className="flex items-center text-sm">
                                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-600 font-medium">+18%</span>
                                <span className="text-muted-foreground ml-1">this month</span>
                            </div>
                            <Progress value={75} className="mt-3 h-2" />
                            <p className="text-xs text-muted-foreground mt-1">75% of monthly goal</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/50 dark:to-green-900/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Reach</CardTitle>
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Globe className="h-4 w-4 text-green-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">68.2K</div>
                            <div className="flex items-center text-sm">
                                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-600 font-medium">+24%</span>
                                <span className="text-muted-foreground ml-1">this month</span>
                            </div>
                            <Progress value={68} className="mt-3 h-2" />
                            <p className="text-xs text-muted-foreground mt-1">Across all platforms</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/50 dark:to-purple-900/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Engagement</CardTitle>
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Activity className="h-4 w-4 text-purple-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">8.1K</div>
                            <div className="flex items-center text-sm">
                                <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                                <span className="text-green-600 font-medium">+12%</span>
                                <span className="text-muted-foreground ml-1">avg. rate 5.4%</span>
                            </div>
                            <Progress value={54} className="mt-3 h-2" />
                            <p className="text-xs text-muted-foreground mt-1">Above average</p>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/50 dark:to-orange-900/30">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Plan Usage</CardTitle>
                            <div className="p-2 bg-orange-500/10 rounded-lg">
                                <Target className="h-4 w-4 text-orange-600" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">127/200</div>
                            <div className="flex items-center text-sm">
                                <span className="text-muted-foreground">73 generations left</span>
                            </div>
                            <Progress value={63.5} className="mt-3 h-2" />
                            <p className="text-xs text-muted-foreground mt-1">Pro Plan</p>
                        </CardContent>
                    </Card>
                </div>

                {/* User Dashboard Content */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="create">Create</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-2 border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5 text-primary" />
                                        Your Content Performance
                                    </CardTitle>
                                    <CardDescription>Monthly generation and engagement trends</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ChartContainer config={chartConfig}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={userPerformanceData}>
                                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                                <XAxis dataKey="month" className="text-xs" />
                                                <YAxis className="text-xs" />
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
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <UsageChart />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="create" className="space-y-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <GenerationForm onGenerate={handleGeneration} />
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Quick Tips
                                    </CardTitle>
                                    <CardDescription>Maximize your content's impact</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                                            <div>
                                                <h4 className="font-medium text-blue-900 dark:text-blue-100">Be Specific</h4>
                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                    The more detailed your prompt, the better the AI can understand your needs.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                                            <div>
                                                <h4 className="font-medium text-green-900 dark:text-green-100">Platform Optimization</h4>
                                                <p className="text-sm text-green-700 dark:text-green-300">
                                                    Select multiple platforms to get optimized content for each one.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                                            <div className="h-2 w-2 rounded-full bg-purple-500 mt-2"></div>
                                            <div>
                                                <h4 className="font-medium text-purple-900 dark:text-purple-100">Engage Your Audience</h4>
                                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                                    Include questions or calls-to-action to boost engagement rates.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Platform Performance
                                </CardTitle>
                                <CardDescription>How your content performs across platforms</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {userPlatformStats.map((platform) => (
                                        <div key={platform.platform} className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">{platform.platform.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{platform.platform}</h3>
                                                        <p className="text-sm text-muted-foreground">{platform.posts} posts this month</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold">{platform.engagement}%</div>
                                                    <div className="flex items-center text-sm text-green-600">
                                                        <ArrowUp className="h-3 w-3 mr-1" />+{platform.growth}%
                                                    </div>
                                                </div>
                                            </div>
                                            <Progress value={platform.engagement * 10} className="h-2" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

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
                            {userRecentGenerations.map((generation) => (
                                <div
                                    key={generation.id}
                                    className="group flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="space-y-2 flex-1">
                                        <p className="text-sm font-medium leading-none">{generation.content}</p>
                                        <div className="flex items-center gap-4">
                                            <p className="text-xs text-muted-foreground">{generation.createdAt}</p>
                                            <div className="flex gap-1">
                                                {generation.platforms.map((platform) => (
                                                    <Badge key={platform} variant="secondary" className="text-xs">
                                                        {platform}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                {generation.engagement.views}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Heart className="h-3 w-3" />
                                                {generation.engagement.likes}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Share2 className="h-3 w-3" />
                                                {generation.engagement.shares}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                            {generation.status}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
