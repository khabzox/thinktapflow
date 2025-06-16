import { useState, useEffect, useRef } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Message, OnlineUser, UserProfile, ProfileForm } from '@/types/community'

export const useCommunity = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [profileForm, setProfileForm] = useState<ProfileForm>({ full_name: '', username: '' })
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

    const isProfileComplete = (profile: UserProfile | null): boolean => {
        return !!(profile?.full_name?.trim() && profile?.username?.trim())
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

    const cleanup = () => {
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

    return {
        // State
        messages, setMessages,
        onlineUsers, setOnlineUsers,
        newMessage, setNewMessage,
        loading, setLoading,
        sending, setSending,
        userProfile, setUserProfile,
        showProfileModal, setShowProfileModal,
        profileForm, setProfileForm,
        updatingProfile, setUpdatingProfile,
        checkingProfile,
        editingMessageId, setEditingMessageId,
        editingContent, setEditingContent,
        currentUserId,
        isMounted,
        messagesLoading, setMessagesLoading,
        isConnected, setIsConnected,

        // Refs
        channelsRef,
        presenceIntervalRef,
        connectionTimeoutRef,

        // Utils
        supabase,
        router,
        isProfileComplete,
        checkUserProfile,
        updateUserPresence,
        cleanup
    }
}