export interface Profile {
    username: string,
    gender: string | null,
    birthday: Date | null,
    location: string | null,
    profilePicture: string | null,
    isFriend: boolean,
    friendRequestSent: boolean,
    lastOnline: Date
}

export default class UserProfile implements Profile {
    username: string;
    gender: string | null;
    birthday: Date | null;
    location: string | null;
    profilePicture: string | null;
    isFriend: boolean;
    friendRequestSent: boolean;
    lastOnline: Date;

    constructor(_id: string,
        _username: string,
        _gender: string | null,
        _birthday: Date | null,
        _location: string | null,
        _profilePicture: string | null,
        _isFriend: boolean,
        _friendRequestSent: boolean,
        _lastOnline: Date) {

        this.username = _username;
        this.gender = _gender;
        this.birthday = _birthday;
        this.location = _location;
        this.profilePicture = _profilePicture;
        this.isFriend = _isFriend;
        this.friendRequestSent = _friendRequestSent;
        this.lastOnline = _lastOnline;
        }
}