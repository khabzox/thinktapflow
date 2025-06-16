import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

export function LoadingScreen() {
    return (
        <DashboardLayout>
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Loading community...</p>
                </div>
            </div>
        </DashboardLayout>
    )
}