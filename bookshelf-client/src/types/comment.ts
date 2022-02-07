export default interface IComment{
    id: number,
    submitterUsername: string,
    submitterPicture: string,
    profileId: string,
    createdAt: Date,
    body: string,
}