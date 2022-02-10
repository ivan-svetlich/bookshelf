export interface IUser {
  id: string;
  username: string;
  email: string;
  gender: string | null;
  birthday: Date | null;
  location: string | null;
  profilePicture: string | null;
  isAdmin: boolean;
}

export default class User implements IUser {
  id: string;
  username: string;
  email: string;
  gender: string | null;
  birthday: Date | null;
  location: string | null;
  profilePicture: string | null;
  isAdmin: boolean;

  constructor(
    _id: string,
    _username: string,
    _email: string,
    _gender: string | null,
    _birthday: Date | null,
    _location: string | null,
    _profilePicture: string | null,
    _isAdmin: boolean
  ) {
    this.id = _id;
    this.username = _username;
    this.email = _email;
    this.gender = _gender;
    this.birthday = _birthday;
    this.location = _location;
    this.profilePicture = _profilePicture;
    this.isAdmin = _isAdmin;
  }
}
