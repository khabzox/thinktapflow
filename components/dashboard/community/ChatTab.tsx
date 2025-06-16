import { useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, MessageCircle } from 'lucide-react'
import { Message } from '@/types/community'
import { MessageItem } from './MessageItem'

interface ChatTabProps {
    messages: Message[]
    messagesLoading: boolean
    newMessage: string
    setNewMessage: (message: string) => void
    onSendMessage: (e: React.FormEvent) => void
    sending: boolean
    currentUserId: string | null
    onEditMessage: (messageId: string, content: string) => Promise<void>
    onDeleteMessage: (messageId: string) => Promise<void>
}

/**
 * Renders a community chat interface with message display, input, and message management features.
 *
 * Displays a scrollable list of messages, supports sending new messages, and allows editing or deleting messages if handlers are provided. Automatically scrolls to the latest message when new messages arrive. Shows loading and empty states as appropriate.
 */
export function ChatTab({
    messages,
    messagesLoading,
    newMessage,
    setNewMessage,
    onSendMessage,
    sending,
    currentUserId,
    onEditMessage,
    onDeleteMessage
}: ChatTabProps) {
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Community Chat
                </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-muted-foreground">Loading messages...</div>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                            <p className="text-muted-foreground">Be the first to start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {messages.map((message) => (
                                <MessageItem
                                    key={message.id}
                                    message={message}
                                    currentUserId={currentUserId}
                                    // fix: onEditMessage is not defined
                                    onEdit={onEditMessage}
                                    onDelete={onDeleteMessage}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </ScrollArea>

                <div className="border-t p-4">
                    <form onSubmit={onSendMessage} className="flex gap-2">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            disabled={sending}
                            className="flex-1"
                            maxLength={500}
                        />
                        <Button 
                            type="submit" 
                            disabled={!newMessage.trim() || sending}
                            size="icon"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                        {newMessage.length}/500
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}