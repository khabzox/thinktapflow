"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export default function AdminAnalyticsPage() {
    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
                    <p className="text-muted-foreground">Platform-wide analytics and insights</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            System Analytics
                        </CardTitle>
                        <CardDescription>This page is under construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">System analytics features will be implemented here.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
