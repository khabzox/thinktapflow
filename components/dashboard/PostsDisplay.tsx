"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Download, Edit3, Check, FileText, Share2 } from "lucide-react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Post {
    id: string
    platform: string
    platformId: string
    icon: string
    content: string
    characterCount: number
    limit: number
    hashtags: string[]
    createdAt: string
}

interface PostsDisplayProps {
    posts: Post[]
}

export function PostsDisplay({ posts }: PostsDisplayProps) {
    const [editingPost, setEditingPost] = useState<string | null>(null)
    const [editedContent, setEditedContent] = useState("")
    const [copiedPosts, setCopiedPosts] = useState<Set<string>>(new Set())

    const handleCopy = async (postId: string, content: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedPosts((prev) => new Set([...prev, postId]))
            toast.success("Copied to clipboard!")

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopiedPosts((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(postId)
                    return newSet
                })
            }, 2000)
        } catch (err) {
            toast.error("Failed to copy to clipboard")
        }
    }

    const handleEdit = (post: Post) => {
        setEditingPost(post.id)
        setEditedContent(post.content)
    }

    const handleSaveEdit = (postId: string) => {
        // In a real app, you'd update the post content here
        setEditingPost(null)
        toast.success("Post updated!")
    }

    const handleExport = (format: "csv" | "json") => {
        const data = posts.map((post) => ({
            platform: post.platform,
            content: post.content,
            characterCount: post.characterCount,
            hashtags: post.hashtags.join(", "),
            createdAt: post.createdAt,
        }))

        if (format === "json") {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "generated-posts.json"
            a.click()
        } else {
            const csv = [
                ["Platform", "Content", "Character Count", "Hashtags", "Created At"],
                ...data.map((row) => [
                    row.platform,
                    `"${row.content.replace(/"/g, '""')}"`,
                    row.characterCount.toString(),
                    row.hashtags,
                    row.createdAt,
                ]),
            ]
                .map((row) => row.join(","))
                .join("\n")

            const blob = new Blob([csv], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "generated-posts.csv"
            a.click()
        }

        toast.success(`Exported as ${format.toUpperCase()}`)
    }

    if (posts.length === 0) {
        return null
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Share2 className="h-5 w-5" />
                            Generated Posts
                        </CardTitle>
                        <CardDescription>
                            {posts.length} posts generated for {new Set(posts.map((p) => p.platform)).size} platforms
                        </CardDescription>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleExport("json")}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                <FileText className="h-4 w-4 mr-2" />
                                Export as CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                    {posts.map((post) => (
                        <Card key={post.id} className="relative">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{post.icon}</span>
                                        <span className="font-medium">{post.platform}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(post)}
                                            disabled={editingPost === post.id}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleCopy(post.id, post.content)}>
                                            {copiedPosts.has(post.id) ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {editingPost === post.id ? (
                                    <div className="space-y-2">
                                        <Textarea
                                            value={editedContent}
                                            onChange={(e) => setEditedContent(e.target.value)}
                                            className="min-h-[100px]"
                                        />
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleSaveEdit(post.id)}>
                                                Save
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditingPost(null)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-sm leading-relaxed">{post.content}</p>

                                        <div className="flex flex-wrap gap-1">
                                            {post.hashtags.map((hashtag) => (
                                                <Badge key={hashtag} variant="secondary" className="text-xs">
                                                    {hashtag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {post.characterCount}/{post.limit} characters
                                            </span>
                                            <div className="w-20 bg-muted rounded-full h-1">
                                                <div
                                                    className={`h-1 rounded-full transition-all ${post.characterCount / post.limit > 0.9
                                                            ? "bg-red-500"
                                                            : post.characterCount / post.limit > 0.7
                                                                ? "bg-yellow-500"
                                                                : "bg-green-500"
                                                        }`}
                                                    style={{
                                                        width: `${Math.min((post.characterCount / post.limit) * 100, 100)}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
