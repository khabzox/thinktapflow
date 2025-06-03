"use client"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive } from "lucide-react"

export default function LibraryPage() {
    return (
        <DashboardLayout userRole="user">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
                    <p className="text-muted-foreground">Manage and organize your content collection</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Archive className="h-5 w-5" />
                            Content Library
                        </CardTitle>
                        <CardDescription>This page is under construction</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Content library features will be implemented here.</p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
