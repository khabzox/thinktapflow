"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminSettingsPage() {
    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                    <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            System Configuration
                        </CardTitle>
                        <CardDescription>This page is under construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">System settings will be implemented here.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
