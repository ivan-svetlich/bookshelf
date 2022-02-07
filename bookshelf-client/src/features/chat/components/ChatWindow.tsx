import React, { useState } from 'react';
import { useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/esm/Modal';
import { useAppSelector } from '../../../store/hooks/redux';
import { LoginState } from '../../../store/slices/loginSlice';
import { ChatMessage } from '../types/chatTypes';
import Message from './Message';

type ChatWindowProps = {
    chat: ChatMessage[],
    selectedUser: string,
    deleteMessages: Function
}

const ChatWindow = ({chat, selectedUser, deleteMessages}: ChatWindowProps) => {
    const user: LoginState['user'] = useAppSelector(state => state.login.user);
    const [show, setShow] = useState(false);
    const messagesEndRef = React.createRef<HTMLDivElement>();
    const [scrollEnd, setScrollEnd] = useState(true);
    const [messageCount, setMessageCount] = useState(chat.length);
    const [newMessage, setNewMessage] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelete = () => {
        deleteMessages(selectedUser);
        handleClose();
    };
    useEffect(() => {
      if(messagesEndRef && scrollEnd) {
        scrollToBottom(messagesEndRef.current);
      }
    }, [messagesEndRef, scrollEnd])

    useEffect(() => {
      if(chat.length !== messageCount) {
        if(!scrollEnd && chat.length > 0 && chat[chat.length - 1].to === user?.username) {
          setNewMessage(prev => prev + 1);
        }
        setMessageCount(chat.length);
      }
    }, [chat, chat.length, messageCount, scrollEnd, user?.username])

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      var target = e.currentTarget;
      if(target.scrollHeight - target.scrollTop === target.clientHeight) {
        setScrollEnd(true);
      }
      else {
        setScrollEnd(false);
      }
    }

    const scrollToBottom = (lastMessageDiv: HTMLDivElement | null) => {
      if(lastMessageDiv) {
        setNewMessage(0);
        lastMessageDiv.scrollIntoView({ behavior: 'smooth' })
      }
    }

    useEffect(() => {
      
    })

    return(
        <>{selectedUser && 
        <div className='content-is-left msg-window-header'>
            <div>{selectedUser}</div>
            <div className='delete-div'>
                <Button variant="success" className="delete-btn" onClick={handleShow}>Delete chat</Button>
            </div>
        </div>}
        <div className="msg-window" onScroll={(e) => handleScroll(e)}>
            {selectedUser && chat.map(m => 
              ((m.from === user?.username && !m.deletedBySender) || (m.to === user?.username && !m.deletedByReceiver)) && 
              <Message username={user.username} message={m} />
            )}
            <div ref={messagesEndRef}></div>
        </div>
        <div className='new-msg-container'>
          {newMessage > 0 && <button className='new-msg-btn' onClick={() => scrollToBottom(messagesEndRef.current)}>
            {newMessage === 1 && 'New message'}
            {newMessage > 1 && `${newMessage} New messages`} <i className='fas fa-chevron-down' />
          </button>}
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete chat messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete all messages between you and {selectedUser}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
        </>
    )
};

export default ChatWindow;