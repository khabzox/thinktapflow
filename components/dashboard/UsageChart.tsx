"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Crown, Zap } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const monthlyData = [
    { month: "Jan", generations: 45, limit: 200 },
    { month: "Feb", generations: 78, limit: 200 },
    { month: "Mar", generations: 92, limit: 200 },
    { month: "Apr", generations: 134, limit: 200 },
    { month: "May", generations: 127, limit: 200 },
]

const chartConfig = {
    generations: {
        label: "Generations",
        color: "hsl(var(--primary))",
    },
}

export function UsageChart() {
    const currentUsage = 127
    const monthlyLimit = 200
    const usagePercentage = (currentUsage / monthlyLimit) * 100
    const isNearLimit = usagePercentage > 80

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Usage Overview
                    </CardTitle>
                    <CardDescription>Your monthly generation usage and limits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">This Month</span>
                            <Badge variant={isNearLimit ? "destructive" : "secondary"}>
                                {currentUsage}/{monthlyLimit}
                            </Badge>
                        </div>
                        <Progress value={usagePercentage} className="h-2" />
                        <p className="text-xs text-muted-foreground">{monthlyLimit - currentUsage} generations remaining</p>
                    </div>

                    <div className="h-[200px]">
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="generations" radius={[4, 4, 0, 0]}>
                                        {monthlyData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.generations / entry.limit > 0.8 ? "#ef4444" : "hsl(var(--primary))"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        Upgrade to Pro
                    </CardTitle>
                    <CardDescription>Unlock unlimited generations and premium features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>Unlimited generations</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>Priority support</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>Advanced analytics</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span>Custom templates</span>
                        </div>
                    </div>

                    <Button className="w-full" size="sm">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade Now
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">Starting at $19/month</p>
                </CardContent>
            </Card>
        </div>
    )
}
