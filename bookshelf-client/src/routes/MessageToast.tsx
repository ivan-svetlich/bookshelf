import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import { useAppDispatch } from '../store/hooks/redux';
import { clearMessage, Message } from '../store/slices/messageSlice';

const MessageToast = ({content, variant}: Message) => {
    const [show, setShow] = useState(true);
    let dispatch = useAppDispatch();
    let date = new Date()

    const handleClose = () => {
        dispatch(clearMessage());
        setShow(!show);
    }
    return(
        <Toast show={show} onClose={handleClose} bg={variant!.toLowerCase()}>
            <Toast.Header>
                <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
                />
                <strong className="me-auto"><i className={variant === 'Danger' ? 'fas fa-exclamation' : 'fas fa-check'}></i></strong>
                <small>{date.toDateString()}</small>
            </Toast.Header>
            <Toast.Body className="text-white">{content}</Toast.Body>
        </Toast>
    );
};

export default MessageToast;