import { HubConnection } from "@microsoft/signalr/dist/esm/HubConnection";
import { useEffect, useRef, useState } from "react";
import { ChatMessage, Contact } from "../types/chatTypes";
import chatService from "../signalr/chat";

export type ContactListState = {
  users: Contact[];
  loading: boolean;
};

const useChatHub = (username: string | undefined) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [contactList, setContactList] = useState<ContactListState>({
    users: [],
    loading: true,
  });
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(
    null
  );
  const [connected, setConnected] = useState(false);
  const latestChat = useRef<ChatMessage[]>(chat);
  const latestFriendList = useRef<Contact[]>(contactList.users);
  const selectedUserRef = useRef<string>("");
  const [alertMessage, setAlertMessage] = useState<Alert>({
    show: false,
    content: "",
  });

  latestChat.current = chat;
  latestFriendList.current = contactList.users;

  useEffect(() => {
    let connection = chatService.newConnection();
    if (connection) {
      chatService.startConnection(connection).then(() => {
        setConnected(true);
        setHubConnection(connection);
      });
    }
  }, []);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("ReceiveMessage", (message) => {
        if (
          message.from === selectedUserRef.current ||
          message.to === selectedUserRef.current
        ) {
          const updatedChat = [...latestChat.current];
          updatedChat.push(message);
          setChat(updatedChat);
          if (message.from === selectedUserRef.current) {
            hubConnection.send("MarkAsRead", selectedUserRef);
          }
        } else {
          const updatedFriendList = [...latestFriendList.current];
          const result = updatedFriendList.map((x) => {
            if (x.username === message.from) {
              var updated = x;
              updated.newMessages = x.newMessages + 1;

              return updated;
            }
            return x;
          });
          setContactList({ users: result, loading: false });
        }
      });
    }
  }, [connected, hubConnection]);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("ReceiveContactList", (contactList) => {
        setContactList({ users: [...contactList], loading: false });
      });
    }
  }, [connected, hubConnection]);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("ReceiveOnlineStatusNotification", (contact) => {
        latestChat.current.forEach((msg) => {
          if (msg.from === username) {
            msg.read = true;
          }
          return msg;
        });
        setChat([...latestChat.current]);
      });
    }
  }, [connected, hubConnection, username]);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("ReceiveConnectionUpdates", (connectionUpdate) => {
        //let newClient = true;
        const updatedFriendList = [...latestFriendList.current];
        const result = updatedFriendList.map((x) => {
          if (x.username === connectionUpdate.username) {
            //newClient = false;
            return connectionUpdate;
          } else {
            return x;
          }
        });
        setContactList({ users: [...result], loading: false });
      });
    }
  }, [connected, hubConnection]);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("GetMessages", (messages) => {
        const updatedChat: ChatMessage[] = [];
        (messages as ChatMessage[]).forEach((message: ChatMessage) => {
          updatedChat.push(message);
        });
        setChat(updatedChat);
      });
    }
  }, [connected, hubConnection]);

  useEffect(() => {
    if (connected && hubConnection) {
      hubConnection.on("Alert", (message) => {
        setConnected(false);
        handleShowAlert(message);
      });
    }
  }, [connected, hubConnection]);

  const sendMessage = async (to: string, message: string) => {
    const chatMessage = {
      from: username ? username : "",
      to: to,
      message: message,
    };

    if (
      hubConnection &&
      hubConnection.state.valueOf().toUpperCase() === "CONNECTED"
    ) {
      try {
        await hubConnection.send("SendMessage", chatMessage);
      } catch (e) {}
    } else {
      alert("No connection to server yet.");
    }
  };

  const handleSelectUser = async (username: string) => {
    if (hubConnection && connected) {
      try {
        setSelectedUser(username);
        selectedUserRef.current = username;
        setChat([]);
        await hubConnection.send("OpenChat", username);
        const updatedFriendList = [...latestFriendList.current];
        var updatedUsers = updatedFriendList.map((user) => {
          if (user.username === username) {
            return { ...user, newMessages: 0 };
          } else {
            return user;
          }
        });
        setContactList({ ...contactList, users: [...updatedUsers] });
      } catch (e) {}
    } else {
      alert("No connection to server yet.");
    }
    setSelectedUser(username);
  };

  const deleteMessages = (username: string) => {
    if (hubConnection) {
      setChat([]);
      hubConnection.send("DeleteMessages", username);
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage({ show: false, content: "" });
  };

  const handleShowAlert = (message: string) => {
    setAlertMessage({ show: true, content: message });
  };

  return {
    connected,
    chat,
    selectedUser,
    contactList,
    sendMessage,
    handleSelectUser,
    deleteMessages,
    alertMessage,
    handleCloseAlert,
  };
};

export type Alert = {
  show: boolean;
  content: string;
};

export default useChatHub;
