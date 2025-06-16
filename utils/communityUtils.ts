export const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export const sanitizeUsername = (username: string): string => {
    return username.toLowerCase().replace(/[^a-z0-9_]/g, '')
}

export const getInitials = (name: string | null): string => {
    return name?.[0]?.toUpperCase() || 'U'
}

export const isToday = (dateString: string): boolean => {
    return new Date(dateString).toDateString() === new Date().toDateString()
}