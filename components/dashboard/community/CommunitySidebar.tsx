import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import { Message } from '@/types/community'

interface CommunitySidebarProps {
    messages: Message[]
    onlineUsersCount: number
}

export function CommunitySidebar({ messages, onlineUsersCount }: CommunitySidebarProps) {
    const todayMessages = messages.filter(m =>
        new Date(m.created_at).toDateString() === new Date().toDateString()
    ).length

    return (
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
                        <span className="font-medium">{todayMessages}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Active users</span>
                        <span className="font-medium">{onlineUsersCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total messages</span>
                        <span className="font-medium">{messages.length}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}