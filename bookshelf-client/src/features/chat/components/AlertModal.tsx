import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { useNavigate } from "react-router-dom";

type AlertProps = {
  show: boolean;
  message: string;
  handleClose: Function;
};
const AlertModal = ({ show, message, handleClose }: AlertProps) => {
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleBackHome = () => {
    navigate("/home");
  };

  return (
    <>
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>
            <i className="fas fa-comment-slash" /> Disconnected
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleBackHome()}>
            Back Home
          </Button>
          <Button variant="primary" onClick={() => handleReload()}>
            <i className="fas fa-redo" /> Reconnect
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AlertModal;
