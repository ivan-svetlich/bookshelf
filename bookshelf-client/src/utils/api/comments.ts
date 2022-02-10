import { getCookie } from "../../services/cookies/cookies";
import axiosInstance from "./axiosConfig/axiosConfig";
import { URLS } from "../../appConfig";

const COMMENTS = URLS.BOOKSHELF.COMMENTS;

const getProfileComments = (username: string) => {
  return axiosInstance.get(COMMENTS + `${username}`, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const submitComment = (username: string, body: string) => {
  return axiosInstance.post(
    COMMENTS + `${username}`,
    { body },
    { headers: { Authorization: `Bearer ${getCookie("id_token")}` } }
  );
};
export { getProfileComments, submitComment };
