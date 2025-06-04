"use client"

import { useState, useRef } from "react"
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
    Shield,
    User,
    Check,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    TwitterIcon as TikTok,
    Youtube,
    Calendar,
    AlertCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PlatformConnectDialog } from "@/components/ui/platform-connect-dialog"
import { FacebookBusinessDialog } from "@/components/ui/facebook-business-dialog"
import { InstagramBusinessDialog } from "@/components/ui/instagram-business-dialog"
import { TwitterIntegrationDialog } from "@/components/ui/twitter-integration-dialog"
import { LinkedInProfessionalDialog } from "@/components/ui/linkedin-professional-dialog"
import { ContentCalendarDialog } from "@/components/ui/content-calendar-dialog"
import { useUserSettings } from "@/hooks/use-user-settings"

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Cpath d='M20 21a8 8 0 0 0-16 0'/%3E%3C/svg%3E"

export default function SettingsPage() {
    const {
        loading,
        saving,
        profile,
        settings,
        uploadingAvatar,
        handleProfileChange,
        handleSettingsChange,
        saveProfile,
        saveSettings,
        updatePassword,
        uploadAvatar
    } = useUserSettings()

    const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
    const [showFacebookBusiness, setShowFacebookBusiness] = useState(false);
    const [showInstagramBusiness, setShowInstagramBusiness] = useState(false);
    const [showTwitterIntegration, setShowTwitterIntegration] = useState(false);
    const [showLinkedInProfessional, setShowLinkedInProfessional] = useState(false);
    const [showContentCalendar, setShowContentCalendar] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfileChange({ full_name: e.target.value })
    }

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfileChange({ username: e.target.value })
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfileChange({ email: e.target.value })
    }

    const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleProfileChange({ bio: e.target.value })
    }

    const handleEmailNotificationsChange = (checked: boolean) => {
        handleSettingsChange({ email_notifications: checked })
    }

    const handleContentUpdatesChange = (checked: boolean) => {
        handleSettingsChange({ content_updates: checked })
    }

    const handleMarketingUpdatesChange = (checked: boolean) => {
        handleSettingsChange({ marketing_updates: checked })
    }

    const handleTwoFactorChange = (checked: boolean) => {
        handleSettingsChange({ two_factor_enabled: checked })
    }

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        // Password validation
        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return
        }

        const success = await updatePassword(currentPassword, newPassword)
        if (success) {
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            await uploadAvatar(file)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error updating avatar')
        }
    }

    const handleConnectPlatform = (platform: string) => {
        setConnectingPlatform(platform);
    }

    const handleContinueConnect = () => {
        if (connectingPlatform) {
            if (connectingPlatform === "Facebook") {
                setShowFacebookBusiness(true);
            } else if (connectingPlatform === "Instagram") {
                setShowInstagramBusiness(true);
            } else if (connectingPlatform === "Twitter") {
                setShowTwitterIntegration(true);
            } else if (connectingPlatform === "LinkedIn") {
                setShowLinkedInProfessional(true);
            } else {
                // Handle other platforms
                toast.success(`Connected to ${connectingPlatform}`);
            }
            setConnectingPlatform(null);
        }
    }

    const handleAuthorizeFacebook = () => {
        // Here you would implement the actual Facebook authorization logic
        toast.success("Facebook Business account connected successfully");
        setShowFacebookBusiness(false);
    }

    const handleConnectInstagram = () => {
        // Here you would implement the actual Instagram authorization logic
        toast.success("Instagram Business account connected successfully");
        setShowInstagramBusiness(false);
    }

    const handleAuthorizeTwitter = () => {
        // Here you would implement the actual Twitter authorization logic
        toast.success("Twitter account connected successfully");
        setShowTwitterIntegration(false);
    }

    const handleConnectLinkedIn = () => {
        // Here you would implement the actual LinkedIn authorization logic
        toast.success("LinkedIn Professional account connected successfully");
        setShowLinkedInProfessional(false);
    }

    const handleEnableCalendarSync = () => {
        toast.success("Calendar sync enabled successfully");
        setShowContentCalendar(false);
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        )
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
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="account" className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Account
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            Notifications
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Billing
                        </TabsTrigger>
                        <TabsTrigger value="integrations" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Integrations
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
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 cursor-pointer" onClick={handleAvatarClick}>
                                            <AvatarImage src={profile?.avatar_url || DEFAULT_AVATAR} />
                                            <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        {uploadingAvatar && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Profile Picture</p>
                                        <p className="text-sm text-muted-foreground">Click to upload a new avatar</p>
                                        <p className="text-xs text-muted-foreground">Max file size: 2MB</p>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profile?.full_name || ""}
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={profile?.username || ""}
                                            onChange={handleUsernameChange}
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile?.email || ""}
                                            onChange={handleEmailChange}
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Input
                                            id="bio"
                                            value={profile?.bio || ""}
                                            onChange={handleBioChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={saveProfile} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Account Tab */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>Manage your account security settings</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Password Change Section */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input
                                                id="current-password"
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input
                                                id="new-password"
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Password must be at least 8 characters long
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Two-Factor Authentication Section */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <div className="font-medium">Two-Factor Authentication (2FA)</div>
                                                <div className="text-sm text-muted-foreground">
                                                    Add an extra layer of security to your account
                                                </div>
                                            </div>
                                            <Switch
                                                checked={settings?.two_factor_enabled}
                                                onCheckedChange={handleTwoFactorChange}
                                                disabled={true}
                                            />
                                        </div>
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Two-factor authentication will be available soon. This feature is currently under development.
                                            </AlertDescription>
                                        </Alert>
                                        <div className="text-sm text-muted-foreground">
                                            When enabled, you&apos;ll need to enter a code from your authenticator app in addition to your password when signing in.
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end space-x-2">
                                <Button 
                                    onClick={handleSavePassword} 
                                    disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                                >
                                    {saving ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Updating Password...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
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
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Email Notifications</div>
                                            <div className="text-sm text-muted-foreground">
                                                Receive email notifications for important updates
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings?.email_notifications}
                                            onCheckedChange={handleEmailNotificationsChange}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Content Generation Updates</div>
                                            <div className="text-sm text-muted-foreground">
                                                Get notified when your content is ready
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings?.content_updates}
                                            onCheckedChange={handleContentUpdatesChange}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Marketing Updates</div>
                                            <div className="text-sm text-muted-foreground">
                                                Receive updates about new features
                                            </div>
                                        </div>
                                        <Switch
                                            checked={settings?.marketing_updates}
                                            onCheckedChange={handleMarketingUpdatesChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={saveSettings} disabled={saving}>
                                    {saving ? (
                                        <>
                                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Preferences'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Billing Tab */}
                    <TabsContent value="billing">
                        <Card>
                            <CardHeader>
                                <CardTitle>Subscription Plan</CardTitle>
                                <CardDescription>Manage your subscription and billing</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Alert className="bg-yellow-50 border-yellow-200">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-600">
                                        This page is under construction. Enhanced billing features will be implemented soon.
                                    </AlertDescription>
                                </Alert>

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
                                <CardTitle>Social Media Integrations</CardTitle>
                                <CardDescription>Connect your social media accounts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-600">
                                        Content library features will be implemented here. More integrations coming soon.
                                    </AlertDescription>
                                </Alert>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    {/* Calendar Integration Card */}
                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Content Calendar</p>
                                                <p className="text-sm text-muted-foreground">Not configured</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => setShowContentCalendar(true)}>
                                            Configure
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1DA1F2] text-white">
                                                <Twitter className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Twitter</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("Twitter")}>
                                            Connect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0077B5] text-white">
                                                <Linkedin className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">LinkedIn</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("LinkedIn")}>
                                            Connect
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4267B2] text-white">
                                                <Facebook className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Facebook</p>
                                                <p className="text-sm text-muted-foreground">Not connected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleConnectPlatform("Facebook")}>
                                            Connect
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
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <PlatformConnectDialog
                isOpen={!!connectingPlatform}
                onClose={() => setConnectingPlatform(null)}
                onContinue={handleContinueConnect}
                platformName={connectingPlatform || ""}
            />
            <FacebookBusinessDialog
                isOpen={showFacebookBusiness}
                onClose={() => setShowFacebookBusiness(false)}
                onAuthorize={handleAuthorizeFacebook}
            />
            <InstagramBusinessDialog
                isOpen={showInstagramBusiness}
                onClose={() => setShowInstagramBusiness(false)}
                onConnect={handleConnectInstagram}
            />
            <TwitterIntegrationDialog
                isOpen={showTwitterIntegration}
                onClose={() => setShowTwitterIntegration(false)}
                onAuthorize={handleAuthorizeTwitter}
            />
            <LinkedInProfessionalDialog
                isOpen={showLinkedInProfessional}
                onClose={() => setShowLinkedInProfessional(false)}
                onConnect={handleConnectLinkedIn}
            />
            <ContentCalendarDialog
                isOpen={showContentCalendar}
                onClose={() => setShowContentCalendar(false)}
                onEnable={handleEnableCalendarSync}
            />
        </DashboardLayout>
    )
}
