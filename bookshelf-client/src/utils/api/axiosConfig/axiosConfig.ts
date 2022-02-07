import axios from "axios";
import { LOGOUT } from "../../../store/slices/loginSlice";
import { setMessage } from "../../../store/slices/messageSlice";
import { store } from "../../../store/store";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(LOGOUT()); 
      store.dispatch(setMessage({content: "Authentication token expired. Please log in to continue", variant: "Warning"}))
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

