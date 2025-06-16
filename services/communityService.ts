import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { Message, OnlineUser, ProfileForm } from '@/types/community'

export class CommunityService {
    private supabase = createClientComponentClient()

    async loadMessages(isMounted: boolean): Promise<Message[]> {
        if (!isMounted) return []

        try {
            const { data: messagesData, error: messagesError } = await this.supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50)

            if (messagesError) throw messagesError

            const userIds = [...new Set((messagesData || []).map(msg => msg.user_id))]
            const { data: profilesData, error: profilesError } = await this.supabase
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

            return transformedData.reverse()
        } catch (error) {
            console.error('Error loading messages:', error)
            toast.error('Error loading chat messages')
            return []
        }
    }

    async loadOnlineUsers(isMounted: boolean): Promise<OnlineUser[]> {
        if (!isMounted) return []

        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('id, full_name, avatar_url, username, last_seen')
                .not('full_name', 'is', null)
                .not('username', 'is', null)
                .gt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString())
                .order('last_seen', { ascending: false })
                .limit(20)

            if (error) throw error

            return data || []
        } catch (error) {
            console.error('Error loading online users:', error)
            return []
        }
    }

    async sendMessage(content: string): Promise<boolean> {
        try {
            const { data: { user } } = await this.supabase.auth.getUser()
            if (!user) {
                toast.error('Please sign in to send messages')
                return false
            }

            const { error } = await this.supabase
                .from('chat_messages')
                .insert([
                    {
                        content: content.trim(),
                        user_id: user.id
                    }
                ])

            if (error) throw error
            return true
        } catch (error) {
            console.error('Error sending message:', error)
            toast.error('Error sending message')
            return false
        }
    }

    async updateMessage(messageId: string, content: string): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('chat_messages')
                .update({
                    content: content.trim(),
                    updated_at: new Date().toISOString(),
                    is_edited: true
                })
                .eq('id', messageId)

            if (error) throw error
            toast.success('Message updated')
            return true
        } catch (error) {
            console.error('Error updating message:', error)
            toast.error('Error updating message')
            return false
        }
    }

    async deleteMessage(messageId: string): Promise<boolean> {
        try {
            const { error } = await this.supabase
                .from('chat_messages')
                .delete()
                .eq('id', messageId)

            if (error) throw error
            toast.success('Message deleted')
            return true
        } catch (error) {
            console.error('Error deleting message:', error)
            toast.error('Error deleting message')
            return false
        }
    }

    async completeProfile(profileForm: ProfileForm, userId?: string): Promise<boolean> {
        if (!profileForm.full_name.trim() || !profileForm.username.trim()) {
            toast.error('Please fill in both name and username')
            return false
        }

        // Check if username is unique
        const { data: existingUser, error: checkError } = await this.supabase
            .from('profiles')
            .select('id')
            .eq('username', profileForm.username.trim())
            .neq('id', userId)
            .single()

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking username:', checkError)
            toast.error('Error checking username availability')
            return false
        }

        if (existingUser) {
            toast.error('Username already taken. Please choose another.')
            return false
        }

        try {
            const { error } = await this.supabase
                .from('profiles')
                .update({
                    full_name: profileForm.full_name.trim(),
                    username: profileForm.username.trim()
                })
                .eq('id', userId)

            if (error) throw error
            toast.success('Profile completed! Welcome to the community!')
            return true
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Error updating profile')
            return false
        }
    }

    subscribeToMessages(
        isMounted: boolean,
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
        setIsConnected: React.Dispatch<React.SetStateAction<boolean>>
    ) {
        const channel = this.supabase
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

                    const { data: messageData, error: messageError } = await this.supabase
                        .from('chat_messages')
                        .select('*')
                        .eq('id', payload.new.id)
                        .single()

                    if (!messageError && messageData) {
                        const { data: profileData } = await this.supabase
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

        return () => {
            if (channel) {
                this.supabase.removeChannel(channel)
            }
        }
    }

    subscribeToUserPresence(
        isMounted: boolean,
        loadOnlineUsers: () => Promise<void>
    ) {
        const channel = this.supabase
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

        return () => {
            if (channel) {
                this.supabase.removeChannel(channel)
            }
        }
    }
}