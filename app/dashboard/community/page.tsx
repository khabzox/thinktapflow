"use client"

import { useCommunity } from '@/hooks/use-community'
import { LoadingScreen } from '@/components/dashboard/community/LoadingScreen'
import { ProfileIncompleteScreen } from '@/components/dashboard/community/ProfileIncompleteScreen'
import { CommunityMain } from '@/components/dashboard/community/CommunityMain'

export default function CommunityPage() {
    const {
        // State
        messages,
        onlineUsers,
        newMessage,
        setNewMessage,
        userProfile,
        showProfileModal,
        setShowProfileModal,
        checkingProfile,
        messagesLoading,
        sending,
        currentUserId,

        // Actions
        handleSendMessage,
        handleCompleteProfile,
        handleEditMessage,
        handleDeleteMessage,
        redirectToSettings,
        isProfileComplete
    } = useCommunity()

    if (checkingProfile) {
        return <LoadingScreen />
    }

    if (!userProfile || !isProfileComplete(userProfile)) {
        return (
            <ProfileIncompleteScreen
                userProfile={userProfile}
                showProfileModal={showProfileModal}
                setShowProfileModal={setShowProfileModal}
                onCompleteProfile={handleCompleteProfile}
                onRedirectToSettings={redirectToSettings}
            />
        )
    }

    return (
        <CommunityMain
            messages={messages}
            onlineUsers={onlineUsers}
            messagesLoading={messagesLoading}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            sending={sending}
            currentUserId={currentUserId}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
        />
    )
}