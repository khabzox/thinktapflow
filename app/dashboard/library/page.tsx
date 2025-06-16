"use client"

import React, { useState, useMemo } from 'react'
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Archive, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Download, 
  Share2, 
  Trash2, 
  Edit3, 
  Eye, 
  Star,
  Calendar,
  Tag,
  Grid,
  List,
  SortAsc,
  MoreHorizontal,
  Copy,
  Heart,
  MessageSquare,
  TrendingUp,
  Folder,
  FolderPlus
} from "lucide-react"

interface ContentItem {
    id: number
    title: string
    type: 'text' | 'image' | 'video' | 'audio'
    category: string
    content: string
    createdAt: string
    updatedAt: string
    tags: string[]
    status: 'published' | 'draft' | 'archived'
    views: number
    likes: number
    comments: number
    size: string
    thumbnail: string
}

interface Category {
    id: string
    name: string
    count: number
}

interface ContentType {
    id: string
    name: string
    icon: React.ComponentType<{ className?: string }>
}

/**
 * Renders the content library page with filtering, sorting, and view mode options.
 *
 * Displays a collection of content items with support for searching, filtering by category and type, sorting, and toggling between grid and list views. Users can select items for batch actions and view summary statistics.
 *
 * @returns The content library page component.
 */
export default function LibraryPage() {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedType, setSelectedType] = useState<string>("all")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>("grid")
    const [sortBy, setSortBy] = useState<string>("recent")
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())

    // Mock data for content items
    const contentItems: ContentItem[] = [
        {
            id: 1,
            title: "AI Revolution Blog Post",
            type: "text",
            category: "blog",
            content: "The future of artificial intelligence in content creation...",
            createdAt: "2025-06-15",
            updatedAt: "2025-06-15",
            tags: ["AI", "Technology", "Future"],
            status: "published",
            views: 1234,
            likes: 89,
            comments: 23,
            size: "2.1 KB",
            thumbnail: "📝"
        },
        {
            id: 2,
            title: "Product Launch Campaign",
            type: "image",
            category: "marketing",
            content: "Visual assets for upcoming product launch",
            createdAt: "2025-06-14",
            updatedAt: "2025-06-14",
            tags: ["Marketing", "Product", "Campaign"],
            status: "draft",
            views: 456,
            likes: 34,
            comments: 7,
            size: "1.8 MB",
            thumbnail: "🎨"
        },
        {
            id: 3,
            title: "Tutorial Video Script",
            type: "video",
            category: "education",
            content: "Step-by-step guide for using ThinkTapFlow",
            createdAt: "2025-06-13",
            updatedAt: "2025-06-13",
            tags: ["Tutorial", "Guide", "Video"],
            status: "published",
            views: 2890,
            likes: 156,
            comments: 45,
            size: "145 MB",
            thumbnail: "🎬"
        },
        {
            id: 4,
            title: "Podcast Intro Music",
            type: "audio",
            category: "audio",
            content: "Background music for podcast episodes",
            createdAt: "2025-06-12",
            updatedAt: "2025-06-12",
            tags: ["Music", "Podcast", "Audio"],
            status: "published",
            views: 678,
            likes: 67,
            comments: 12,
            size: "8.5 MB",
            thumbnail: "🎵"
        },
        {
            id: 5,
            title: "Social Media Templates",
            type: "image",
            category: "social",
            content: "Instagram and Twitter post templates",
            createdAt: "2025-06-11",
            updatedAt: "2025-06-14",
            tags: ["Social Media", "Templates", "Design"],
            status: "published",
            views: 3456,
            likes: 234,
            comments: 56,
            size: "5.2 MB",
            thumbnail: "📱"
        },
        {
            id: 6,
            title: "Email Newsletter Draft",
            type: "text",
            category: "email",
            content: "Weekly newsletter content for subscribers",
            createdAt: "2025-06-10",
            updatedAt: "2025-06-15",
            tags: ["Email", "Newsletter", "Marketing"],
            status: "draft",
            views: 123,
            likes: 12,
            comments: 3,
            size: "3.4 KB",
            thumbnail: "📧"
        }
    ]

    const categories: Category[] = [
        { id: "all", name: "All Content", count: contentItems.length },
        { id: "blog", name: "Blog Posts", count: contentItems.filter(item => item.category === "blog").length },
        { id: "marketing", name: "Marketing", count: contentItems.filter(item => item.category === "marketing").length },
        { id: "social", name: "Social Media", count: contentItems.filter(item => item.category === "social").length },
        { id: "education", name: "Education", count: contentItems.filter(item => item.category === "education").length },
        { id: "audio", name: "Audio", count: contentItems.filter(item => item.category === "audio").length },
        { id: "email", name: "Email", count: contentItems.filter(item => item.category === "email").length }
    ]

    const contentTypes: ContentType[] = [
        { id: "all", name: "All Types", icon: Archive },
        { id: "text", name: "Text", icon: FileText },
        { id: "image", name: "Images", icon: Image },
        { id: "video", name: "Videos", icon: Video },
        { id: "audio", name: "Audio", icon: Music }
    ]

    // Filter and sort content
    const filteredContent = useMemo(() => {
        let filtered = contentItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
            const matchesType = selectedType === "all" || item.type === selectedType
            
            return matchesSearch && matchesCategory && matchesType
        })

        // Sort content
        switch (sortBy) {
            case "recent":
                filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                break
            case "oldest":
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                break
            case "popular":
                filtered.sort((a, b) => b.views - a.views)
                break
            case "liked":
                filtered.sort((a, b) => b.likes - a.likes)
                break
            case "alphabetical":
                filtered.sort((a, b) => a.title.localeCompare(b.title))
                break
        }

        return filtered
    }, [searchTerm, selectedCategory, selectedType, sortBy])

    const toggleItemSelection = (itemId: number): void => {
        const newSelection = new Set(selectedItems)
        if (newSelection.has(itemId)) {
            newSelection.delete(itemId)
        } else {
            newSelection.add(itemId)
        }
        setSelectedItems(newSelection)
    }

    const getTypeIcon = (type: ContentItem['type']): React.ComponentType<{ className?: string }> => {
        switch (type) {
            case "text": return FileText
            case "image": return Image
            case "video": return Video
            case "audio": return Music
            default: return FileText
        }
    }

    const getStatusColor = (status: ContentItem['status']): string => {
        switch (status) {
            case "published": return "text-green-600 bg-green-50"
            case "draft": return "text-yellow-600 bg-yellow-50"
            case "archived": return "text-gray-600 bg-gray-50"
            default: return "text-gray-600 bg-gray-50"
        }
    }

    return (
        <DashboardLayout userRole="user">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
                        <p className="text-muted-foreground">Manage and organize your content collection</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full border border-orange-200">
                            🚧 Under Development
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50" disabled>
                            <FolderPlus className="h-4 w-4" />
                            New Folder
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed opacity-50" disabled>
                            <Plus className="h-4 w-4" />
                            Upload Content
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 opacity-60 pointer-events-none">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Items</p>
                                    <p className="text-2xl font-bold">{contentItems.length}</p>
                                </div>
                                <Archive className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Views</p>
                                    <p className="text-2xl font-bold">{contentItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}</p>
                                </div>
                                <Eye className="h-8 w-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Likes</p>
                                    <p className="text-2xl font-bold">{contentItems.reduce((sum, item) => sum + item.likes, 0)}</p>
                                </div>
                                <Heart className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Published</p>
                                    <p className="text-2xl font-bold">{contentItems.filter(item => item.status === "published").length}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search content..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name} ({category.count})
                                    </option>
                                ))}
                            </select>

                            {/* Type Filter */}
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {contentTypes.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="liked">Most Liked</option>
                                <option value="alphabetical">A-Z</option>
                            </select>

                            {/* View Mode */}
                            <div className="flex border rounded-lg">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
                                >
                                    <Grid className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "bg-blue-50 text-blue-600" : "text-gray-500"}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Display */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Content Items ({filteredContent.length})</CardTitle>
                            {selectedItems.size > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedItems.size} selected
                                    </span>
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 hover:bg-gray-100 rounded">
                                        <Share2 className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-100 text-red-600 rounded">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {filteredContent.length === 0 ? (
                            <div className="p-8 text-center">
                                <Archive className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No content found</h3>
                                <p className="text-muted-foreground">Try adjusting your search or filters</p>
                            </div>
                        ) : viewMode === "grid" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {filteredContent.map(item => {
                                    const TypeIcon = getTypeIcon(item.type)
                                    return (
                                        <div
                                            key={item.id}
                                            className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
                                                selectedItems.has(item.id) ? "bg-blue-50 border-blue-200" : ""
                                            }`}
                                            onClick={() => toggleItemSelection(item.id)}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                                        {item.thumbnail}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <TypeIcon className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-1 hover:bg-gray-100 rounded">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </div>
                                            
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.content}</p>
                                            
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {item.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 2 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-xs rounded">+{item.tags.length - 2}</span>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {item.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        {item.likes}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="divide-y">
                                {filteredContent.map(item => {
                                    const TypeIcon = getTypeIcon(item.type)
                                    return (
                                        <div
                                            key={item.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                                selectedItems.has(item.id) ? "bg-blue-50" : ""
                                            }`}
                                            onClick={() => toggleItemSelection(item.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                                        {item.thumbnail}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium truncate">{item.title}</h3>
                                                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                                                                {item.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <TypeIcon className="h-3 w-3" />
                                                                {item.type}
                                                            </span>
                                                            <span>{item.size}</span>
                                                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        {item.views}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3 w-3" />
                                                        {item.likes}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        {item.comments}
                                                    </span>
                                                    <button className="p-1 hover:bg-gray-200 rounded">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}