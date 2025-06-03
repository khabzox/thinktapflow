import type React from "react"
import type { Metadata } from "next"
import { Toaster } from "sonner"


export const metadata: Metadata = {
    title: "ThinkTapFlow - AI Content Generation",
    description: "Generate engaging content across all platforms with AI",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <Toaster />
        </>
    )
}
