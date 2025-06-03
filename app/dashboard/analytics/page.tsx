"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, BarChart3, TrendingUp, ArrowUp, ArrowDown, Zap, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for analytics
const monthlyData = [
    { name: "Jan", generations: 45, engagement: 320 },
    { name: "Feb", generations: 78, engagement: 450 },
    { name: "Mar", generations: 92, engagement: 520 },
    { name: "Apr", generations: 134, engagement: 680 },
    { name: "May", generations: 127, engagement: 720 },
    { name: "Jun", generations: 150, engagement: 800 },
]

const platformData = [
    { name: "Twitter", value: 35, color: "#1DA1F2" },
    { name: "LinkedIn", value: 25, color: "#0077B5" },
    { name: "Facebook", value: 20, color: "#4267B2" },
    { name: "Instagram", value: 15, color: "#E1306C" },
    { name: "TikTok", value: 5, color: "#000000" },
]

const contentTypeData = [
    { name: "Text", generations: 65, engagement: 420 },
    { name: "Image", generations: 40, engagement: 380 },
    { name: "Video", generations: 25, engagement: 520 },
    { name: "Link", generations: 35, engagement: 280 },
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
}

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground">Track your content performance and engagement</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2">
                            <Calendar className="h-4 w-4" />
                            Last 30 Days
                        </Button>
                        <Button variant="outline" size="icon">
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,248</div>
                            <div className="flex items-center text-xs text-green-500">
                                <ArrowUp className="mr-1 h-3 w-3" />
                                <span>12% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">4.6%</div>
                            <div className="flex items-center text-xs text-green-500">
                                <ArrowUp className="mr-1 h-3 w-3" />
                                <span>0.8% from last month</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Twitter</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <span>35% of total content</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1.2s</div>
                            <div className="flex items-center text-xs text-red-500">
                                <ArrowDown className="mr-1 h-3 w-3" />
                                <span>0.1s from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <Tabs defaultValue="overview">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="platforms">Platforms</TabsTrigger>
                            <TabsTrigger value="content">Content Types</TabsTrigger>
                        </TabsList>
                        <Badge variant="outline" className="ml-auto">
                            Last 30 Days
                        </Badge>
                    </div>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Generation & Engagement</CardTitle>
                                <CardDescription>Monthly content generation and engagement metrics</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ChartContainer config={chartConfig}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis yAxisId="left" />
                                            <YAxis yAxisId="right" orientation="right" />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Line
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="generations"
                                                stroke="hsl(var(--primary))"
                                                activeDot={{ r: 8 }}
                                            />
                                            <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="hsl(var(--chart-2))" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="platforms" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Platform Distribution</CardTitle>
                                    <CardDescription>Content distribution across platforms</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={platformData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={120}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {platformData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Platform Performance</CardTitle>
                                    <CardDescription>Engagement rates by platform</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {platformData.map((platform) => (
                                            <div key={platform.name} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: platform.color }} />
                                                        <span className="font-medium">{platform.name}</span>
                                                    </div>
                                                    <span>{platform.value}%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-muted">
                                                    <div
                                                        className="h-2 rounded-full"
                                                        style={{
                                                            width: `${platform.value}%`,
                                                            backgroundColor: platform.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Content Type Performance</CardTitle>
                                <CardDescription>Generation and engagement by content type</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ChartContainer config={chartConfig}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={contentTypeData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="generations" fill="hsl(var(--primary))" />
                                            <Bar dataKey="engagement" fill="hsl(var(--chart-2))" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Content Recommendations</CardTitle>
                        <CardDescription>AI-powered suggestions to improve your content strategy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-green-500">High Impact</Badge>
                                    <h3 className="font-semibold">Increase Twitter Video Content</h3>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your video content on Twitter has 2.3x higher engagement than text posts. Consider increasing video
                                    content by 20% for optimal results.
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-yellow-500 text-black">Medium Impact</Badge>
                                    <h3 className="font-semibold">Optimize LinkedIn Posting Time</h3>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your LinkedIn posts perform 35% better when published between 8-10am. Consider adjusting your posting
                                    schedule.
                                </p>
                            </div>

                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-blue-500">Insight</Badge>
                                    <h3 className="font-semibold">Hashtag Performance</h3>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Posts with 3-5 hashtags perform 18% better than posts with more or fewer hashtags across all
                                    platforms.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
