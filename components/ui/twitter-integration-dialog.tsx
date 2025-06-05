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
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Clock, Send, BarChart2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

interface TwitterIntegrationDialogProps {
    isOpen: boolean
    onClose: () => void
    onAuthorize: () => void
}

export function TwitterIntegrationDialog({
    isOpen,
    onClose,
    onAuthorize,
}: TwitterIntegrationDialogProps) {
    const [publishingRights, setPublishingRights] = useState({
        compose_tweets: true,
        upload_media: true,
        schedule_tweets: true,
        access_analytics: true
    })
    const [scheduling, setScheduling] = useState({
        thread_scheduling: true,
        optimal_timing: true,
        timezone_sync: true,
        auto_delete: false
    })

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-xl">
                        <Send className="h-5 w-5 text-[#1DA1F2]" />
                        Twitter Integration
                    </div>
                    <DialogDescription className="pt-2">
                        Configure your Twitter account integration settings
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh]">
                    <div className="space-y-6 pr-6">
                        {/* Rate Limit Alert */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Standard rate limit: 300 tweets per hour
                            </AlertDescription>
                        </Alert>

                        {/* Publishing Rights Section */}
                        <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <Send className="h-5 w-5 text-[#1DA1F2]" />
                                Publishing Rights
                            </h4>
                            <div className="ml-7 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Compose and publish tweets</Label>
                                        <p className="text-sm text-muted-foreground">Create and post tweets</p>
                                    </div>
                                    <Switch
                                        checked={publishingRights.compose_tweets}
                                        onCheckedChange={(checked) =>
                                            setPublishingRights(prev => ({ ...prev, compose_tweets: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Upload media</Label>
                                        <p className="text-sm text-muted-foreground">Share images, videos, and GIFs</p>
                                    </div>
                                    <Switch
                                        checked={publishingRights.upload_media}
                                        onCheckedChange={(checked) =>
                                            setPublishingRights(prev => ({ ...prev, upload_media: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Schedule tweets</Label>
                                        <p className="text-sm text-muted-foreground">Plan tweets up to 18 months ahead</p>
                                    </div>
                                    <Switch
                                        checked={publishingRights.schedule_tweets}
                                        onCheckedChange={(checked) =>
                                            setPublishingRights(prev => ({ ...prev, schedule_tweets: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Access Twitter Analytics</Label>
                                        <p className="text-sm text-muted-foreground">View engagement metrics</p>
                                    </div>
                                    <Switch
                                        checked={publishingRights.access_analytics}
                                        onCheckedChange={(checked) =>
                                            setPublishingRights(prev => ({ ...prev, access_analytics: checked }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Options Section */}
                        <div className="space-y-4">
                            <h4 className="font-medium flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#1DA1F2]" />
                                Scheduling Options
                            </h4>
                            <div className="ml-7 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Thread scheduling</Label>
                                        <p className="text-sm text-muted-foreground">Schedule tweet threads</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.thread_scheduling}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, thread_scheduling: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Optimal timing suggestions</Label>
                                        <p className="text-sm text-muted-foreground">AI-powered posting times</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.optimal_timing}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, optimal_timing: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Time zone synchronization</Label>
                                        <p className="text-sm text-muted-foreground">Match audience time zones</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.timezone_sync}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, timezone_sync: checked }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label className="font-medium">Auto-delete old scheduled tweets</Label>
                                        <p className="text-sm text-muted-foreground">Clean up unposted tweets</p>
                                    </div>
                                    <Switch
                                        checked={scheduling.auto_delete}
                                        onCheckedChange={(checked) =>
                                            setScheduling(prev => ({ ...prev, auto_delete: checked }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Analytics Preview */}
                        <div className="rounded-lg border p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="h-5 w-5 text-[#1DA1F2]" />
                                <h4 className="font-medium">Analytics Preview</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Access comprehensive analytics including engagement rates, 
                                impressions, follower growth, and best performing content.
                            </p>
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
                            disabled={!Object.values(publishingRights).some(Boolean)}
                            className="bg-[#1DA1F2] text-white hover:bg-[#1a94e0]"
                        >
                            Authorize Twitter
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 