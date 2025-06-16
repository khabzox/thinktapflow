"use client"

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MessageCircle, Users, Send, AlertCircle, Settings, UserPlus, Clock, MoreHorizontal, Edit, Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Message, OnlineUser, UserProfile } from '@/types/community'

export default function CommunityPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [profileForm, setProfileForm] = useState({ full_name: '', username: '' })
    const [updatingProfile, setUpdatingProfile] = useState(false)
    const [checkingProfile, setCheckingProfile] = useState(true)
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
    const [editingContent, setEditingContent] = useState('')
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(true)
    const channelsRef = useRef<any[]>([])
    const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
        checkUserProfile()

        return () => {
            setIsMounted(false)

            // Clear connection timeout
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current)
            }

            // Cleanup all channels
            channelsRef.current.forEach(item => {
                if (item.cleanup) {
                    item.cleanup()
                } else {
                    supabase.removeChannel(item)
                }
            })
            channelsRef.current = []

            // Clear presence interval
            if (presenceIntervalRef.current) {
                clearInterval(presenceIntervalRef.current)
                presenceIntervalRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        if (userProfile && isProfileComplete(userProfile)) {
            initializeCommunity()
        }
    }, [userProfile])

    const handleEditMessage = (message: Message) => {
        setEditingMessageId(message.id)
        setEditingContent(message.content)
    }

    const handleSaveEdit = async (messageId: string) => {
        if (!editingContent.trim()) {
            toast.error('Message cannot be empty')
            return
        }

        try {
            const { error } = await supabase
                .from('chat_messages')
                .update({
                    content: editingContent.trim(),
                    updated_at: new Date().toISOString(),
                    is_edited: true
                })
                .eq('id', messageId)

            if (error) throw error

            // Update local state
            setMessages(prev => prev.map(msg =>
                msg.id === messageId
                    ? {
                        ...msg,
                        content: editingContent.trim(),
                        updated_at: new Date().toISOString(),
                        is_edited: true
                    }
                    : msg
            ))

            setEditingMessageId(null)
            setEditingContent('')
            toast.success('Message updated')
        } catch (error) {
            console.error('Error updating message:', error)
            toast.error('Error updating message')
        }
    }

    const handleCancelEdit = () => {
        setEditingMessageId(null)
        setEditingContent('')
    }

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return

        try {
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('id', messageId)

            if (error) throw error

            // Update local state
            setMessages(prev => prev.filter(msg => msg.id !== messageId))
            toast.success('Message deleted')
        } catch (error) {
            console.error('Error deleting message:', error)
            toast.error('Error deleting message')
        }
    }

    const checkUserProfile = async () => {
        if (!isMounted) return

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('Please sign in to access the community')
                router.push('/auth/login')
                return
            }

            setCurrentUserId(user.id)

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                toast.error('Error loading profile')
                return
            }

            if (isMounted) {
                setUserProfile(profile)

                if (!isProfileComplete(profile)) {
                    setProfileForm({
                        full_name: profile.full_name || '',
                        username: profile.username || ''
                    })
                    setShowProfileModal(true)
                }
            }
        } catch (error) {
            if (isMounted) {
                console.error('Error checking profile:', error)
                toast.error('Error checking profile')
            }
        } finally {
            if (isMounted) {
                setCheckingProfile(false)
            }
        }
    }

    const isProfileComplete = (profile: UserProfile | null): boolean => {
        return !!(profile?.full_name?.trim() && profile?.username?.trim())
    }

    const initializeCommunity = () => {
        if (!isMounted) return

        loadMessages()
        loadOnlineUsers()

        // Add a small delay before subscribing to avoid race conditions
        connectionTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
                const messageCleanup = subscribeToMessages()
                const presenceCleanup = subscribeToUserPresence()

                // Store cleanup functions
                channelsRef.current.push({ cleanup: messageCleanup })
                channelsRef.current.push({ cleanup: presenceCleanup })
            }
        }, 1000)

        updateUserPresence()

        presenceIntervalRef.current = setInterval(() => {
            if (isMounted) {
                updateUserPresence()
            }
        }, 30000)
    }

    const handleCompleteProfile = async () => {
        if (!profileForm.full_name.trim() || !profileForm.username.trim()) {
            toast.error('Please fill in both name and username')
            return
        }

        // Check if username is unique
        const { data: existingUser, error: checkError } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', profileForm.username.trim())
            .neq('id', userProfile?.id)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking username:', checkError)
            toast.error('Error checking username availability')
            return
        }

        if (existingUser) {
            toast.error('Username already taken. Please choose another.')
            return
        }

        try {
            setUpdatingProfile(true)

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profileForm.full_name.trim(),
                    username: profileForm.username.trim()
                })
                .eq('id', userProfile?.id)

            if (error) throw error

            setUserProfile(prev => prev ? {
                ...prev,
                full_name: profileForm.full_name.trim(),
                username: profileForm.username.trim()
            } : null)

            setShowProfileModal(false)
            toast.success('Profile completed! Welcome to the community!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Error updating profile')
        } finally {
            setUpdatingProfile(false)
        }
    }

    const redirectToSettings = () => {
        router.push('/dashboard/settings')
    }

    const loadMessages = async () => {
        if (!isMounted) return

        try {
            setMessagesLoading(true)

            const { data: messagesData, error: messagesError } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (messagesError) throw messagesError

            const userIds = [...new Set((messagesData || []).map(msg => msg.user_id))]
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username')
                .in('id', userIds)

            if (profilesError) throw profilesError

            const profilesMap = (profilesData || []).reduce((acc, profile) => {
                acc[profile.id] = profile
                return acc
            }, {} as Record<string, any>)

            const transformedData = (messagesData || []).map(msg => ({
                id: msg.id,
                user_id: msg.user_id,
                content: msg.content,
                created_at: msg.created_at,
                updated_at: msg.updated_at,
                is_edited: msg.is_edited || false,
                profiles: {
                    full_name: profilesMap[msg.user_id]?.full_name || null,
                    avatar_url: profilesMap[msg.user_id]?.avatar_url || undefined,
                    username: profilesMap[msg.user_id]?.username || null
                }
            })) satisfies Message[]

            if (isMounted) {
                setMessages(transformedData.reverse())
            }
        } catch (error) {
            if (isMounted) {
                console.error('Error loading messages:', error)
                toast.error('Error loading chat messages')
            }
        } finally {
            if (isMounted) {
                setMessagesLoading(false)
            }
        }
    }

    const loadOnlineUsers = async () => {
        if (!isMounted) return
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username, last_seen')
                .not('full_name', 'is', null)
                .not('username', 'is', null)
                .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
                .order('last_seen', { ascending: false })
                .limit(20)

            if (error) throw error

            if (isMounted) {
                setOnlineUsers(data || [])
            }
        } catch (error) {
            if (isMounted) {
                console.error('Error loading online users:', error)
            }
        }
    }

    const updateUserPresence = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            await supabase
                .from('profiles')
                .update({ last_seen: new Date().toISOString() })
                .eq('id', user.id)
        } catch (error) {
            console.error('Error updating presence:', error)
        }
    }

    const subscribeToUserPresence = () => {
        const channel = supabase
            .channel(`online_users_${Date.now()}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                () => {
                    if (isMounted) {
                        loadOnlineUsers()
                    }
                }
            )
            .subscribe()

        channelsRef.current.push(channel)

        return () => {
            if (channel) {
                supabase.removeChannel(channel)
                channelsRef.current = channelsRef.current.filter(c => c !== channel)
            }
        }
    }

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`chat_messages_${Date.now()}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                async (payload) => {
                    if (!isMounted) return
                    const { data: messageData, error: messageError } = await supabase
                        .from('chat_messages')
                        .select('*')
                        .eq('id', payload.new.id)
                        .single()

                    if (!messageError && messageData) {
                        const { data: profileData, error: profileError } = await supabase
                            .from('profiles')
                            .select('id, full_name, avatar_url, username')
                            .eq('id', messageData.user_id)
                            .single()

                        const transformedMessage = {
                            id: messageData.id,
                            user_id: messageData.user_id,
                            content: messageData.content,
                            created_at: messageData.created_at,
                            updated_at: messageData.updated_at,
                            is_edited: messageData.is_edited || false,
                            profiles: {
                                full_name: profileData?.full_name || null,
                                avatar_url: profileData?.avatar_url || undefined,
                                username: profileData?.username || null
                            }
                        } satisfies Message

                        if (isMounted) {
                            setMessages(prev => [...prev, transformedMessage])
                        }
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED' && isMounted) {
                    setIsConnected(true)
                }
                if (status === 'CLOSED' && isMounted) {
                    setIsConnected(false)
                }
            })

        channelsRef.current.push(channel)


        return () => {
            if (channel) {
                supabase.removeChannel(channel)
                channelsRef.current = channelsRef.current.filter(c => c !== channel)
            }
        }
    }

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            setSending(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('Please sign in to send messages')
                return
            }

            const { error } = await supabase
                .from('chat_messages')
                .insert([
                    {
                        content: newMessage.trim(),
                        user_id: user.id
                    }
                ])

            if (error) throw error
            setNewMessage('')
            updateUserPresence()
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Error sending message')
        } finally {
            setSending(false)
        }
    }

    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    if (checkingProfile) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground">Loading community...</p>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    if (!userProfile || !isProfileComplete(userProfile)) {
        return (
            <DashboardLayout>
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                        <p className="text-muted-foreground">Connect with other ThinkTapFlow users</p>
                    </div>

                    <Card className="max-w-2xl mx-auto">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <UserPlus className="h-10 w-10 text-primary" />
                            </div>
                            <CardTitle>Complete Your Profile</CardTitle>
                            <CardDescription>
                                To join the community chat, please complete your profile with a name and username
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Missing: {!userProfile?.full_name && 'Name'} {!userProfile?.full_name && !userProfile?.username && ' and '} {!userProfile?.username && 'Username'}
                                </p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                <Button onClick={() => setShowProfileModal(true)}>
                                    Complete Profile
                                </Button>
                                <Button variant="outline" onClick={redirectToSettings}>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Go to Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Completion Modal */}
                    <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Complete Your Profile</DialogTitle>
                                <DialogDescription>
                                    Please provide your name and username to join the community
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        placeholder="Enter your full name"
                                        value={profileForm.full_name}
                                        onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Choose a username"
                                        value={profileForm.username}
                                        onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Only lowercase letters, numbers, and underscores allowed
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCompleteProfile}
                                        disabled={updatingProfile || !profileForm.full_name.trim() || !profileForm.username.trim()}
                                        className="flex-1"
                                    >
                                        {updatingProfile ? 'Updating...' : 'Complete Profile'}
                                    </Button>
                                    <Button variant="outline" onClick={redirectToSettings}>
                                        <Settings className="h-4 w-4 mr-2" />
                                        Settings
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                        <p className="text-muted-foreground">Connect with other ThinkTapFlow users</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        {onlineUsers.length} online
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                    <Tabs defaultValue="chat" className="flex-1">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="chat" className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Chat
                            </TabsTrigger>
                            <TabsTrigger value="members" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Members ({onlineUsers.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Community Chat</CardTitle>
                                    <CardDescription>
                                        Chat with other content creators in real-time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[500px] pr-4">
                                        {messagesLoading ? (
                                            <div className="flex items-center justify-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
                                                <MessageCircle className="h-12 w-12" />
                                                <div>
                                                    <p className="font-medium">No messages yet</p>
                                                    <p className="text-sm">Be the first to start the conversation!</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {messages.map((message) => (
                                                    <div key={message.id} className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors group">
                                                        <Avatar className="h-8 w-8 ring-2 ring-background">
                                                            <AvatarImage src={message.profiles?.avatar_url} />
                                                            <AvatarFallback className="bg-primary/10">
                                                                {message.profiles?.full_name?.[0]?.toUpperCase() || 'U'}
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
                                                            {editingMessageId === message.id ? (
                                                                <div className="flex gap-2 items-center">
                                                                    <Input
                                                                        value={editingContent}
                                                                        onChange={(e) => setEditingContent(e.target.value)}
                                                                        className="flex-1"
                                                                        onKeyDown={(e) => {
                                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                                e.preventDefault()
                                                                                handleSaveEdit(message.id)
                                                                            }
                                                                            if (e.key === 'Escape') {
                                                                                handleCancelEdit()
                                                                            }
                                                                        }}
                                                                        autoFocus
                                                                    />
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleSaveEdit(message.id)}
                                                                        disabled={!editingContent.trim()}
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={handleCancelEdit}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                                                            )}
                                                        </div>
                                                        {message.user_id === currentUserId && editingMessageId !== message.id && (
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
                                                                    <DropdownMenuItem onClick={() => handleEditMessage(message)}>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteMessage(message.id)}
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>

                                    <div className="mt-4 border-t pt-4">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <Input
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                disabled={sending}
                                                className="flex-1"
                                                maxLength={500}
                                            />
                                            <Button type="submit" disabled={sending || !newMessage.trim()}>
                                                {sending ? (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </form>
                                        {newMessage.length > 400 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {500 - newMessage.length} characters remaining
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="members" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Online Members</CardTitle>
                                    <CardDescription>
                                        {onlineUsers.length} members currently active in the community
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[500px]">
                                        {onlineUsers.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
                                                <Users className="h-12 w-12" />
                                                <div>
                                                    <p className="font-medium">No one online yet</p>
                                                    <p className="text-sm">Be the first to join the conversation!</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {onlineUsers.map((user) => (
                                                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                        <div className="relative">
                                                            <Avatar className="h-10 w-10 ring-2 ring-background">
                                                                <AvatarImage src={user.avatar_url} />
                                                                <AvatarFallback className="bg-primary/10">
                                                                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500 flex items-center justify-center">
                                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-sm truncate">{user.full_name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                @{user.username}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Active {formatTimeAgo(user.last_seen)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Community Guidelines
                                </CardTitle>
                                <CardDescription>
                                    Keep our community friendly and welcoming
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        <div>
                                            <p className="font-medium text-sm">Be Respectful</p>
                                            <p className="text-xs text-muted-foreground">
                                                Treat others with kindness and respect
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        <div>
                                            <p className="font-medium text-sm">No Spam</p>
                                            <p className="text-xs text-muted-foreground">
                                                Avoid repetitive or promotional content
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        <div>
                                            <p className="font-medium text-sm">Stay On Topic</p>
                                            <p className="text-xs text-muted-foreground">
                                                Keep discussions content creation related
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                                        <div>
                                            <p className="font-medium text-sm">Help Others</p>
                                            <p className="text-xs text-muted-foreground">
                                                Share knowledge and support creators
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Messages today</span>
                                    <span className="font-medium">{messages.filter(m =>
                                        new Date(m.created_at).toDateString() === new Date().toDateString()
                                    ).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Active users</span>
                                    <span className="font-medium">{onlineUsers.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total messages</span>
                                    <span className="font-medium">{messages.length}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}