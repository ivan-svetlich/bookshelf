import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import friends from "../../../../utils/api/friends";
import { setMessage } from "../../../../store/slices/messageSlice";
import { useAppDispatch } from "../../../../store/hooks/redux";

type RequestResponseProps = {
    show: boolean,
    handleClose: React.MouseEventHandler<HTMLButtonElement>,
    id: string,
    response: string,
    message: string,
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const RequestResponse = ({show, handleClose, id, response, message, setUpdate}: RequestResponseProps) => {
    let dispatch = useAppDispatch();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if(response.toLowerCase() === 'accept'){
          await friends.acceptFriendRequest(id).then(() => {
            setUpdate(true);
            dispatch(setMessage({content: `Friend request accepted!`, variant: 'Success'}));
          })
      }
        else if(response.toLowerCase() === 'decline'){
          setUpdate(true);
          dispatch(setMessage({content: `Friend request declined!`, variant: 'Secondary'}));
        }
      }
      catch {
        dispatch(setMessage({content: `Oops! we couldn't proccess your request. Please try again`, 
        variant: 'Danger'}));
      }
      
      (handleClose as Function)()
    }

    return (
        <Modal show={show} onHide={handleClose} data>
        <Modal.Header closeButton>
          <Modal.Title>{response} friend request</Modal.Title>
        </Modal.Header>
        <form name="add_book" onSubmit={handleSubmit}>
          <Modal.Body>
              {message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              {response}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
};

export default RequestResponse;