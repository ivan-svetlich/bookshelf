import { URLS } from "../../appConfig";
import { getCookie } from "../../services/cookies/cookies";
import axiosInstance from "./axiosConfig/axiosConfig";

const FRIENDS = URLS.BOOKSHELF.FRIENDS;

const getFriendList = (filter: string) => {
  return axiosInstance.get(FRIENDS + `FriendRequests?filter=${filter}`, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const sendFriendRequest = (username: string) => {
  const body = {};
  return axiosInstance.post(FRIENDS + `Request?username=${username}`, body, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const acceptFriendRequest = (id: string) => {
  const body = {};
  return axiosInstance.post(FRIENDS + `Accept?id=${id}`, body, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const declineFriendRequest = (id: string) => {
  const body = {};
  return axiosInstance.post(FRIENDS + `Decline?id=${id}`, body, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const removeFriend = (id: string) => {
  return axiosInstance.delete(FRIENDS + `Remove?id=${id}`, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const friends = {
  getFriendList,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
};

export default friends;
