import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings } from 'lucide-react'
import { ProfileForm } from '@/types/community'
import { sanitizeUsername } from '@/utils/communityUtils'

interface ProfileCompletionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profileForm: ProfileForm
    setProfileForm: React.Dispatch<React.SetStateAction<ProfileForm>>
    onComplete: () => Promise<void>
    onRedirectToSettings: () => void
    updating: boolean
}

export const ProfileCompletionModal = ({
    open,
    onOpenChange,
    profileForm,
    setProfileForm,
    onComplete,
    onRedirectToSettings,
    updating
}: ProfileCompletionModalProps) => {
    const handleUsernameChange = (value: string) => {
        setProfileForm(prev => ({ ...prev, username: sanitizeUsername(value) }))
    }

    const isFormValid = profileForm.full_name.trim() && profileForm.username.trim()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide your name and username to join the community
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            placeholder="Enter your full name"
                            value={profileForm.full_name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                        />
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            placeholder="Choose a username"
                            value={profileForm.username}
                            onChange={(e) => handleUsernameChange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Only lowercase letters, numbers, and underscores allowed
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={onComplete}
                            disabled={updating || !isFormValid}
                            className="flex-1"
                        >
                            {updating ? 'Updating...' : 'Complete Profile'}
                        </Button>
                        <Button variant="outline" onClick={onRedirectToSettings}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}