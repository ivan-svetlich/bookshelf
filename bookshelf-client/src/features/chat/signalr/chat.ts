import {
  HubConnection,
  HubConnectionBuilder,
  IHttpConnectionOptions,
} from "@microsoft/signalr";
import { URLS } from "../../../appConfig";
import { getCookie } from "../../../services/cookies/cookies";

const SERVER_URL = URLS.BOOKSHELF.CHAT;

const newConnection = () => {
  const options: IHttpConnectionOptions = {
    accessTokenFactory: () => {
      const cookie = getCookie("id_token");
      if (cookie) {
        return cookie;
      }
      return "";
    },
  };

  return new HubConnectionBuilder()
    .withUrl(SERVER_URL, options)
    .withAutomaticReconnect()
    .build();
};

const startConnection = (connection: HubConnection) => {
  connection.onclose((e) => e);
  return connection.start();
};

const disconnect = (connection: HubConnection) => {
  return connection.stop();
};

const chat = {
  newConnection,
  startConnection,
  disconnect,
};

export default chat;
