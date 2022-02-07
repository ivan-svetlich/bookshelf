import User from '../../types/user';

interface LoginResponse {
    id: string;
    username: string;
    email: string;
    gender: string | null;
    birthday: Date | null;
    location: string | null;
    profilePicture: string | null;
    token: string,
    isAdmin: boolean,
    success: boolean
}

function BookshelfResponseToEntity(loginResponse: LoginResponse) {
    const user: User = {
        id: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        gender: loginResponse.gender,
        birthday: loginResponse.birthday,
        location: loginResponse.location,
        profilePicture: loginResponse.profilePicture,   
        isAdmin: loginResponse.isAdmin,
    };

    return user;
}

export default BookshelfResponseToEntity;