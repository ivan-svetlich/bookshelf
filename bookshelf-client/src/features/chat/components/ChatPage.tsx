import "../styles/chatStyles.css";
import ChatInput from "./ChatInput";
import ChatWindow from "./ChatWindow";
import ContactList from "./ContactList";
import AlertModal from "./AlertModal";
import { LoginState } from "../../../store/slices/loginSlice";
import { useAppSelector } from "../../../store/hooks/redux";
import useChatHub from "../hooks/useChatHub";
import SubHeader from "../../header/components/SubHeader";

const ChatPage = () => {
    const user: LoginState['user'] = useAppSelector(state => state.login.user);

    const {
        connected,
        chat,
        selectedUser,
        contactList,
        sendMessage,
        handleSelectUser,
        deleteMessages,
        alertMessage,
        handleCloseAlert
    } = useChatHub(user?.username);

    return (
        <div>
            <SubHeader title={`Chat`} icon='fas fa-comments'></SubHeader>
            <div id="chat-page">
                <div className='contact-list'><ContactList contactList={contactList} 
                        selectedUser={selectedUser} setSelectedUser={handleSelectUser} />
                </div>
                <div className="chat-window">
                    <ChatWindow chat={chat} selectedUser={selectedUser} deleteMessages={deleteMessages}/>
                    {connected && <ChatInput sendMessage={sendMessage} user={selectedUser} />}
                </div>
            </div>
            <AlertModal show={alertMessage.show} message={alertMessage.content} 
                handleClose={handleCloseAlert} />
        </div>
    );
};

export default ChatPage;