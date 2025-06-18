'use client';

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useCommunity } from "@/hooks/use-community";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Settings, MessageCircle, Users, Clock, Check, X, MoreHorizontal, Edit, Trash2, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const CommunityPage = () => {
    const {
        // State
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
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
    } = useCommunity();

    // Loading state
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
        );
    }

    // Profile incomplete state
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
        );
    }

    // Main community interface
    return (
        <DashboardLayout>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
                        <p className="text-muted-foreground">Connect with other ThinkTapFlow users</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                                                                                e.preventDefault();
                                                                                handleSaveEdit(message.id);
                                                                            }
                                                                            if (e.key === 'Escape') {
                                                                                handleCancelEdit();
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
                                                                        onClick={() => setDeleteConfirmation({ isOpen: true, messageId: message.id })}
                                                                        className="text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                                {/* Delete Confirmation Dialog */}
                                                                <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => !open && setDeleteConfirmation({ isOpen: false, messageId: null })}>
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Delete Message</DialogTitle>
                                                                            <DialogDescription>
                                                                                Are you sure you want to delete this message? This action cannot be undone.
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="flex gap-2 justify-end">
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => setDeleteConfirmation({ isOpen: false, messageId: null })}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                            <Button
                                                                                variant="destructive"
                                                                                onClick={() => deleteConfirmation.messageId && handleDeleteMessage(deleteConfirmation.messageId)}
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </div>
                                                                    </DialogContent>
                                                                </Dialog>
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
    );
};

export default CommunityPage;