"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Loader2, Link, Type, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

import { PLATFORMS_ARRAY } from "@/constants/platforms"

interface GenerationFormProps {
    onGenerate: (posts: any[]) => void
}

export function GenerationForm({ onGenerate }: GenerationFormProps) {
    const [content, setContent] = useState("")
    const [url, setUrl] = useState("")
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [inputType, setInputType] = useState<"text" | "url">("text")

    const handlePlatformToggle = (platformId: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
        )
    }

    const handleGenerate = async () => {
        if ((!content && !url) || selectedPlatforms.length === 0) return

        setIsGenerating(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const mockPosts = selectedPlatforms.map((platformId) => {
            const platform = PLATFORMS_ARRAY.find((p) => p.id === platformId)
            return {
                id: Math.random().toString(36).substr(2, 9),
                platform: platform?.name,
                platformId,
                icon: platform?.icon,
                content: `Generated content for ${platform?.name}: ${content || url}`,
                characterCount: Math.floor(Math.random() * (platform?.limit || 280)),
                limit: platform?.limit,
                hashtags: ["#ThinkTapFlow", "#SocialMedia", "#AI"],
                createdAt: new Date().toISOString(),
            }
        })

        onGenerate(mockPosts)
        setIsGenerating(false)
        setContent("")
        setUrl("")
    }

    const handleUrlExtraction = async (url: string) => {
        try {
            setIsGenerating(true);
            
            const response = await fetch('/api/extract-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.message || 'Failed to extract content');
            }

            setContent(data.data.content);
            toast.success('Successfully extracted content from URL');
            setInputType('text'); // Switch to text input to show extracted content
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to extract content');
        } finally {
            setIsGenerating(false);
        }
    };

    const characterCount = content.length
    const isValid = (content || url) && selectedPlatforms.length > 0

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Content
                </CardTitle>
                <CardDescription>Create engaging posts for multiple platforms from your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs value={inputType} onValueChange={(value) => setInputType(value as "text" | "url")}>
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
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                placeholder="Enter your content, ideas, or key points here..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Characters: {characterCount}</span>
                                {characterCount > 0 && (
                                    <Badge variant={characterCount > 500 ? "destructive" : "secondary"}>
                                        {characterCount > 500 ? "Too long" : "Good length"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="url">Website URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com/article"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <Button 
                                    onClick={() => handleUrlExtraction(url)}
                                    disabled={!url || isGenerating}
                                    variant="secondary"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Extracting...
                                        </>
                                    ) : (
                                        'Extract'
                                    )}
                                </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                We'll extract content from this URL to generate posts
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="space-y-3">
                    <Label>Select Platforms</Label>
                    <div className="grid grid-cols-2 gap-3">                                    {PLATFORMS_ARRAY.map((platform) => (
                            <div
                                key={platform.id}
                                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => handlePlatformToggle(platform.id)}
                            >
                                <Checkbox
                                    id={platform.id}
                                    checked={selectedPlatforms.includes(platform.id)}
                                    onChange={() => handlePlatformToggle(platform.id)}
                                />
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-lg">{platform.icon}</span>
                                    <div>
                                        <Label htmlFor={platform.id} className="cursor-pointer">
                                            {platform.name}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">{platform.limit} chars</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedPlatforms.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {selectedPlatforms.map((platformId) => {
                                const platform = PLATFORMS_ARRAY.find((p) => p.id === platformId)
                                return (
                                    <Badge key={platformId} variant="secondary" className="text-xs">
                                        {platform?.icon} {platform?.name}
                                    </Badge>
                                )
                            })}
                        </div>
                    )}
                </div>

                <Button onClick={handleGenerate} disabled={!isValid || isGenerating} className="w-full" size="lg">
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Posts
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    )
}
