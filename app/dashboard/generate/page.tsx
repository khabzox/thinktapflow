"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Sparkles,
    Wand2,
    FileText,
    ImageIcon,
    Video,
    Mic,
    Settings,
    Copy,
    Download,
    RefreshCw,
    Zap,
    Target,
    Palette,
} from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { toast } from "sonner"
import { useGenerate } from "@/hooks/use-generate"

const contentTypes = [
    { id: "text", name: "Text Post", icon: FileText, description: "Social media posts, captions, and copy" },
    { id: "image", name: "Image Content", icon: ImageIcon, description: "Visual content with AI-generated images" },
    { id: "video", name: "Video Script", icon: Video, description: "Video scripts and storyboards" },
    { id: "audio", name: "Audio Content", icon: Mic, description: "Podcast scripts and voice content" },
]

const toneOptions = [
    "Professional",
    "Casual",
    "Friendly",
    "Authoritative",
    "Humorous",
    "Inspirational",
    "Educational",
    "Conversational",
]

const platforms = [
    { id: "twitter", name: "Twitter", limit: 280, color: "#1DA1F2" },
    { id: "linkedin", name: "LinkedIn", limit: 3000, color: "#0077B5" },
    { id: "facebook", name: "Facebook", limit: 2000, color: "#4267B2" },
    { id: "instagram", name: "Instagram", limit: 2200, color: "#E1306C" },
    { id: "tiktok", name: "TikTok", limit: 150, color: "#000000" },
    { id: "youtube", name: "YouTube", limit: 5000, color: "#FF0000" },
]

// Add interface for the content structure
interface ContentItem {
    content: string;
    hashtags: string[];
    mentions: string[];
    metadata: {
        characterCount: number;
        platform: string;
        timestamp: number;
        formattedDate: string;
    };
}

