"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function AdminModerationPage() {
    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
                    <p className="text-muted-foreground">Review and moderate user-generated content</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Content Moderation
                        </CardTitle>
                        <CardDescription>This page is under construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Content moderation features will be implemented here.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
