import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useAppDispatch } from "../../../../store/hooks/redux";
import { useSendRequest } from "../../hooks/useSendRequest";
import { setMessage } from "../../../../store/slices/messageSlice";
import Loading from "../../../loading/Loading";

type SendRequestProps = {
  show: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  username: string;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const SendRequest = ({
  show,
  handleClose,
  username,
  setUpdate,
}: SendRequestProps) => {
  let [requestState, sendFriendRequest] = useSendRequest();
  let dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendFriendRequest(username);
  };

  useEffect(() => {
    if (requestState.success) {
      setUpdate(true);
      dispatch(
        setMessage({
          content: `Friend request sent to ${username}`,
          variant: "Success",
        })
      );
      (handleClose as Function)();
    } else if (requestState.error) {
      dispatch(setMessage({ content: requestState.error, variant: "Danger" }));
    }
  }, [
    dispatch,
    handleClose,
    requestState.error,
    requestState.success,
    setUpdate,
    username,
  ]);

  return (
    <Modal show={show} onHide={handleClose} data>
      <Modal.Header closeButton>
        <Modal.Title>Remove friend</Modal.Title>
      </Modal.Header>
      <form name="add_book" onSubmit={handleSubmit}>
        <Modal.Body>
          {requestState.loading && (
            <div className="content-is-centered">
              <Loading />
            </div>
          )}
          {!requestState.loading &&
            `Do you want to send a friend request to ${username}?`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={
              requestState.loading ||
              requestState.success ||
              !!requestState.error
            }
          >
            Send
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default SendRequest;
