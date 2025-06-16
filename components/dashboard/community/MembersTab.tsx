import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { OnlineUser } from '@/types/community'
import { formatTimeAgo } from '@/utils/communityUtils'

interface MembersTabProps {
    onlineUsers: OnlineUser[]
}

/**
 * Displays a card listing online community members with avatars, usernames, and last active times.
 *
 * Shows a message if no members are currently online. Each online member is presented with their avatar, full name, username, and a formatted indication of when they were last active.
 *
 * @param onlineUsers - Array of currently online users to display.
 */
export function MembersTab({ onlineUsers }: MembersTabProps) {
    return (
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
    )
}