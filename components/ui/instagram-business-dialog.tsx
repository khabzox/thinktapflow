import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Camera, Clock, BarChart2 } from "lucide-react";
import { useState } from "react";

interface InstagramBusinessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function InstagramBusinessDialog({
  isOpen,
  onClose,
  onConnect,
}: InstagramBusinessDialogProps) {
  const [accountType, setAccountType] = useState<"business" | "creator" | "personal">("business");
  const [contentManagement, setContentManagement] = useState({
    photos_videos: true,
    stories_reels: true,
    creator_studio: true,
    content_insights: true,
  });
  const [scheduling, setScheduling] = useState({
    optimal_times: true,
    custom_calendar: true,
    auto_publish: true,
    reminders: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xl">
            <Camera className="h-5 w-5 text-[#E1306C]" />
            Instagram Business Account
          </div>
          <DialogDescription className="pt-2">
            Configure your Instagram account integration settings
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-6">
            {/* Account Type Section */}
            <div className="space-y-4">
              <h4 className="font-medium">Account Type</h4>
              <RadioGroup
                value={accountType}
                onValueChange={(value: "business" | "creator" | "personal") =>
                  setAccountType(value)
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="business" id="business" />
                  <Label htmlFor="business" className="font-medium">
                    Business
                    <p className="text-sm font-normal text-muted-foreground">
                      For brands and organizations
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="creator" id="creator" />
                  <Label htmlFor="creator" className="font-medium">
                    Creator
                    <p className="text-sm font-normal text-muted-foreground">
                      For influencers and content creators
                    </p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="personal" id="personal" />
                  <Label htmlFor="personal" className="font-medium">
                    Personal
                    <p className="text-sm font-normal text-muted-foreground">
                      Limited features, not recommended
                    </p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Content Management Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <BarChart2 className="h-5 w-5 text-[#E1306C]" />
                Content Management
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Publish photos and videos</Label>
                    <p className="text-sm text-muted-foreground">Post media content to your feed</p>
                  </div>
                  <Switch
                    checked={contentManagement.photos_videos}
                    onCheckedChange={checked =>
                      setContentManagement(prev => ({ ...prev, photos_videos: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Publish Stories and Reels</Label>
                    <p className="text-sm text-muted-foreground">
                      Create engaging short-form content
                    </p>
                  </div>
                  <Switch
                    checked={contentManagement.stories_reels}
                    onCheckedChange={checked =>
                      setContentManagement(prev => ({ ...prev, stories_reels: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Schedule via Creator Studio</Label>
                    <p className="text-sm text-muted-foreground">Plan and schedule content ahead</p>
                  </div>
                  <Switch
                    checked={contentManagement.creator_studio}
                    onCheckedChange={checked =>
                      setContentManagement(prev => ({ ...prev, creator_studio: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Access content insights</Label>
                    <p className="text-sm text-muted-foreground">View performance analytics</p>
                  </div>
                  <Switch
                    checked={contentManagement.content_insights}
                    onCheckedChange={checked =>
                      setContentManagement(prev => ({ ...prev, content_insights: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Scheduling Preferences Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Clock className="h-5 w-5 text-[#E1306C]" />
                Scheduling Preferences
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Optimal posting times</Label>
                    <p className="text-sm text-muted-foreground">AI-suggested best times to post</p>
                  </div>
                  <Switch
                    checked={scheduling.optimal_times}
                    onCheckedChange={checked =>
                      setScheduling(prev => ({ ...prev, optimal_times: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Custom scheduling calendar</Label>
                    <p className="text-sm text-muted-foreground">Plan your content calendar</p>
                  </div>
                  <Switch
                    checked={scheduling.custom_calendar}
                    onCheckedChange={checked =>
                      setScheduling(prev => ({ ...prev, custom_calendar: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Auto-publish approved content</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically post approved content
                    </p>
                  </div>
                  <Switch
                    checked={scheduling.auto_publish}
                    onCheckedChange={checked =>
                      setScheduling(prev => ({ ...prev, auto_publish: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Send reminders before posting</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified before scheduled posts
                    </p>
                  </div>
                  <Switch
                    checked={scheduling.reminders}
                    onCheckedChange={checked =>
                      setScheduling(prev => ({ ...prev, reminders: checked }))
                    }
                  />
                </div>
              </div>
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
              onClick={onConnect}
              disabled={
                accountType === "personal" || !Object.values(contentManagement).some(Boolean)
              }
              className="bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90"
            >
              Connect Instagram
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
