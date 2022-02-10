import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { setMessage } from "../../../../store/slices/messageSlice";
import { useAppDispatch } from "../../../../store/hooks/redux";
import friends from "../../../../utils/api/friends";

type RemoveFriendProps = {
  show: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  id: string;
  username: string;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const RemoveFriend = ({
  show,
  handleClose,
  id,
  username,
  setUpdate,
}: RemoveFriendProps) => {
  let dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await friends.removeFriend(id).then(() => {
        setUpdate(true);
        dispatch(
          setMessage({
            content: `${username} was removed from your friendList`,
            variant: "Success",
          })
        );
      });
    } catch {
      dispatch(
        setMessage({
          content: `Oops! we couldn't remove ${username} from your friendList. Please try again`,
          variant: "Danger",
        })
      );
    }
    (handleClose as Function)();
  };

  return (
    <Modal show={show} onHide={handleClose} data>
      <Modal.Header closeButton>
        <Modal.Title>Remove friend</Modal.Title>
      </Modal.Header>
      <form name="add_book" onSubmit={handleSubmit}>
        <Modal.Body>
          Are you sure you want to remove {username} from your friend list?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Remove
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default RemoveFriend;
