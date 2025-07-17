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
import { Briefcase, FileText, Building2, BarChart2, CalendarClock } from "lucide-react";
import { useState } from "react";

interface LinkedInProfessionalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function LinkedInProfessionalDialog({
  isOpen,
  onClose,
  onConnect,
}: LinkedInProfessionalDialogProps) {
  const [businessFeatures, setBusinessFeatures] = useState({
    personal_profile: true,
    company_pages: true,
    schedule_content: true,
    access_analytics: true,
  });
  const [contentTypes, setContentTypes] = useState({
    text_articles: true,
    image_video: true,
    document_carousel: true,
    event_poll: true,
  });
  const [postingSchedule, setPostingSchedule] = useState({
    business_hours: true,
    industry_timing: true,
    global_audience: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-[#0077B5]" />
            LinkedIn Professional
          </div>
          <DialogDescription className="pt-2">
            Configure your LinkedIn professional integration settings
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-6">
            {/* Business Features Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <Building2 className="h-5 w-5 text-[#0077B5]" />
                Business Features
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Publish to personal profile</Label>
                    <p className="text-sm text-muted-foreground">Share content on your profile</p>
                  </div>
                  <Switch
                    checked={businessFeatures.personal_profile}
                    onCheckedChange={checked =>
                      setBusinessFeatures(prev => ({ ...prev, personal_profile: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Manage company pages</Label>
                    <p className="text-sm text-muted-foreground">Control organization presence</p>
                  </div>
                  <Switch
                    checked={businessFeatures.company_pages}
                    onCheckedChange={checked =>
                      setBusinessFeatures(prev => ({ ...prev, company_pages: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Schedule professional content</Label>
                    <p className="text-sm text-muted-foreground">Plan and automate posting</p>
                  </div>
                  <Switch
                    checked={businessFeatures.schedule_content}
                    onCheckedChange={checked =>
                      setBusinessFeatures(prev => ({ ...prev, schedule_content: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Access LinkedIn Analytics</Label>
                    <p className="text-sm text-muted-foreground">Track engagement and growth</p>
                  </div>
                  <Switch
                    checked={businessFeatures.access_analytics}
                    onCheckedChange={checked =>
                      setBusinessFeatures(prev => ({ ...prev, access_analytics: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Content Types Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <FileText className="h-5 w-5 text-[#0077B5]" />
                Content Types
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Text posts and articles</Label>
                    <p className="text-sm text-muted-foreground">Share written content</p>
                  </div>
                  <Switch
                    checked={contentTypes.text_articles}
                    onCheckedChange={checked =>
                      setContentTypes(prev => ({ ...prev, text_articles: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Image and video content</Label>
                    <p className="text-sm text-muted-foreground">Share visual media</p>
                  </div>
                  <Switch
                    checked={contentTypes.image_video}
                    onCheckedChange={checked =>
                      setContentTypes(prev => ({ ...prev, image_video: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Document and carousel posts</Label>
                    <p className="text-sm text-muted-foreground">Share presentations and PDFs</p>
                  </div>
                  <Switch
                    checked={contentTypes.document_carousel}
                    onCheckedChange={checked =>
                      setContentTypes(prev => ({ ...prev, document_carousel: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Event and poll creation</Label>
                    <p className="text-sm text-muted-foreground">Create interactive content</p>
                  </div>
                  <Switch
                    checked={contentTypes.event_poll}
                    onCheckedChange={checked =>
                      setContentTypes(prev => ({ ...prev, event_poll: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Posting Schedule Section */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-medium">
                <CalendarClock className="h-5 w-5 text-[#0077B5]" />
                Posting Schedule
              </h4>
              <div className="ml-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Business hours optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Post during peak engagement times
                    </p>
                  </div>
                  <Switch
                    checked={postingSchedule.business_hours}
                    onCheckedChange={checked =>
                      setPostingSchedule(prev => ({ ...prev, business_hours: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Industry-specific timing</Label>
                    <p className="text-sm text-muted-foreground">Target your sector's peak hours</p>
                  </div>
                  <Switch
                    checked={postingSchedule.industry_timing}
                    onCheckedChange={checked =>
                      setPostingSchedule(prev => ({ ...prev, industry_timing: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Global audience considerations</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize for international reach
                    </p>
                  </div>
                  <Switch
                    checked={postingSchedule.global_audience}
                    onCheckedChange={checked =>
                      setPostingSchedule(prev => ({ ...prev, global_audience: checked }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Professional Tips */}
            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-[#0077B5]" />
                <h4 className="font-medium">Professional Tips</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Maximize your LinkedIn presence with data-driven insights, industry-specific content
                strategies, and engagement analytics to grow your professional network.
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
              onClick={onConnect}
              disabled={!Object.values(businessFeatures).some(Boolean)}
              className="bg-[#0077B5] text-white hover:bg-[#006399]"
            >
              Connect LinkedIn
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
