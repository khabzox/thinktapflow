"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Wand2,
  FileText,
  ImageIcon,
  Video,
  Mic,
  Settings,
  Copy,
  RefreshCw,
  Zap,
  Target,
  Palette,
  Link,
  Type,
  Loader2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { extractContentFromUrl, generateContent } from "@/actions";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneratedContent } from "@/lib/ai/provider";

const contentTypes = [
  {
    id: "text",
    name: "Text & URL",
    icon: FileText,
    description: "Generate from text or website URL",
  },
  {
    id: "image",
    name: "Image Content",
    icon: ImageIcon,
    description: "Visual content with AI-generated images",
    comingSoon: true,
  },
  {
    id: "video",
    name: "Video Script",
    icon: Video,
    description: "Video scripts and storyboards",
    comingSoon: true,
  },
  {
    id: "audio",
    name: "Audio Content",
    icon: Mic,
    description: "Podcast scripts and voice content",
    comingSoon: true,
  },
];

const toneOptions = [
  "Professional",
  "Casual",
  "Friendly",
  "Authoritative",
  "Humorous",
  "Inspirational",
  "Educational",
  "Conversational",
];

const platforms = [
  { id: "twitter", name: "Twitter", limit: 280, color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", limit: 3000, color: "#0077B5" },
  { id: "facebook", name: "Facebook", limit: 2000, color: "#4267B2" },
  { id: "instagram", name: "Instagram", limit: 2200, color: "#E1306C" },
  { id: "tiktok", name: "TikTok", limit: 150, color: "#000000" },
  { id: "youtube", name: "YouTube", limit: 5000, color: "#FF0000" },
];

export default function GeneratePage() {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState("text");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [creativity, setCreativity] = useState([0.7]);
  const [length, setLength] = useState([500]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"]);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentVariations, setContentVariations] = useState<string[]>([]);
  const [platformContent, setPlatformContent] = useState<Record<string, GeneratedContent[]>>({});
  const [currentVariationIndexes, setCurrentVariationIndexes] = useState<Record<string, number>>(
    {},
  );
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [url, setUrl] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    startTransition(async () => {
      // Create FormData for Server Action
      const formData = new FormData();
      formData.append("content", prompt);
      formData.append("platforms", JSON.stringify(selectedPlatforms));
      formData.append(
        "options",
        JSON.stringify({
          temperature: creativity[0],
          includeEmojis,
          customInstructions: `Generate content in a ${tone.toLowerCase()} tone, with${includeHashtags ? "" : "out"} hashtags. Target length: ${length[0]} characters.`,
        }),
      );

      const result = await generateContent(formData);

      if (result.success && result.data) {
        const platformResults: Record<string, GeneratedContent[]> = {};

        // Process content for each platform
        for (const platformId of selectedPlatforms) {
          const platformContent = result.data.posts[platformId];
          if (Array.isArray(platformContent)) {
            platformResults[platformId] = platformContent as GeneratedContent[];
          } else if (platformContent) {
            platformResults[platformId] = [platformContent as GeneratedContent];
          }
        }

        // Set the content for all platforms
        setPlatformContent(platformResults);

        // Set the main content display to the first platform's first variation
        const firstPlatform = selectedPlatforms[0];
        if (platformResults[firstPlatform]?.length > 0) {
          setContentVariations(platformResults[firstPlatform].map(item => item.content));
          setGeneratedContent(platformResults[firstPlatform][0].content);
          toast.success("Content generated successfully!");
        } else {
          toast.error("No valid content generated");
        }
      } else {
        // Handle error from Server Action
        if (
          result.error?.code === "DAILY_LIMIT_REACHED" ||
          result.error?.code === "MONTHLY_LIMIT_REACHED"
        ) {
          toast.error(
            <div className="space-y-2">
              <p>{result.error.message}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => (window.location.href = "/dashboard/settings/billing")}
              >
                Upgrade Plan
              </Button>
            </div>,
          );
        } else {
          toast.error(result.error?.message || "Failed to generate content");
        }
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Content copied to clipboard!");
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(id => id !== platformId) : [...prev, platformId],
    );
  };

  const handleSelectVariation = (index: number) => {
    setGeneratedContent(contentVariations[index]);
  };

  const handleUrlExtraction = async (url: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("url", url);

        const result = await extractContentFromUrl(formData);

        if (!result.success || !result.data) {
          throw new Error(result.error?.message || "Failed to extract content");
        }

        setPrompt(result.data.content);
        toast.success("Successfully extracted content from URL");
        setInputType("text"); // Switch to text input to show extracted content
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to extract content");
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Content</h1>
          <p className="text-muted-foreground">
            Create engaging content with AI-powered generation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Generation Form */}
          <div className="space-y-6 lg:col-span-2">
            {/* Content Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5" />
                  Content Type
                </CardTitle>
                <CardDescription>Choose the type of content you want to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {contentTypes.map(type => (
                    <div
                      key={type.id}
                      className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${
                        selectedType === type.id
                          ? "border-primary bg-primary/5"
                          : type.comingSoon
                            ? "opacity-50"
                            : "hover:border-primary/50"
                      }`}
                      onClick={() => !type.comingSoon && setSelectedType(type.id)}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </div>
                      {type.comingSoon && (
                        <Badge className="absolute right-2 top-2" variant="secondary">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Content Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Content Input
                </CardTitle>
                <CardDescription>Enter your content or provide a URL</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs
                  value={inputType}
                  onValueChange={value => setInputType(value as "text" | "url")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Text Input
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <Link className="h-4 w-4" />
                      URL Input
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="prompt">Your Content</Label>
                        {inputType === "text" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-primary"
                            onClick={() => setInputType("url")}
                          >
                            <Link className="mr-1 h-4 w-4" />
                            Switch to URL input
                          </Button>
                        )}
                      </div>
                      <Textarea
                        id="prompt"
                        placeholder="e.g., Create a social media post about our new AI-powered content generation tool that helps marketers save time..."
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        className="min-h-[120px] resize-y"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Characters: {prompt.length}</span>
                        <Badge variant={prompt.length > 5000 ? "destructive" : "secondary"}>
                          {prompt.length > 5000 ? "Too long" : "Good length"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Write your content directly or paste it here. You can also extract content
                        from a URL using the URL input tab.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-4">
                      {/* Info Card */}
                      <Card className="border-dashed bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-2">
                              <Link className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium">URL Content Extraction</h4>
                              <p className="text-sm text-muted-foreground">
                                Enter a website URL to automatically extract its content. Works best
                                with:
                              </p>
                              <ul className="ml-4 list-disc space-y-1 text-sm text-muted-foreground">
                                <li>Blog posts and articles</li>
                                <li>News websites</li>
                                <li>Product descriptions</li>
                                <li>Company pages</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="space-y-2">
                        <Label htmlFor="url">Website URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="url"
                            type="url"
                            placeholder="https://example.com/article"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                          />
                          <Button
                            onClick={() => handleUrlExtraction(url)}
                            disabled={!url || isPending}
                            variant="secondary"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Extracting...
                              </>
                            ) : (
                              "Extract"
                            )}
                          </Button>
                        </div>
                        <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="p-1">ℹ️</div>
                          <p>
                            After extraction, you can review and edit the content before generating
                            posts. The extracted content will appear in the text input tab.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Platform Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Target Platforms
                </CardTitle>
                <CardDescription>Select platforms to optimize content for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {platforms.map(platform => (
                    <div
                      key={platform.id}
                      className={`cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm ${
                        selectedPlatforms.includes(platform.id)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => togglePlatform(platform.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {platform.limit} chars
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isPending || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Generation Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tone */}
                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Professional</Badge>
                    <span className="text-xs text-muted-foreground">(Fixed)</span>
                  </div>
                </div>

                {/* Creativity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Creativity Level</Label>
                    <Badge variant="outline">{Math.round(creativity[0] * 100)}%</Badge>
                  </div>
                  <Slider
                    value={creativity}
                    onValueChange={setCreativity}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Conservative</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Length */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Content Length</Label>
                    <Badge variant="outline">{length[0]} chars</Badge>
                  </div>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={2000}
                    min={50}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short</span>
                    <span>Long</span>
                  </div>
                </div>

                <Separator />

                {/* Options */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Hashtags</Label>
                      <p className="text-xs text-muted-foreground">Add relevant hashtags</p>
                    </div>
                    <Switch checked={includeHashtags} onCheckedChange={setIncludeHashtags} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Emojis</Label>
                      <p className="text-xs text-muted-foreground">Add emojis for engagement</p>
                    </div>
                    <Switch checked={includeEmojis} onCheckedChange={setIncludeEmojis} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Quick Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPrompt("Create a product launch announcement")}
                  >
                    Product Launch
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPrompt("Write a behind-the-scenes company update")}
                  >
                    Company Update
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPrompt("Create educational content about industry trends")}
                  >
                    Educational Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setPrompt("Write a customer testimonial highlight")}
                  >
                    Testimonial
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Content for Each Platform */}
        {Object.keys(platformContent).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Platform-Specific Content</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {selectedPlatforms.map(platformId => {
                const platform = platforms.find(p => p.id === platformId);
                const variations = platformContent[platformId] || [];

                if (!platform || variations.length === 0) return null;

                const currentIndex = currentVariationIndexes[platformId] || 0;
                const currentVariation = variations[currentIndex];

                return (
                  <Card key={platformId}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: platform.color }}
                          />
                          {platform.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {variations.length} variation{variations.length !== 1 ? "s" : ""}
                          </Badge>
                          {variations.length > 1 && (
                            <Badge variant="secondary">
                              {currentIndex + 1}/{variations.length}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {variations.length > 1 && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            {variations.map((_, index) => (
                              <Button
                                key={index}
                                variant={currentIndex === index ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setCurrentVariationIndexes(prev => ({
                                    ...prev,
                                    [platformId]: index,
                                  }));
                                  if (platformId === selectedPlatforms[0]) {
                                    setGeneratedContent(variations[index].content);
                                    setContentVariations(variations.map(v => v.content));
                                  }
                                }}
                              >
                                Variation {index + 1}
                              </Button>
                            ))}
                          </div>
                        )}

                        <div className="rounded-lg border bg-muted/50 p-4">
                          <pre className="whitespace-pre-wrap font-sans text-sm">
                            {currentVariation.content}
                          </pre>
                        </div>

                        {/* Hashtags */}
                        {currentVariation.hashtags && currentVariation.hashtags.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Hashtags</Label>
                            <div className="flex flex-wrap gap-2">
                              {currentVariation.hashtags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mentions */}
                        {currentVariation.mentions && currentVariation.mentions.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm text-muted-foreground">Mentions</Label>
                            <div className="flex flex-wrap gap-2">
                              {currentVariation.mentions.map(mention => (
                                <Badge key={mention} variant="outline">
                                  {mention}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Characters: {currentVariation?.metadata?.characterCount || 0}</span>
                          <Badge
                            variant={
                              (currentVariation?.metadata?.characterCount || 0) <= platform.limit
                                ? "secondary"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            Limit: {currentVariation?.metadata?.characterCount || 0}/
                            {platform.limit}
                          </Badge>
                        </div>

                        <div className="text-right text-xs text-muted-foreground">
                          Generated:{" "}
                          {currentVariation?.metadata?.formattedDate || new Date().toLocaleString()}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              const textToCopy = [
                                currentVariation.content,
                                "",
                                ...(currentVariation.hashtags ?? []).map(tag => `#${tag}`),
                                ...(currentVariation.mentions ?? []),
                              ].join("\n");
                              navigator.clipboard.writeText(textToCopy);
                              toast.success(`Copied ${platform.name} content with hashtags!`);
                            }}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              const textToCopy = [
                                currentVariation?.content || "",
                                "",
                                ...(currentVariation?.hashtags || []).map(tag => `#${tag}`),
                                ...(currentVariation?.mentions || []),
                              ].join("\n");
                              navigator.clipboard.writeText(textToCopy);
                              toast.success(`Copied ${platform.name} content with hashtags!`);
                            }}
                          >
                            <Sparkles className="mr-2 h-4 w-4" />
                            Select
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
