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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Bell, CheckSquare, Globe, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface ContentCalendarDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: () => void;
}

export function ContentCalendarDialog({ isOpen, onClose, onEnable }: ContentCalendarDialogProps) {
  const [timezone, setTimezone] = useState("GMT+1");
  const [externalCalendars, setExternalCalendars] = useState({
    google_calendar: true,
    outlook_calendar: true,
    apple_calendar: false,
    notion_calendar: true,
  });
  const [calendarFeatures, setCalendarFeatures] = useState({
    visual_planning: true,
    deadline_reminders: true,
    team_collaboration: true,
    approval_workflow: true,
  });
  const [notifications, setNotifications] = useState({
    posting_reminders: true,
    weekly_reviews: true,
    monthly_analytics: true,
    approval_requests: true,
  });

  const timezones = [
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
    { value: "GMT+1", label: "GMT+1 (British Summer Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "CST", label: "CST (Central Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "CET", label: "CET (Central European Time)" },
    { value: "JST", label: "JST (Japan Standard Time)" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xl">
            <Calendar className="h-5 w-5 text-primary" />
            Content Calendar Integration
          </div>
          <DialogDescription className="pt-2">
            Sync your content schedule with external calendars and configure notifications
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-6">
            {/* Time Zone Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-medium">
                  <Globe className="h-5 w-5 text-primary" />
                  Time Zone
                </h4>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-[240px]">
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map(tz => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* External Calendars Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Calendar className="h-5 w-5 text-primary" />
                External Calendars
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Google Calendar</Label>
                    <p className="text-sm text-muted-foreground">Sync with Google workspace</p>
                  </div>
                  <Switch
                    checked={externalCalendars.google_calendar}
                    onCheckedChange={checked =>
                      setExternalCalendars(prev => ({ ...prev, google_calendar: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Outlook Calendar</Label>
                    <p className="text-sm text-muted-foreground">Sync with Microsoft 365</p>
                  </div>
                  <Switch
                    checked={externalCalendars.outlook_calendar}
                    onCheckedChange={checked =>
                      setExternalCalendars(prev => ({ ...prev, outlook_calendar: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Apple Calendar</Label>
                    <p className="text-sm text-muted-foreground">Sync with iCloud</p>
                  </div>
                  <Switch
                    checked={externalCalendars.apple_calendar}
                    onCheckedChange={checked =>
                      setExternalCalendars(prev => ({ ...prev, apple_calendar: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Notion Calendar</Label>
                    <p className="text-sm text-muted-foreground">Sync with Notion workspace</p>
                  </div>
                  <Switch
                    checked={externalCalendars.notion_calendar}
                    onCheckedChange={checked =>
                      setExternalCalendars(prev => ({ ...prev, notion_calendar: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Calendar Features Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <CheckSquare className="h-5 w-5 text-primary" />
                Calendar Features
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Visual content planning</Label>
                    <p className="text-sm text-muted-foreground">Plan content with drag-and-drop</p>
                  </div>
                  <Switch
                    checked={calendarFeatures.visual_planning}
                    onCheckedChange={checked =>
                      setCalendarFeatures(prev => ({ ...prev, visual_planning: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Deadline reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified of upcoming deadlines
                    </p>
                  </div>
                  <Switch
                    checked={calendarFeatures.deadline_reminders}
                    onCheckedChange={checked =>
                      setCalendarFeatures(prev => ({ ...prev, deadline_reminders: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Team collaboration</Label>
                    <p className="text-sm text-muted-foreground">Work together on content</p>
                  </div>
                  <Switch
                    checked={calendarFeatures.team_collaboration}
                    onCheckedChange={checked =>
                      setCalendarFeatures(prev => ({ ...prev, team_collaboration: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Content approval workflow</Label>
                    <p className="text-sm text-muted-foreground">Streamline review process</p>
                  </div>
                  <Switch
                    checked={calendarFeatures.approval_workflow}
                    onCheckedChange={checked =>
                      setCalendarFeatures(prev => ({ ...prev, approval_workflow: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Bell className="h-5 w-5 text-primary" />
                Notification Settings
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">24-hour posting reminders</Label>
                    <p className="text-sm text-muted-foreground">Day-before content alerts</p>
                  </div>
                  <Switch
                    checked={notifications.posting_reminders}
                    onCheckedChange={checked =>
                      setNotifications(prev => ({ ...prev, posting_reminders: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Weekly content reviews</Label>
                    <p className="text-sm text-muted-foreground">Review upcoming content</p>
                  </div>
                  <Switch
                    checked={notifications.weekly_reviews}
                    onCheckedChange={checked =>
                      setNotifications(prev => ({ ...prev, weekly_reviews: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Monthly analytics reports</Label>
                    <p className="text-sm text-muted-foreground">Performance insights</p>
                  </div>
                  <Switch
                    checked={notifications.monthly_analytics}
                    onCheckedChange={checked =>
                      setNotifications(prev => ({ ...prev, monthly_analytics: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Approval request alerts</Label>
                    <p className="text-sm text-muted-foreground">Content review notifications</p>
                  </div>
                  <Switch
                    checked={notifications.approval_requests}
                    onCheckedChange={checked =>
                      setNotifications(prev => ({ ...prev, approval_requests: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Sync Info */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Calendar sync updates every 15 minutes. Changes may take a few minutes to appear.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Skip for Now
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onEnable}
              disabled={!Object.values(externalCalendars).some(Boolean)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enable Calendar Sync
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
