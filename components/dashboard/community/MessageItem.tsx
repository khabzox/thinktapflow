import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Clock, MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react'
import { Message } from '@/types/community'
import { formatTimeAgo, getInitials } from '@/utils/communityUtils'

interface MessageItemProps {
    message: Message
    currentUserId: string | null
    onEdit: (messageId: string, content: string) => Promise<void>
    onDelete: (messageId: string) => Promise<void>
}

export const MessageItem = ({ message, currentUserId, onEdit, onDelete }: MessageItemProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(message.content)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStartEdit = () => {
        setIsEditing(true)
        setEditContent(message.content)
    }

    const handleSaveEdit = async () => {
        if (!editContent.trim()) return

        setIsUpdating(true)
        const success = await onEdit(message.id, editContent)
        if (success) {
            setIsEditing(false)
        }
        setIsUpdating(false)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditContent(message.content)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this message?')) return
        await onDelete(message.id)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSaveEdit()
        }
        if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }

    const isOwner = message.user_id === currentUserId

    return (
        <div className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors group">
            <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={message.profiles?.avatar_url} />
                <AvatarFallback className="bg-primary/10">
                    {getInitials(message.profiles?.full_name)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                        {message.profiles?.full_name || 'Anonymous'}
                    </span>
                    {message.profiles?.username && (
                        <span className="text-xs text-muted-foreground">
                            @{message.profiles.username}
                        </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(message.created_at)}
                    </div>
                    {message.is_edited && (
                        <span className="text-xs text-muted-foreground italic">
                            (edited)
                        </span>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex gap-2 items-center">
                        <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="flex-1"
                            onKeyDown={handleKeyDown}
                            disabled={isUpdating}
                            autoFocus
                        />
                        <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            disabled={!editContent.trim() || isUpdating}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                )}
            </div>

            {isOwner && !isEditing && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleStartEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-destructive"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}