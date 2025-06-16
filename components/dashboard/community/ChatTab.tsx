import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MessageCircle, Send } from 'lucide-react'
import { Message } from '@/types/community'
import { MessageItem } from './MessageItem'

interface ChatTabProps {
    messages: Message[]
    messagesLoading: boolean
    newMessage: string
    setNewMessage: (message: string) => void
    sending: boolean
    currentUserId: string | null
    onSendMessage: (e: React.FormEvent) => Promise<void>
    onEditMessage: (messageId: string, content: string) => Promise<void>
    onDeleteMessage: (messageId: string) => Promise<void>
}

export const ChatTab = ({
    messages,
    messagesLoading,
    newMessage,
    setNewMessage,
    sending,
    currentUserId,
    onSendMessage,
    onEditMessage,
    onDeleteMessage
}: ChatTabProps) => {
    const characterLimit = 500
    const warningThreshold = 400

    return (
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
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    currentUserId={currentUserId}
                                    onEdit={onEditMessage}
                                    onDelete={onDeleteMessage}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <div className="mt-4 border-t pt-4">
                    <form onSubmit={onSendMessage} className="flex gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={sending}
                            className="flex-1"
                            maxLength={characterLimit}
                        />
                        <Button type="submit" disabled={sending || !newMessage.trim()}>
                            {sending ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </form>
                    {newMessage.length > warningThreshold && (
                        <p className="text-xs text-muted-foreground mt-2">
                            {characterLimit - newMessage.length} characters remaining
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}