export default function GeneratePage() {
    const { generateContent, isGenerating, error: generateError } = useGenerate()
    const [selectedType, setSelectedType] = useState("text")
    const [prompt, setPrompt] = useState("")
    const [tone, setTone] = useState("Professional")
    const [creativity, setCreativity] = useState([0.7])
    const [length, setLength] = useState([500])
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"])
    const [includeHashtags, setIncludeHashtags] = useState(true)
    const [includeEmojis, setIncludeEmojis] = useState(false)
    const [generatedContent, setGeneratedContent] = useState("")
    const [contentVariations, setContentVariations] = useState<string[]>([])
    const [platformContent, setPlatformContent] = useState<Record<string, ContentItem[]>>({})
    const [currentVariationIndexes, setCurrentVariationIndexes] = useState<Record<string, number>>({})

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt")
            return
        }

        const result = await generateContent({
            content: prompt,
            platforms: selectedPlatforms,
            options: {
                temperature: creativity[0],
                includeEmojis,
                customInstructions: `Generate content in a ${tone.toLowerCase()} tone, with${includeHashtags ? '' : 'out'} hashtags. Target length: ${length[0]} characters.`
            }
        })

        if (result) {
            const platformResults: Record<string, ContentItem[]> = {};
            
            // Process content for each platform
            for (const platformId of selectedPlatforms) {
                const platformContent = result.posts[platformId];
                if (Array.isArray(platformContent)) {
                    platformResults[platformId] = platformContent as ContentItem[];
                } else if (platformContent) {
                    platformResults[platformId] = [platformContent as ContentItem];
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
        } else if (generateError) {
            if (generateError.code === 'LIMIT_REACHED') {
                toast.error(
                    <div className="space-y-2">
                        <p>{generateError.message}</p>
                        {generateError.details && (
                            <div className="text-sm">
                                <p>Current usage: {generateError.details.current}/{generateError.details.limit}</p>
                                <p>Plan: {generateError.details.subscription_tier}</p>
                            </div>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => window.location.href = '/dashboard/settings/billing'}
                        >
                            Upgrade Plan
                        </Button>
                    </div>
                );
            } else {
                toast.error(generateError.message);
            }
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent)
        toast.success("Content copied to clipboard!")
    }

    const handleRegenerate = () => {
        handleGenerate()
    }

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
        )
    }

    const handleSelectVariation = (index: number) => {
        setGeneratedContent(contentVariations[index]);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Generate Content</h1>
                    <p className="text-muted-foreground">Create engaging content with AI-powered generation</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Generation Form */}
                    <div className="lg:col-span-2 space-y-6">
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
                                    {contentTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${selectedType === type.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                                                }`}
                                            onClick={() => setSelectedType(type.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <type.icon className="h-5 w-5" />
                                                <div>
                                                    <h3 className="font-medium">{type.name}</h3>
                                                    <p className="text-xs text-muted-foreground">{type.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prompt Input */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5" />
                                    Content Prompt
                                </CardTitle>
                                <CardDescription>Describe what you want to create</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="prompt">Your Prompt</Label>
                                    <Textarea
                                        id="prompt"
                                        placeholder="e.g., Create a social media post about our new AI-powered content generation tool that helps marketers save time..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="min-h-[120px] resize-none"
                                    />
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Characters: {prompt.length}</span>
                                        <span>Be specific for better results</span>
                                    </div>
                                </div>
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
                                    {platforms.map((platform) => (
                                        <div
                                            key={platform.id}
                                            className={`cursor-pointer rounded-lg border p-3 transition-all hover:shadow-sm ${selectedPlatforms.includes(platform.id)
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:border-primary/50"
                                                }`}
                                            onClick={() => togglePlatform(platform.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: platform.color }} />
                                                    <span className="font-medium">{platform.name}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{platform.limit} chars</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Generate Button */}
                        <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full" size="lg">
                            {isGenerating ? (
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
                                    <Select value={tone} onValueChange={setTone}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {toneOptions.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                                    <Slider value={length} onValueChange={setLength} max={2000} min={50} step={50} className="w-full" />
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
                            {selectedPlatforms.map((platformId) => {
                                const platform = platforms.find((p) => p.id === platformId);
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
                                                        {variations.length} variation{variations.length !== 1 ? 's' : ''}
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
                                                    <div className="flex gap-2 mb-4 flex-wrap">
                                                        {variations.map((_, index) => (
                                                            <Button
                                                                key={index}
                                                                variant={currentIndex === index ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => {
                                                                    setCurrentVariationIndexes(prev => ({
                                                                        ...prev,
                                                                        [platformId]: index
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

                                                <div className="rounded-lg border p-4 bg-muted/50">
                                                    <pre className="whitespace-pre-wrap font-sans text-sm">
                                                        {currentVariation.content}
                                                    </pre>
                                                </div>

                                                {/* Hashtags */}
                                                {currentVariation.hashtags && currentVariation.hashtags.length > 0 && (
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground">Hashtags</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {currentVariation.hashtags.map((tag) => (
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
                                                            {currentVariation.mentions.map((mention) => (
                                                                <Badge key={mention} variant="outline">
                                                                    {mention}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <span>
                                                        Characters: {currentVariation.metadata.characterCount}
                                                    </span>
                                                    <Badge
                                                        variant={currentVariation.metadata.characterCount <= platform.limit ? "secondary" : "destructive"}
                                                        className="text-xs"
                                                    >
                                                        Limit: {currentVariation.metadata.characterCount}/{platform.limit}
                                                    </Badge>
                                                </div>

                                                <div className="text-xs text-muted-foreground text-right">
                                                    Generated: {currentVariation.metadata.formattedDate}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="w-full"
                                                        onClick={() => {
                                                            const textToCopy = [
                                                                currentVariation.content,
                                                                '',
                                                                ...currentVariation.hashtags.map(tag => `#${tag}`),
                                                                ...currentVariation.mentions
                                                            ].join('\n');
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
                                                            setGeneratedContent(currentVariation.content);
                                                            setContentVariations(variations.map(v => v.content));
                                                            // Update the first platform's current variation
                                                            if (platformId !== selectedPlatforms[0]) {
                                                                setCurrentVariationIndexes(prev => ({
                                                                    ...prev,
                                                                    [selectedPlatforms[0]]: currentIndex
                                                                }));
                                                            }
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
    )
}
