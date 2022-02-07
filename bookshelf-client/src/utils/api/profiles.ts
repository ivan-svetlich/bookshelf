import { getCookie } from "../../services/cookies/cookies";
import axiosInstance from "./axiosConfig/axiosConfig";
import {URLS} from "../../appConfig";

const PROFILES = URLS.BOOKSHELF.PROFILES;

const getProfileInfo = async (username: string, field?: string) => {
    if(field) {
        return axiosInstance.get(PROFILES + `${username}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
    }
    return axiosInstance.get(PROFILES + `${username}`, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

export interface UpdateProfileArgs {
    gender: string | null, 
    birthday: Date | null, 
    location: string | null,
}
const updateProfileInfo = (fields: UpdateProfileArgs) => {
    return axiosInstance.put(PROFILES + `UpdateInfo`, fields, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const updateProfilePicture = (picture: FormData) => {
    return axiosInstance.put(PROFILES + `UpdatePicture`, picture, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} });
};

const profiles = {
    getProfileInfo,
    updateProfileInfo,
    updateProfilePicture,
};

export default profiles;