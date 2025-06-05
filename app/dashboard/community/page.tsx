"use client"

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MessageCircle, Users, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type Profile = {
    full_name: string | null
    avatar_url: string | undefined
    username: string | null
}

interface Message {
    id: string
    user_id: string
    content: string
    created_at: string
    profiles: Profile
}

interface OnlineUser {
    id: string
    full_name: string | null
    avatar_url: string | undefined
    username: string | null
    last_seen: string
}

export default function CommunityPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const supabase = createClientComponentClient()

    useEffect(() => {
        loadMessages()
        loadOnlineUsers()
        subscribeToMessages()
        subscribeToUserPresence()
        updateUserPresence()
    }, [])

    const loadMessages = async () => {
        try {
            // First, fetch messages
            const { data: messagesData, error: messagesError } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (messagesError) throw messagesError

            // Then, fetch all profiles for these messages
            const userIds = [...new Set((messagesData || []).map(msg => msg.user_id))]
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username')
                .in('id', userIds)

            if (profilesError) throw profilesError

            // Create a map of profiles for easy lookup
            const profilesMap = (profilesData || []).reduce((acc, profile) => {
                acc[profile.id] = profile
                return acc
            }, {} as Record<string, any>)

            console.log('Messages data:', messagesData)
            console.log('Profiles data:', profilesData)
            console.log('Profiles map:', profilesMap)

            // Transform the data to match the Message interface
            const transformedData = (messagesData || []).map(msg => ({
                id: msg.id,
                user_id: msg.user_id,
                content: msg.content,
                created_at: msg.created_at,
                profiles: {
                    full_name: profilesMap[msg.user_id]?.full_name || null,
                    avatar_url: profilesMap[msg.user_id]?.avatar_url || undefined,
                    username: profilesMap[msg.user_id]?.username || null
                }
            })) satisfies Message[]
            
            console.log('Transformed data:', transformedData)
            
            setMessages(transformedData.reverse())
        } catch (error) {
            console.error('Error loading messages:', error)
            toast.error('Error loading chat messages')
        } finally {
            setLoading(false)
        }
    }

    const loadOnlineUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username, last_seen')
                .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
                .order('last_seen', { ascending: false })

            if (error) throw error
            setOnlineUsers(data || [])
        } catch (error) {
            console.error('Error loading online users:', error)
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
            .channel('online_users')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                () => {
                    loadOnlineUsers()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }

    const subscribeToMessages = () => {
        const channel = supabase
            .channel('chat_messages')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                },
                async (payload) => {
                    // Fetch the new message
                    const { data: messageData, error: messageError } = await supabase
                        .from('chat_messages')
                        .select('*')
                        .eq('id', payload.new.id)
                        .single()

                    if (!messageError && messageData) {
                        // Fetch the profile for this message
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
                            profiles: {
                                full_name: profileData?.full_name || null,
                                avatar_url: profileData?.avatar_url || undefined,
                                username: profileData?.username || null
                            }
                        } satisfies Message

                        setMessages(prev => [...prev, transformedMessage])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
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

    // Add debug log for messages state
    useEffect(() => {
        console.log('Current messages state:', messages)
    }, [messages])

    return (
        <DashboardLayout>
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                    <p className="text-muted-foreground">Connect with other ThinkTapFlow users</p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_300px]">
                    <Tabs defaultValue="chat" className="flex-1">
                        <TabsList>
                            <TabsTrigger value="chat" className="flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Chat
                            </TabsTrigger>
                            <TabsTrigger value="members" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Online Members
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
                                        {loading ? (
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
                                                    <div key={message.id} className="flex items-start gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={message.profiles?.avatar_url} />
                                                            <AvatarFallback>
                                                                {message.profiles?.full_name?.[0] || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium">
                                                                    {message.profiles?.full_name || 'Anonymous'}
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {new Date(message.created_at).toLocaleTimeString()}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm">{message.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>

                                    <div className="mt-4">
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <Input
                                                placeholder="Type your message..."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                disabled={sending}
                                            />
                                            <Button type="submit" disabled={sending || !newMessage.trim()}>
                                                {sending ? (
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="members" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Online Members</CardTitle>
                                    <CardDescription>
                                        See who's currently active in the community
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[500px]">
                                        <div className="space-y-4">
                                            {onlineUsers.map((user) => (
                                                <div key={user.id} className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={user.avatar_url} />
                                                            <AvatarFallback>
                                                                {user.full_name?.[0] || 'U'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.full_name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            @{user.username}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    <Card>
                        <CardHeader>
                            <CardTitle>Community Guidelines</CardTitle>
                            <CardDescription>
                                Please follow these guidelines to keep our community friendly
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Be Respectful</p>
                                        <p className="text-sm text-muted-foreground">
                                            Treat others with kindness and respect
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">No Spam</p>
                                        <p className="text-sm text-muted-foreground">
                                            Avoid posting repetitive or promotional content
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Stay On Topic</p>
                                        <p className="text-sm text-muted-foreground">
                                            Keep discussions related to content creation
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Help Others</p>
                                        <p className="text-sm text-muted-foreground">
                                            Share your knowledge and support fellow creators
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
} 