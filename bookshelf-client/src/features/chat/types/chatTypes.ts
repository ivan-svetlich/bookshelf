export interface ChatNotification {
    from: string,
    to: string,
    message: string,
    createdAt: Date
}

export interface ChatMessage {
    from: string,
    to: string,
    message: string,
    createdAt: Date,
    read: boolean
    deletedBySender: boolean,
    deletedByReceiver: boolean
}

export interface Contact {
    id: string,
    username: string,
    connected: boolean,
    newMessages: number
}