"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import {
    Bell,
    CreditCard,
    Globe,
    Moon,
    Shield,
    Sun,
    User,
    Check,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    TwitterIcon as TikTok,
    Youtube,
} from "lucide-react"

export default function SettingsPage() {
    const [theme, setTheme] = useState("system")

    const handleSaveProfile = () => {
        toast.success("Profile settings saved successfully")
    }

    const handleSaveNotifications = () => {
        toast.success("Notification preferences updated")
    }

    const handleSavePassword = () => {
        toast.success("Password updated successfully")
    }

    const handleConnectPlatform = (platform: string) => {
        toast.success(`Connected to ${platform}`)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <Tabs defaultValue="profile" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="account" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="hidden sm:inline">Account</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <span className="hidden sm:inline">Billing</span>
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="hidden sm:inline">Integrations</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile</CardTitle>
                                <CardDescription>Manage your public profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                            Change Avatar
                                        </Button>
                                        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" defaultValue="johndoe" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue="john.doe@example.com" />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input id="bio" defaultValue="Content creator and digital marketer" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={handleSaveProfile}>Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account">
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                    <CardDescription>Change your password</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input id="confirm-password" type="password" />
                                    </div>
                                </CardContent>
                                <CardFooter className="justify-end">
                                    <Button onClick={handleSavePassword}>Update Password</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize the appearance of the application</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Theme</Label>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 ${theme === "light" ? "border-primary bg-muted" : ""
                                                    }`}
                                                onClick={() => setTheme("light")}
                                            >
                                                <Sun className="h-5 w-5" />
                                                <span className="text-sm">Light</span>
                                            </div>
                                            <div
                                                className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 ${theme === "dark" ? "border-primary bg-muted" : ""
                                                    }`}
                                                onClick={() => setTheme("dark")}
                                            >
                                                <Moon className="h-5 w-5" />
                                                <span className="text-sm">Dark</span>
                                            </div>
                                            <div
                                                className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border p-3 ${theme === "system" ? "border-primary bg-muted" : ""
                                                    }`}
                                                onClick={() => setTheme("system")}
                                            >
                                                <div className="flex">
                                                    <Sun className="h-5 w-5" />
                                                    <Moon className="h-5 w-5" />
                                                </div>
                                                <span className="text-sm">System</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Two-Factor Authentication</div>
                                            <div className="text-sm text-muted-foreground">
                                                Secure your account with two-factor authentication
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Choose how you want to be notified</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 text-lg font-medium">Email Notifications</h3>
                                        <Separator className="my-2" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Content Generation</div>
                                            <div className="text-sm text-muted-foreground">
                                                Get notified when your content generation is complete
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Weekly Reports</div>
                                            <div className="text-sm text-muted-foreground">
                                                Receive weekly performance reports for your content
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Product Updates</div>
                                            <div className="text-sm text-muted-foreground">Get notified about new features and updates</div>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-lg font-medium">Push Notifications</h3>
                                        <Separator className="my-2" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Content Generation</div>
                                            <div className="text-sm text-muted-foreground">
                                                Get notified when your content generation is complete
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Usage Limits</div>
                                            <div className="text-sm text-muted-foreground">
                                                Get notified when you're approaching your usage limits
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Plan</CardTitle>
                                <CardDescription>Manage your subscription and billing information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold">Pro Plan</h3>
                                            <p className="text-sm text-muted-foreground">$19/month, billed monthly</p>
                                        </div>
                                        <Badge>Current Plan</Badge>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">200 generations per month</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">All social media platforms</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Advanced analytics</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">Priority support</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold">Payment Method</h3>
                                    <div className="flex items-center gap-4 rounded-lg border p-4">
                                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Visa ending in 4242</p>
                                            <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="ml-auto">
                                            Change
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-semibold">Billing History</h3>
                                    <div className="rounded-lg border">
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="font-medium">Pro Plan - Monthly</p>
                                                <p className="text-sm text-muted-foreground">June 1, 2025</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">$19.00</p>
                                                <Badge variant="outline" className="text-xs">
                                                    Paid
                                                </Badge>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="font-medium">Pro Plan - Monthly</p>
                                                <p className="text-sm text-muted-foreground">May 1, 2025</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">$19.00</p>
                                                <Badge variant="outline" className="text-xs">
                                                    Paid
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button variant="outline">Download Invoices</Button>
                                <Button variant="destructive">Cancel Subscription</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Integrations Tab */}
                    <TabsContent value="integrations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Platform Integrations</CardTitle>
                                <CardDescription>Connect your social media accounts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white">
                                                <Twitter className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Twitter</p>
                                                <p className="text-sm text-muted-foreground">Connected as @johndoe</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Disconnect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0077B5] text-white">
                                                <Linkedin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">LinkedIn</p>
                                                <p className="text-sm text-muted-foreground">Connected as John Doe</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Disconnect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4267B2] text-white">
                                                <Facebook className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Facebook</p>
                                                <p className="text-sm text-green-500">Connected</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            Disconnect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                                                <Instagram className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Instagram</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("Instagram")}>
                                            Connect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                                                <TikTok className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">TikTok</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("TikTok")}>
                                            Connect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0000] text-white">
                                                <Youtube className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">YouTube</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("YouTube")}>
                                            Connect
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <p className="text-sm text-muted-foreground">
                                    Connect your accounts to automatically post generated content
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
