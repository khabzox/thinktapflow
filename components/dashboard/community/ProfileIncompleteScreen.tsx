import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus, Settings } from 'lucide-react'
import { UserProfile } from '@/types/community'
import { ProfileCompletionModal } from './ProfileCompletionModal'

interface ProfileIncompleteScreenProps {
    userProfile: UserProfile
    showProfileModal: boolean
    setShowProfileModal: (show: boolean) => void
    onCompleteProfile: () => Promise<void>
    onRedirectToSettings: () => void
}

/**
 * Displays a screen prompting the user to complete their profile before joining the community chat.
 *
 * Renders a card indicating which profile fields are missing and provides options to open a profile completion modal or navigate to settings.
 */
export function ProfileIncompleteScreen({
    userProfile,
    showProfileModal,
    setShowProfileModal,
    onCompleteProfile,
    onRedirectToSettings
}: ProfileIncompleteScreenProps) {
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">Connect with other ThinkTapFlow users</p>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <UserPlus className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle>Complete Your Profile</CardTitle>
                        <CardDescription>
                            To join the community chat, please complete your profile with a name and username
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Missing: {!userProfile?.full_name && 'Name'} {!userProfile?.full_name && !userProfile?.username && ' and '} {!userProfile?.username && 'Username'}
                            </p>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => setShowProfileModal(true)}>
                                Complete Profile
                            </Button>
                            <Button variant="outline" onClick={onRedirectToSettings}>
                                <Settings className="h-4 w-4 mr-2" />
                                Go to Settings
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <ProfileCompletionModal
                    open={showProfileModal}
                    onOpenChange={setShowProfileModal}
                    // fix: userProfile is not defined
                    userProfile={userProfile}
                    onComplete={onCompleteProfile}
                    onRedirectToSettings={onRedirectToSettings}
                />
            </div>
        </DashboardLayout>
    )
}