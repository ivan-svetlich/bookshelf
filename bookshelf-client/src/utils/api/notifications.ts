import { URLS } from "../../appConfig";
import { getCookie } from "../../services/cookies/cookies";
import axiosInstance from "./axiosConfig/axiosConfig";

const NOTIFICATIONS = URLS.BOOKSHELF.NOTIFICATIONS;

const getNotifications = () => {
  return axiosInstance.get(NOTIFICATIONS, {
    headers: { Authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const markAllAsRead = () => {
  return axiosInstance.put(
    NOTIFICATIONS,
    {},
    { headers: { Authorization: `Bearer ${getCookie("id_token")}` } }
  );
};

const notifiactions = {
  getNotifications,
  markAllAsRead,
};

export default notifiactions;
