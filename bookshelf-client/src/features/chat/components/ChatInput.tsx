import React, { useState } from 'react';
import Button from 'react-bootstrap/esm/Button';

type ChatInputProps = {
    sendMessage: Function,
    user: string
}
const ChatInput = ({sendMessage, user}: ChatInputProps) => {
    const [message, setMessage] = useState('');

    const isUserProvided = user && user !== '';
    const isMessageProvided = message && message !== '';

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isUserProvided && isMessageProvided) {
            sendMessage(user, message);
            setMessage('');
        } 
        else {
            alert('Please insert an user and a message.');
        }
    }

    const onMessageUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }

    return (
        <div className='chat-input-container'>
            <form 
                onSubmit={onSubmit}>
                <div className='chat-input'>
                    <input 
                        type="text"
                        id="message"
                        name="message" 
                        value={message}
                        onChange={onMessageUpdate} 
                        className="send-msg-input"
                        disabled={!isUserProvided}/>
                    <br/><br/>
                    <Button className="send-msg-button" type="submit" disabled={!(isUserProvided && isMessageProvided)}>
                        <i className="fas fa-paper-plane"/>
                    </Button>
                </div>
            </form>
        </div>
    )
};

export default ChatInput;