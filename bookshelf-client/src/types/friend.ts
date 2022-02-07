export interface Friend {
    id: string,
    username: string,
    profilePicture: string | null,
    createdAt: Date | null,
    accepted: boolean
}
