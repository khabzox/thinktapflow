"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Generation } from "@/hooks/use-generations";
import { useState, useRef } from "react";
import { toast } from "sonner";

interface PostContentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  generation: Generation | null;
}

export function PostContentDialog({ isOpen, onClose, generation }: PostContentDialogProps) {
  if (!generation) return null;

  const [selectedPlatform, setSelectedPlatform] = useState(generation.platforms[0]);
  const [isExporting, setIsExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Group posts by platform
  const postsByPlatform = generation.posts.reduce(
    (acc, post) => {
      if (!acc[post.platform]) {
        acc[post.platform] = [];
      }
      acc[post.platform].push(post);
      return acc;
    },
    {} as Record<string, typeof generation.posts>,
  );

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const html2pdf = (await import("html2pdf.js")).default;

      // Create a temporary div for PDF content
      const tempDiv = document.createElement("div");
      tempDiv.className = "p-8";

      // Add title and description
      tempDiv.innerHTML = `
                <h1 class="text-2xl font-bold mb-4">${generation.title}</h1>
                <p class="text-gray-600 mb-8">Generated content for ${generation.platforms.length} platform${generation.platforms.length !== 1 ? "s" : ""}</p>
            `;

      // Add content for each platform
      generation.platforms.forEach(platform => {
        const posts = postsByPlatform[platform];
        if (!posts?.length) return;

        const platformSection = document.createElement("div");
        platformSection.className = "mb-8";
        platformSection.innerHTML = `
                    <h2 class="text-xl font-semibold mb-4 capitalize">${platform}</h2>
                    ${posts
                      .map(
                        (post, index) => `
                        <div class="mb-6">
                            <div class="font-medium mb-2">Variation ${index + 1}</div>
                            <div class="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg mb-2">${post.content}</div>
                            ${
                              post.hashtags.length
                                ? `
                                <div class="flex flex-wrap gap-1 mb-2">
                                    ${post.hashtags.map(tag => `<span class="text-blue-600">${tag}</span>`).join(" ")}
                                </div>
                            `
                                : ""
                            }
                            ${
                              post.mentions.length
                                ? `
                                <div class="flex flex-wrap gap-1">
                                    ${post.mentions.map(mention => `<span class="text-blue-500">${mention}</span>`).join(" ")}
                                </div>
                            `
                                : ""
                            }
                        </div>
                    `,
                      )
                      .join("")}
                `;
        tempDiv.appendChild(platformSection);
      });

      const opt = {
        margin: 1,
        filename: `${generation.title.toLowerCase().replace(/\s+/g, "-")}-content.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(tempDiv).save();
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const rows = [["Platform", "Variation", "Content", "Hashtags", "Mentions"]];

      generation.platforms.forEach(platform => {
        const posts = postsByPlatform[platform];
        posts?.forEach((post, index) => {
          rows.push([
            platform,
            `Variation ${index + 1}`,
            post.content,
            post.hashtags.join(" "),
            post.mentions.join(" "),
          ]);
        });
      });

      const csvContent = rows
        .map(row =>
          row
            .map(cell =>
              typeof cell === "string" &&
              (cell.includes(",") || cell.includes("\n") || cell.includes('"'))
                ? `"${cell.replace(/"/g, '""')}"`
                : cell,
            )
            .join(","),
        )
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${generation.title.toLowerCase().replace(/\s+/g, "-")}-content.csv`;
      link.click();
      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to export CSV");
    }
  };

  const handleExportJSON = () => {
    try {
      const data = {
        title: generation.title,
        platforms: generation.platforms,
        content: generation.platforms.reduce(
          (acc, platform) => {
            acc[platform] = postsByPlatform[platform]?.map(post => ({
              content: post.content,
              hashtags: post.hashtags,
              mentions: post.mentions,
            }));
            return acc;
          },
          {} as Record<string, any>,
        ),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${generation.title.toLowerCase().replace(/\s+/g, "-")}-content.json`;
      link.click();
      toast.success("JSON exported successfully!");
    } catch (error) {
      console.error("JSON export error:", error);
      toast.error("Failed to export JSON");
    }
  };

  const getHashtagPrefix = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return "";
      case "facebook":
        return "";
      default:
        return "#";
    }
  };

  const getMentionPrefix = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "tiktok":
        return "";
      case "youtube":
        return "";
      default:
        return "@";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[80vh] max-w-3xl flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{generation.title}</DialogTitle>
          <DialogDescription>
            Generated content for {generation.platforms.length} platform
            {generation.platforms.length !== 1 ? "s" : ""}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue={selectedPlatform}
          className="flex min-h-0 flex-1 flex-col"
          onValueChange={setSelectedPlatform}
        >
          <TabsList className="grid h-auto flex-shrink-0 grid-cols-3 gap-4 lg:grid-cols-6">
            {generation.platforms.map(platform => (
              <TabsTrigger key={platform} value={platform} className="capitalize">
                {platform}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative mt-4 min-h-0 flex-1">
            <div ref={contentRef}>
              {generation.platforms.map(platform => (
                <TabsContent key={platform} value={platform} className="absolute inset-0 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-6 pr-4">
                      {postsByPlatform[platform]?.map((post, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Variation {index + 1}</Badge>
                          </div>
                          <div className="whitespace-pre-wrap rounded-lg bg-muted p-4">
                            {post.content}
                          </div>
                          {post.hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.hashtags.map((tag, i) => (
                                <Badge key={i} variant="outline">
                                  {getHashtagPrefix(platform)}
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {post.mentions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.mentions.map((mention, i) => (
                                <Badge key={i} variant="outline" className="text-blue-500">
                                  {getMentionPrefix(platform)}
                                  {mention}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
