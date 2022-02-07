import formatDateTime from "../../../utils/helpers/formatDateTime";
import { ChatMessage } from "../types/chatTypes";

export type ChatMessageProps = {
    username: string,
    message: ChatMessage
}

const Message = ({username, message}: ChatMessageProps) => (
    <div className={`msg-container ${username === message.from ? "is-right" : "is-left"}`}>
        <div className={`chat-msg ${username === message.from ? "msg-sent" : "msg-received"}`}>
            <div className='msg-content'>{message.message}</div>
            <div className='msg-timestamp'>
                {formatDateTime(message.createdAt)}
                <span className={message.read ? `read-mark` : ''}>
                    {username === message.from && ' ✓'}
                </span>
            </div>
        </div>
    </div>
);

export default Message;