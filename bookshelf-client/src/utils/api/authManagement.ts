import axios from "axios";
import { URLS } from "../../appConfig";
import { getCookie, setCookie } from "../../services/cookies/cookies";
import User from "../../types/user";

const AUTH_MANAGEMENT = URLS.BOOKSHELF.AUTH;

//SIGN UP
export interface SignupArgs {
  username: string, 
  email: string, 
  password: string,
  captchaToken: string
}

const signup = (args: SignupArgs) => {
  return axios.post<User>(AUTH_MANAGEMENT + "signup", args);
};

//CONFIRM EMAIL
export interface ConfirmEmailArgs {
  id: string,
  token: string
}
const confirmEmail = async ({id, token}: ConfirmEmailArgs) => {

  return await axios.get(AUTH_MANAGEMENT + `confirm?id=${id}&token=${token}`);

};

//SIGN IN
export interface LoginArgs {
  email: string, 
  password: string,
}

const login = (args: LoginArgs) => {
  return axios
    .post(AUTH_MANAGEMENT + "login", args)
    .then((response) => {
      if (response.data.token) {
        setCookie({name: 'id_token', value: response.data.token, days: 7});
      }
      return response.data;
    });
};

const logout = async () => {
  return axios.post(AUTH_MANAGEMENT + "logout", {}, { headers: {"Authorization" : `Bearer ${getCookie('id_token')}`} })
};

const authManagement = {
  signup,
  confirmEmail,
  login,
  logout,
};

export default authManagement;
