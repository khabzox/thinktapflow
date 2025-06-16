import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageCircle, Users } from 'lucide-react'
import { Message, OnlineUser } from '@/types/community'
import { ChatTab } from './ChatTab'
import { MembersTab } from './MembersTab'
import { CommunitySidebar } from './CommunitySidebar'

interface CommunityMainProps {
    messages: Message[]
    onlineUsers: OnlineUser[]
    messagesLoading: boolean
    newMessage: string
    setNewMessage: (message: string) => void
    onSendMessage: (e: React.FormEvent) => void
    sending: boolean
    currentUserId: string | null
    onEditMessage: (messageId: string, content: string) => void
    onDeleteMessage: (messageId: string) => void
}

/**
 * Renders the main community interface with chat and members tabs, displaying messages, online users, and a sidebar.
 *
 * @param messages - Array of chat messages to display in the chat tab and sidebar.
 * @param onlineUsers - List of users currently online, shown in the members tab and header.
 * @param messagesLoading - Indicates if messages are currently being loaded.
 * @param newMessage - The current value of the message input field.
 * @param setNewMessage - Handler to update the message input value.
 * @param onSendMessage - Handler to send a new message.
 * @param sending - Indicates if a message is currently being sent.
 * @param currentUserId - The ID of the current user, used for message actions.
 * @param onEditMessage - Handler to edit an existing message.
 * @param onDeleteMessage - Handler to delete a message.
 *
 * @returns The community dashboard layout with chat, members, and sidebar components.
 */
export function CommunityMain({
    messages,
    onlineUsers,
    messagesLoading,
    newMessage,
    setNewMessage,
    onSendMessage,
    sending,
    currentUserId,
    onEditMessage,
    onDeleteMessage
}: CommunityMainProps) {
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
                            <ChatTab
                                messages={messages}
                                messagesLoading={messagesLoading}
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                onSendMessage={onSendMessage}
                                sending={sending}
                                currentUserId={currentUserId}
                                onEditMessage={onEditMessage}
                                onDeleteMessage={onDeleteMessage}
                            />
                        </TabsContent>

                        <TabsContent value="members" className="mt-4">
                            <MembersTab onlineUsers={onlineUsers} />
                        </TabsContent>
                    </Tabs>

                    <CommunitySidebar
                        messages={messages}
                        onlineUsersCount={onlineUsers.length}
                    />
                </div>
            </div>
        </DashboardLayout>
    )
}