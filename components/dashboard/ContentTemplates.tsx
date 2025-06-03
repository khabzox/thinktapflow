"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, FileText, Star, StarOff, Sparkles } from "lucide-react"
import { toast } from "sonner"

const templates = [
    {
        id: "template_1",
        title: "Product Launch",
        description: "Announce your new product or feature across platforms",
        platforms: ["Twitter", "LinkedIn", "Facebook"],
        category: "marketing",
        isFavorite: true,
    },
    {
        id: "template_2",
        title: "Weekly Newsletter",
        description: "Curate content for your weekly newsletter",
        platforms: ["Email"],
        category: "newsletter",
        isFavorite: false,
    },
    {
        id: "template_3",
        title: "Promotional Campaign",
        description: "Create a multi-platform promotional campaign",
        platforms: ["Instagram", "Facebook", "Twitter"],
        category: "marketing",
        isFavorite: true,
    },
    {
        id: "template_4",
        title: "Blog Post",
        description: "Generate a blog post with SEO optimization",
        platforms: ["Blog"],
        category: "content",
        isFavorite: false,
    },
    {
        id: "template_5",
        title: "Customer Testimonial",
        description: "Highlight customer testimonials for social media",
        platforms: ["Instagram", "LinkedIn", "Facebook"],
        category: "social",
        isFavorite: false,
    },
    {
        id: "template_6",
        title: "Event Promotion",
        description: "Promote your upcoming event across platforms",
        platforms: ["Twitter", "LinkedIn", "Facebook", "Email"],
        category: "marketing",
        isFavorite: false,
    },
]

export function ContentTemplates() {
    const [favorites, setFavorites] = useState<Set<string>>(
        new Set(templates.filter((t) => t.isFavorite).map((t) => t.id)),
    )
    const [activeTab, setActiveTab] = useState("all")

    const filteredTemplates = templates.filter((template) => {
        if (activeTab === "favorites") return favorites.has(template.id)
        if (activeTab === "all") return true
        return template.category === activeTab
    })

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(id)) {
                newFavorites.delete(id)
                toast.success("Removed from favorites")
            } else {
                newFavorites.add(id)
                toast.success("Added to favorites")
            }
            return newFavorites
        })
    }

    const handleUseTemplate = (template: {
        id: string;
        title: string;
        description: string;
        platforms: string[];
        category: string;
        isFavorite: boolean;
    }) => {
        toast.success(`Using template: ${template.title}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Templates
                </CardTitle>
                <CardDescription>Ready-to-use templates for various content needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 sm:grid-cols-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="favorites">Favorites</TabsTrigger>
                        <TabsTrigger value="marketing">Marketing</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                        <TabsTrigger value="newsletter" className="hidden sm:block">
                            Newsletter
                        </TabsTrigger>
                        <TabsTrigger value="content" className="hidden sm:block">
                            Content
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab} className="mt-4">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredTemplates.map((template) => (
                                <Card key={template.id} className="overflow-hidden">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">{template.title}</CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => toggleFavorite(template.id)}
                                            >
                                                {favorites.has(template.id) ? (
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                ) : (
                                                    <StarOff className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <CardDescription>{template.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {template.platforms.map((platform) => (
                                                <Badge key={platform} variant="secondary" className="text-xs">
                                                    {platform}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                                        <Button variant="ghost" size="sm" className="h-8 px-2">
                                            <Copy className="mr-2 h-3 w-3" />
                                            Duplicate
                                        </Button>
                                        <Button size="sm" className="h-8" onClick={() => handleUseTemplate(template)}>
                                            <Sparkles className="mr-2 h-3 w-3" />
                                            Use
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
