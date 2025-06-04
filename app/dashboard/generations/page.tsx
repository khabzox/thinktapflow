"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Clock, Copy, Download, Filter, MoreHorizontal, Search, Sparkles, Trash2, Archive, Loader2, Eye, FileText } from "lucide-react"
import { format as formatDate } from "date-fns"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { useGenerations, Generation } from "@/hooks/use-generations"
import Link from "next/link"
import { PostContentDialog } from "@/components/ui/post-content-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"

export default function GenerationsPage() {
    const { generations, loading, error, deleteGenerations, archiveGenerations, unarchiveGenerations, exportGenerations, regenerateContent } = useGenerations()
    const [selectedTab, setSelectedTab] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGenerations, setSelectedGenerations] = useState<string[]>([])
    const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null)
    const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [generationsToDelete, setGenerationsToDelete] = useState<string[]>([])
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'platforms'>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Get unique platforms from all generations
    const availablePlatforms = useMemo(() => {
        const platforms = new Set<string>();
        generations.forEach(gen => {
            gen.platforms.forEach(platform => platforms.add(platform));
        });
        return Array.from(platforms);
    }, [generations]);

    const filteredGenerations = useMemo(() => {
        return generations.filter((gen) => {
            // Filter by tab
            if (selectedTab === "archived" && gen.status !== "archived") return false;
            if (selectedTab === "recent" && gen.status !== "completed") return false;
            if (selectedTab === "all" && (gen.status === "archived" || gen.status === "deleted")) return false;

            // Filter by search
            if (searchQuery && !gen.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

            // Filter by platform
            if (selectedPlatform !== "all" && !gen.platforms.includes(selectedPlatform)) return false;

            return true;
        }).sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'desc' 
                    ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            }
            if (sortBy === 'title') {
                return sortOrder === 'desc'
                    ? b.title.localeCompare(a.title)
                    : a.title.localeCompare(b.title);
            }
            // Sort by platform count
            return sortOrder === 'desc'
                ? b.platforms.length - a.platforms.length
                : a.platforms.length - b.platforms.length;
        });
    }, [generations, selectedTab, searchQuery, selectedPlatform, sortBy, sortOrder]);

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

    const handleDelete = async (ids?: string[]) => {
        const idsToDelete = ids || selectedGenerations
        await deleteGenerations(idsToDelete)
        setSelectedGenerations([])
    }

    const handleExport = async (exportFormat: 'CSV' | 'JSON' | 'PDF') => {
        if (exportFormat === 'PDF') {
            // Create a temporary div for all selected generations
            const tempDiv = document.createElement('div');
            tempDiv.className = 'p-8';

            // Add header with logo and website name
            const headerSection = document.createElement('div');
            headerSection.className = 'mb-8 flex items-center justify-between pb-6 border-b';
            headerSection.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="/logo/logosaas-dark.png" alt="ThinkTapFlow Logo" class="h-8" />
                    <h1 class="text-2xl font-bold">ThinkTapFlow</h1>
                </div>
                <div class="text-gray-500">
                    Generated on ${formatDate(new Date(), 'MMMM d, yyyy')}
                </div>
            `;
            tempDiv.appendChild(headerSection);

            // Get all selected generations
            const selectedItems = generations.filter(g => selectedGenerations.includes(g.id));
            
            // Add content for each selected generation
            selectedItems.forEach((gen, genIndex) => {
                const generationSection = document.createElement('div');
                generationSection.className = 'mb-12';
                generationSection.innerHTML = `
                    <h2 class="text-2xl font-bold mb-4">${gen.title}</h2>
                    <p class="text-gray-600 mb-8">Generated content for ${gen.platforms.length} platform${gen.platforms.length !== 1 ? 's' : ''}</p>
                `;

                // Add content for each platform
                gen.platforms.forEach(platform => {
                    const posts = gen.posts.filter(p => p.platform === platform);
                    if (!posts?.length) return;

                    const platformSection = document.createElement('div');
                    platformSection.className = 'mb-8';
                    platformSection.innerHTML = `
                        <h2 class="text-xl font-semibold mb-4 capitalize">${platform}</h2>
                        ${posts.map((post, index) => `
                            <div class="mb-6">
                                <div class="font-medium mb-2">Variation ${index + 1}</div>
                                <div class="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg mb-2">${post.content}</div>
                                ${post.hashtags.length ? `
                                    <div class="flex flex-wrap gap-1 mb-2">
                                        ${post.hashtags.map(tag => `<span class="text-blue-600">${tag}</span>`).join(' ')}
                                    </div>
                                ` : ''}
                                ${post.mentions.length ? `
                                    <div class="flex flex-wrap gap-1">
                                        ${post.mentions.map(mention => `<span class="text-blue-500">${mention}</span>`).join(' ')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    `;
                    generationSection.appendChild(platformSection);
                });

                // Add page break between generations except for the last one
                if (genIndex < selectedItems.length - 1) {
                    generationSection.style.pageBreakAfter = 'always';
                }

                tempDiv.appendChild(generationSection);
            });

            try {
                const html2pdf = (await import('html2pdf.js')).default;
                
                const opt = {
                    margin: 1,
                    filename: `generations-export-${formatDate(new Date(), 'yyyy-MM-dd')}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
                };

                await html2pdf().set(opt).from(tempDiv).save();
                toast.success('PDF exported successfully!');
            } catch (error) {
                console.error('PDF export error:', error);
                toast.error('Failed to export PDF');
            }
            return;
        }
        
        await exportGenerations(selectedGenerations, exportFormat)
        setSelectedGenerations([])
    }

    const handleArchive = async (ids: string[]) => {
        await archiveGenerations(ids)
        setSelectedGenerations([])
    }

    const handleUnarchive = async (ids: string[]) => {
        await unarchiveGenerations(ids)
        setSelectedGenerations([])
    }

    const handleCopy = (generation: typeof generations[0]) => {
        const content = generation.posts.map(post => 
            `${post.platform}:\n${post.content}\n\nHashtags: ${post.hashtags.join(' ')}`
        ).join('\n\n');
        navigator.clipboard.writeText(content);
        toast.success("Generation copied to clipboard");
    }

    const handleViewContent = (generation: Generation) => {
        setSelectedGeneration(generation);
    };

    const handleDeleteConfirm = async () => {
        await handleDelete(generationsToDelete);
        setShowDeleteAlert(false);
        setGenerationsToDelete([]);
    };

    const handleDeleteClick = (ids: string[]) => {
        setGenerationsToDelete(ids);
        setShowDeleteAlert(true);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[200px]">
                    <div className="animate-spin">
                        <Loader2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center h-[200px] gap-4">
                    <p className="text-destructive">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Generations</h1>
                        <p className="text-muted-foreground">View and manage your content generations</p>
                    </div>
                    <Link href="/dashboard/generate">
                    <Button className="sm:w-auto">
                        <Sparkles className="mr-2 h-4 w-4" />
                        New Generation
                    </Button>
                    </Link>
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
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Filter className="h-4 w-4" />
                                </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        <div className="p-2">
                                            <div className="mb-4">
                                                <Label>Platform</Label>
                                                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select platform" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Platforms</SelectItem>
                                                        {availablePlatforms.map(platform => (
                                                            <SelectItem key={platform} value={platform}>
                                                                {platform}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="mb-4">
                                                <Label>Sort By</Label>
                                                <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'platforms') => setSortBy(value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sort by" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="date">Date</SelectItem>
                                                        <SelectItem value="title">Title</SelectItem>
                                                        <SelectItem value="platforms">Platform Count</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Order</Label>
                                                <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sort order" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="desc">Descending</SelectItem>
                                                        <SelectItem value="asc">Ascending</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {selectedGenerations.length > 0 && (
                            <div className="mb-4 flex items-center gap-2 rounded-lg bg-muted p-2">
                                <span className="text-sm font-medium">{selectedGenerations.length} selected</span>
                                <div className="flex-1" />
                                <Button variant="outline" size="sm" onClick={() => handleDeleteClick(selectedGenerations)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleArchive(selectedGenerations)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => handleExport("PDF")}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export as PDF
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport("CSV")}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export as CSV
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport("JSON")}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Export as JSON
                                        </DropdownMenuItem>
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
                                                    {formatDate(new Date(gen.created_at), "MMM d, yyyy")}
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
                                            <TableCell className="hidden md:table-cell">{gen.posts.length}</TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    <span>{formatDate(new Date(gen.created_at), "MMM d, yyyy")}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(new Date(gen.created_at), "h:mm a")}</span>
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
                                                        <DropdownMenuItem onClick={() => handleViewContent(gen)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Content
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleCopy(gen)}>
                                                            <Copy className="mr-2 h-4 w-4" />
                                                            Copy
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => regenerateContent(gen.id)}>
                                                            <Sparkles className="mr-2 h-4 w-4" />
                                                            Regenerate
                                                        </DropdownMenuItem>
                                                        {gen.status === 'archived' ? (
                                                            <DropdownMenuItem onClick={() => handleUnarchive([gen.id])}>
                                                                <Archive className="mr-2 h-4 w-4" />
                                                                Unarchive
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleArchive([gen.id])}>
                                                                <Archive className="mr-2 h-4 w-4" />
                                                                Archive
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem 
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteClick([gen.id])}
                                                        >
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

                        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the selected generation{generationsToDelete.length > 1 ? 's' : ''}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <PostContentDialog 
                            isOpen={!!selectedGeneration}
                            onClose={() => setSelectedGeneration(null)}
                            generation={selectedGeneration}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
