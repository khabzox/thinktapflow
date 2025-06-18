import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Message, OnlineUser, UserProfile } from '@/types/community'

/**
 * Provides state and handlers for a real-time community chat with user presence and profile management.
 *
 * This React hook manages chat messages, online user presence, user profile completion, message editing and deletion, and real-time updates using Supabase as the backend. It exposes state variables and action handlers for integrating a community chat feature into components.
 *
 * @returns An object containing chat messages, online users, user profile data, UI state, and action handlers for sending, editing, and deleting messages, managing user presence, completing profiles, and utility functions.
 */
export function useCommunity() {
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
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    const channelsRef = useRef<any[]>([])
    const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const supabase = createClientComponentClient()
    const router = useRouter()

    const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; messageId: string | null }>({
        isOpen: false,
        messageId: null
    });

    // Initialize community
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

    // Initialize community features when profile is complete
    useEffect(() => {
        if (userProfile && isProfileComplete(userProfile)) {
            initializeCommunity()
        }
    }, [userProfile])

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
        try {
            const { error } = await supabase
                .from('chat_messages')
                .delete()
                .eq('id', messageId)

            if (error) throw error

            setMessages(prev => prev.filter(msg => msg.id !== messageId))
            setDeleteConfirmation({ isOpen: false, messageId: null })
            toast.success('Message deleted')
        } catch (error) {
            console.error('Error deleting message:', error)
            toast.error('Error deleting message')
        }
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

    const formatTimeAgo = (dateString: string) => {
        const now = new Date()
        const date = new Date(dateString)
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    return {
        // State
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        loading,
        sending,
        userProfile,
        showProfileModal,
        setShowProfileModal,
        profileForm,
        setProfileForm,
        updatingProfile,
        checkingProfile,
        editingMessageId,
        editingContent,
        setEditingContent,
        currentUserId,
        messagesLoading,
        isConnected,
        deleteConfirmation,
        setDeleteConfirmation,

        // Actions
        handleSendMessage,
        handleEditMessage,
        handleSaveEdit,
        handleCancelEdit,
        handleDeleteMessage,
        handleCompleteProfile,
        redirectToSettings,
        formatTimeAgo,
        isProfileComplete
    }
}