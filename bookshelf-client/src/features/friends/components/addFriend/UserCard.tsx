import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { Profile } from "../../../../types/profile";
import SendRequest from "./SendRequest";

type FriendCardProps = {
  user: Profile;
  friendRequestSent: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const FriendCard = ({
  user,
  friendRequestSent,
  setUpdate,
}: FriendCardProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="card flex-row flex-wrap user-card">
      <div className="card-header border-0 user-image-container">
        <img
          src={
            user.profilePicture
              ? `data:image/jpg;base64,${user.profilePicture}`
              : "/default_profile_picture.png"
          }
          alt={user.username}
          className="user-image"
        />
      </div>
      <div className="user-info">
        <div className="line-clamp-1">
          <a href={`/profile/${user.username}`}>
            <h5>
              <b>{user.username}</b>
            </h5>
          </a>
        </div>
        <div className="line-clamp-1">Gender: {user.gender}</div>
        <div className="line-clamp-1">
          Birthday:{" "}
          {user.birthday ? user.birthday.toString().split("T")[0] : "-/-/-"}
        </div>
        <div className="line-clamp-1">Location: {user.location}</div>
        <div className="send-button-container line-clamp-1">
          <Button
            variant="dark"
            className="send-button"
            onClick={handleShow}
            disabled={friendRequestSent ? true : false}
          >
            Send request
          </Button>
        </div>
      </div>
      <SendRequest
        show={show}
        handleClose={handleClose}
        username={user.username}
        setUpdate={setUpdate}
      />
    </div>
  );
};

export default FriendCard;
