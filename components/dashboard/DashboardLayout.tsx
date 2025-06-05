"use client"

import type { ReactNode } from "react"
import { FileText, Home, Settings, Sparkles, TrendingUp, Archive, Users, Shield, CreditCard, MessagesSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChatButton } from '@/components/chat/ChatButton'
// User navigation items
const userNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Generate", href: "/dashboard/generate", icon: Sparkles },
    { name: "Generations", href: "/dashboard/generations", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Community", href: "/dashboard/community", icon: MessagesSquare },
    { name: "Content Library", href: "/dashboard/library", icon: Archive },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

// Admin navigation items
const adminNavigation = [
    { name: "Admin Dashboard", href: "/dashboard/admin/dashboard", icon: Home },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    { name: "System Analytics", href: "/dashboard/admin/analytics", icon: TrendingUp },
    { name: "Content Moderation", href: "/dashboard/admin/moderation", icon: Shield },
    { name: "Billing & Plans", href: "/dashboard/admin/billing", icon: CreditCard },
    { name: "System Settings", href: "/dashboard/admin/settings", icon: Settings },
]

interface AppSidebarProps {
    userRole?: "user" | "admin"
}

function AppSidebar({ userRole = "user" }: AppSidebarProps) {
    const pathname = usePathname()
    const navigation = userRole === "admin" ? adminNavigation : userNavigation
    const isAdmin = userRole === "admin"

    return (
        <Sidebar className="border-r-0" collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 py-2">
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 ${isAdmin ? "bg-red-600" : "bg-primary"
                            }`}
                    >
                        <Image src="/logo/logosaas-dark.png" alt="ThinkTapFlow Logo" width={32} height={32} className=" text-white" />
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <span className="text-lg font-semibold">ThinkTapFlow</span>
                        {isAdmin && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                                Admin
                            </Badge>
                        )}
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                        {isAdmin ? "Administration" : "Content Tools"}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.name}
                                            className="group relative overflow-hidden"
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent/80"
                                            >
                                                <item.icon className="h-4 w-4 transition-all duration-200 group-hover:scale-110" />
                                                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.name}</span>
                                                {isActive && (
                                                    <div
                                                        className={`absolute inset-0 rounded-lg ${isAdmin
                                                            ? "bg-gradient-to-r from-red-500/10 to-transparent"
                                                            : "bg-gradient-to-r from-primary/10 to-transparent"
                                                            }`}
                                                    />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions for Users */}
                {!isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Quick Actions</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild tooltip="Quick Generate">
                                        <Link href="/dashboard/generate" className="flex items-center gap-3 px-3 py-2 rounded-lg">
                                            <Sparkles className="h-4 w-4" />
                                            <span className="group-data-[collapsible=icon]:hidden">Quick Generate</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <div className="flex items-center gap-3 sm:px-4 py-3 sm:group-data-[collapsible=icon]:px-2 hover:bg-sidebar-accent/80 hover:rounded-lg transition-all duration-200 hover:cursor-pointer">
                    <Avatar className="h-8 w-8 transition-all duration-200 hover:scale-110">
                        <AvatarImage src="/assets/avatar-1.png" />
                        <AvatarFallback
                            className={`font-semibold ${isAdmin ? "bg-red-100 text-red-700" : "bg-primary/10 text-primary"}`}
                        >
                            {isAdmin ? "AD" : "JD"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium truncate">{isAdmin ? "Admin User" : "John Doe"}</p>
                        <div className="text-xs text-muted/70 truncate flex items-center gap-1">
                            <span className={`h-2 w-2 rounded-full inline-block ${isAdmin ? "bg-red-500" : "bg-green-500"}`}></span>
                            {isAdmin ? "Administrator" : "Pro Plan"}
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

interface DashboardLayoutProps {
    children: ReactNode
    userRole?: "user" | "admin"
}

export function DashboardLayout({ children, userRole = "user" }: DashboardLayoutProps) {
    const isAdmin = userRole === "admin"

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full">
                <AppSidebar userRole={userRole} />
                <SidebarInset className="flex-1">
                    <header
                        className={`flex h-16 items-center gap-4 border-b px-6 ${isAdmin
                            ? "bg-red-50/50 backdrop-blur supports-[backdrop-filter]:bg-red-50/30"
                            : "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="hover:bg-popover-foreground hover:text-accent-foreground transition-colors" />
                            <div className="hidden md:flex items-center text-xs text-secondary-foreground bg-muted/50 rounded-md px-2 py-1">
                                <kbd className="px-1 py-0.5 text-xs font-mono">Ctrl</kbd>
                                <span className="mx-1">+</span>
                                <kbd className="px-1 py-0.5 text-xs font-mono">B</kbd>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
                                <Input
                                    placeholder={isAdmin ? "Search users, content..." : "Search content..."}
                                    className="pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:popover-foreground/20 transition-all duration-200"
                                />
                            </div>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center gap-2">
                                <Badge variant="destructive" className="text-xs">
                                    Admin Mode
                                </Badge>
                            </div>
                        )}
                    </header>

                    <main
                        className={`flex-1 overflow-auto p-6 ${isAdmin
                            ? "bg-gradient-to-br from-red-50/30 via-background to-red-50/20"
                            : "bg-gradient-to-br from-background via-background to-muted/20"
                            }`}
                    >
                        {children}
                    </main>
                </SidebarInset>
            </div>
            <ChatButton />
        </SidebarProvider>
    )
}
