import { Profile } from "../../types/profile";



interface ProfileResponse {
    success: boolean,
    username: string,
    gender: string | null,
    birthday: Date | null,
    location: string | null,
    profilePicture: string | null,
    isFriend: boolean,
    friendRequestSent: boolean,
    lastOnline: Date
}

function profileResponseToEntity(profileResponse: ProfileResponse) {
    const userProfile: Profile = {
        username: profileResponse.username,
        gender: profileResponse.gender,
        birthday: profileResponse.birthday,
        location: profileResponse.location,
        profilePicture: profileResponse.profilePicture,
        isFriend: profileResponse.isFriend,
        friendRequestSent: profileResponse.friendRequestSent,
        lastOnline: profileResponse.lastOnline
    };

    return userProfile;
}

export default profileResponseToEntity;