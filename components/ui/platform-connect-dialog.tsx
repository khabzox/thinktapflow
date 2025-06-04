"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Shield, CheckCircle2, XCircle } from "lucide-react"

interface PlatformConnectDialogProps {
    isOpen: boolean
    onClose: () => void
    onContinue: () => void
    platformName: string
}

export function PlatformConnectDialog({
    isOpen,
    onClose,
    onContinue,
    platformName,
}: PlatformConnectDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-xl">
                        <Shield className="h-5 w-5 text-primary" />
                        Connect {platformName} to ThinkTapFlow
                    </div>
                    <DialogDescription className="pt-2">
                        We need permission to help you manage and schedule your content across social platforms.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium flex items-center gap-2 text-primary">
                                <CheckCircle2 className="h-5 w-5" />
                                What we'll do:
                            </h4>
                            <ul className="mt-2 ml-7 space-y-1 text-sm text-muted-foreground list-disc">
                                <li>Generate and post content on your behalf</li>
                                <li>Schedule posts for optimal engagement times</li>
                                <li>Access your posting calendar and analytics</li>
                                <li>Read basic profile information</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium flex items-center gap-2 text-destructive">
                                <XCircle className="h-5 w-5" />
                                What we WON'T do:
                            </h4>
                            <ul className="mt-2 ml-7 space-y-1 text-sm text-muted-foreground list-disc">
                                <li>Access private messages or DMs</li>
                                <li>View personal data beyond public profile</li>
                                <li>Post without your explicit approval</li>
                                <li>Share your data with third parties</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex sm:justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Learn More
                        </Button>
                        <Button onClick={onContinue}>
                            Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 