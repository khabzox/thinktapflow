import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Clock, Globe } from "lucide-react"
import { useState } from "react"

interface FacebookBusinessDialogProps {
    isOpen: boolean
    onClose: () => void
    onAuthorize: () => void
}

export function FacebookBusinessDialog({
    isOpen,
    onClose,
    onAuthorize,
}: FacebookBusinessDialogProps) {
    const [timezone, setTimezone] = useState<string>("auto")
    const [permissions, setPermissions] = useState({
        pages_manage_posts: true,
        pages_manage_engagement: true,
        pages_read_engagement: true,
        pages_manage_metadata: true
    })
    const [scheduling, setScheduling] = useState({
        immediate_posting: true,
        scheduled_posting: true,
        creator_studio: true,
        business_hours: true
    })

    const timezones = [
        { value: "auto", label: "Auto-detect" },
        { value: "UTC", label: "UTC" },
        { value: "America/New_York", label: "Eastern Time (ET)" },
        { value: "America/Chicago", label: "Central Time (CT)" },
        { value: "America/Denver", label: "Mountain Time (MT)" },
        { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
        { value: "Europe/London", label: "London (GMT)" },
        { value: "Europe/Paris", label: "Central European Time (CET)" },
        { value: "Asia/Tokyo", label: "Japan (JST)" },
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-xl">
                        <Globe className="h-5 w-5 text-[#4267B2]" />
                        Facebook Business Integration
                    </div>
                    <DialogDescription className="pt-2">
                        Configure your Facebook Business account integration settings
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-6 pr-6">
                        {/* Required Permissions Section */}
                        <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-[#4267B2]" />
                                Required Permissions
                            </h4>
                            <div className="ml-7 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Manage and publish posts</Label>
                                        <p className="text-sm text-muted-foreground">pages_manage_posts</p>
                                    </div>
                                    <Switch
                                        checked={permissions.pages_manage_posts}
                                        onCheckedChange={(checked) =>
                                            setPermissions(prev => ({ ...prev, pages_manage_posts: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Schedule content</Label>
                                        <p className="text-sm text-muted-foreground">pages_manage_engagement</p>
                                    </div>
                                    <Switch
                                        checked={permissions.pages_manage_engagement}
                                        onCheckedChange={(checked) =>
                                            setPermissions(prev => ({ ...prev, pages_manage_engagement: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Read page insights</Label>
                                        <p className="text-sm text-muted-foreground">pages_read_engagement</p>
                                    </div>
                                    <Switch
                                        checked={permissions.pages_read_engagement}
                                        onCheckedChange={(checked) =>
                                            setPermissions(prev => ({ ...prev, pages_read_engagement: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Access publishing tools</Label>
                                        <p className="text-sm text-muted-foreground">pages_manage_metadata</p>
                                    </div>
                                    <Switch
                                        checked={permissions.pages_manage_metadata}
                                        onCheckedChange={(checked) =>
                                            setPermissions(prev => ({ ...prev, pages_manage_metadata: checked }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Controls Section */}
                        <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#4267B2]" />
                                Scheduling Controls
                            </h4>
                            <div className="ml-7 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Allow immediate posting</Label>
                                        <p className="text-sm text-muted-foreground">Post content right away</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.immediate_posting}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, immediate_posting: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Enable scheduled posting</Label>
                                        <p className="text-sm text-muted-foreground">Schedule up to 6 months ahead</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.scheduled_posting}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, scheduled_posting: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Access Creator Studio calendar</Label>
                                        <p className="text-sm text-muted-foreground">View and manage content calendar</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.creator_studio}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, creator_studio: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Sync with business hours</Label>
                                        <p className="text-sm text-muted-foreground">Optimize posting schedule</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.business_hours}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, business_hours: checked }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Time Zone Section */}
                        <div className="space-y-4">
                            <h4 className="font-medium">Time Zone</h4>
                            <Select value={timezone} onValueChange={setTimezone}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select time zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timezones.map((tz) => (
                                        <SelectItem key={tz.value} value={tz.value}>
                                            {tz.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="flex sm:justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={onAuthorize}
                            disabled={!Object.values(permissions).every(Boolean)}
                        >
                            Authorize Facebook
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 