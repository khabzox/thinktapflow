"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Copy, Download, Filter, MoreHorizontal, Search, Sparkles, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

// Sample data for generations
const generations = [
    {
        id: "gen_1",
        title: "Product launch announcement for new AI tool",
        platforms: ["Twitter", "LinkedIn", "Facebook"],
        status: "completed",
        date: "2025-06-01T14:30:00Z",
        posts: 3,
    },
    {
        id: "gen_2",
        title: "Weekly newsletter content about industry trends",
        platforms: ["Email", "Blog"],
        status: "completed",
        date: "2025-06-01T09:15:00Z",
        posts: 2,
    },
    {
        id: "gen_3",
        title: "Holiday campaign social media posts",
        platforms: ["Instagram", "Twitter", "TikTok", "Facebook"],
        status: "completed",
        date: "2025-05-31T16:45:00Z",
        posts: 4,
    },
    {
        id: "gen_4",
        title: "Product feature announcement",
        platforms: ["Twitter", "LinkedIn"],
        status: "completed",
        date: "2025-05-30T11:20:00Z",
        posts: 2,
    },
    {
        id: "gen_5",
        title: "Customer testimonial highlights",
        platforms: ["Instagram", "Facebook"],
        status: "completed",
        date: "2025-05-29T13:10:00Z",
        posts: 2,
    },
    {
        id: "gen_6",
        title: "Industry event promotion",
        platforms: ["Twitter", "LinkedIn", "Email"],
        status: "completed",
        date: "2025-05-28T15:30:00Z",
        posts: 3,
    },
    {
        id: "gen_7",
        title: "Blog post promotion",
        platforms: ["Twitter", "LinkedIn", "Facebook"],
        status: "completed",
        date: "2025-05-27T10:45:00Z",
        posts: 3,
    },
]

export default function GenerationsPage() {
    const [selectedTab, setSelectedTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenerations, setSelectedGenerations] = useState<string[]>([])

    const filteredGenerations = generations.filter((gen) => {
        if (searchQuery) {
            return gen.title.toLowerCase().includes(searchQuery.toLowerCase())
        }
        return true
    })

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedGenerations(filteredGenerations.map((gen) => gen.id))
        } else {
            setSelectedGenerations([])
        }
    }

    const handleSelectGeneration = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedGenerations((prev) => [...prev, id])
        } else {
            setSelectedGenerations((prev) => prev.filter((genId) => genId !== id))
        }
    }

    const handleDelete = () => {
        toast.success(`${selectedGenerations.length} generations deleted`)
        setSelectedGenerations([])
    }

    const handleExport = (format: string) => {
        toast.success(`Exported ${selectedGenerations.length} generations as ${format}`)
        setSelectedGenerations([])
    }

    const handleCopy = (id: string) => {
        toast.success("Generation copied to clipboard")
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Generations</h1>
                        <p className="text-muted-foreground">View and manage your content generations</p>
                    </div>
                    <Button className="sm:w-auto">
                        <Sparkles className="mr-2 h-4 w-4" />
                        New Generation
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
                                <TabsList>
                                    <TabsTrigger value="all">All</TabsTrigger>
                                    <TabsTrigger value="recent">Recent</TabsTrigger>
                                    <TabsTrigger value="archived">Archived</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="flex flex-1 items-center gap-2 sm:max-w-xs">
                                <div className="relative flex-1">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search generations..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedGenerations.length > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-2">
                                <span className="text-sm font-medium">{selectedGenerations.length} selected</span>
                                <div className="flex-1" />
                                <Button variant="outline" size="sm" onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleExport("CSV")}>Export as CSV</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport("JSON")}>Export as JSON</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    filteredGenerations.length > 0 && selectedGenerations.length === filteredGenerations.length
                                                }
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">Platforms</TableHead>
                                        <TableHead className="hidden md:table-cell">Posts</TableHead>
                                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredGenerations.map((gen) => (
                                        <TableRow key={gen.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedGenerations.includes(gen.id)}
                                                    onCheckedChange={(checked) => handleSelectGeneration(gen.id, checked as boolean)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{gen.title}</div>
                                                <div className="md:hidden flex flex-wrap gap-1 mt-1">
                                                    {gen.platforms.map((platform) => (
                                                        <Badge key={platform} variant="secondary" className="text-xs">
                                                            {platform}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-muted-foreground sm:hidden mt-1">
                                                    {format(new Date(gen.date), "MMM d, yyyy")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-wrap gap-1">
                                                    {gen.platforms.map((platform) => (
                                                        <Badge key={platform} variant="secondary" className="text-xs">
                                                            {platform}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">{gen.posts}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{format(new Date(gen.date), "MMM d, yyyy")}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{format(new Date(gen.date), "h:mm a")}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleCopy(gen.id)}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Copy
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Regenerate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
