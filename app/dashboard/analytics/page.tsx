"use client"

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Construction, LineChart, BarChart3, PieChart, TrendingUp, Clock, Users, Activity } from 'lucide-react'

export default function AnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">Track and analyze your content performance</p>
                </div>

                {/* Under Development Notice */}
                <Card className="border-2 border-dashed">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Construction className="h-6 w-6 text-yellow-500" />
                            <CardTitle>Under Development</CardTitle>
                        </div>
                        <CardDescription>
                            We're working hard to bring you powerful analytics features. Coming soon!
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Preview Cards */}
                            <Card className="bg-muted/50">
                                <CardHeader className="space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <LineChart className="h-4 w-4 text-muted-foreground inline mr-2" />
                                        Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Coming Soon</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/50">
                                <CardHeader className="space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <BarChart3 className="h-4 w-4 text-muted-foreground inline mr-2" />
                                        Engagement Stats
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Coming Soon</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/50">
                                <CardHeader className="space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <PieChart className="h-4 w-4 text-muted-foreground inline mr-2" />
                                        Content Distribution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Coming Soon</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-muted/50">
                                <CardHeader className="space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground inline mr-2" />
                                        Growth Trends
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Coming Soon</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Upcoming Features */}
                        <div className="mt-8">
                            <h3 className="font-semibold mb-4">Upcoming Features</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-start gap-2">
                                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Real-time Analytics</p>
                                        <p className="text-sm text-muted-foreground">
                                            Track your content performance in real-time across all platforms
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Audience Insights</p>
                                        <p className="text-sm text-muted-foreground">
                                            Understand your audience demographics and behavior
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Posting Time Optimization</p>
                                        <p className="text-sm text-muted-foreground">
                                            Get recommendations for the best times to post
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Performance Reports</p>
                                        <p className="text-sm text-muted-foreground">
                                            Generate detailed reports and export analytics data
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
