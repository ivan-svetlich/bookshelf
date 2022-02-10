import { useState } from "react";
import { Friend } from "../../../../types/friend";
import RequestResponse from "./RequestResponse";

type FriendCardProps = {
  friend: Friend;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const RequestCard = ({ friend, setUpdate }: FriendCardProps) => {
  const [action, setAction] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (response: string) => {
    if (response.toLowerCase() === "accept") {
      setAction("Accept");
    }
    if (response.toLowerCase() === "decline") {
      setAction("Decline");
    }
    setShow(true);
  };
  return (
    <div className="card flex-row flex-wrap friend-card">
      <div className="card-header border-0 friend-image-container">
        <img
          src={
            friend.profilePicture
              ? `data:image/jpg;base64,${friend.profilePicture}`
              : "/default_profile_picture.png"
          }
          alt={friend.username}
          className="friend-image"
        />
      </div>
      <div className="request-info">
        <div className="">
          <a href={`/profile/${friend.username}`}>
            <h5>
              <b>{friend.username}</b>
            </h5>
          </a>
        </div>
        <div className="">
          <p>
            Request sent on{" "}
            {friend.createdAt
              ? getFormattedDateTime(friend.createdAt)
              : "-/-/-"}
          </p>
        </div>
        <div className="request-links">
          <ul>
            <li>
              <button
                className="btn btn-link shadow-none"
                onClick={() => handleShow("accept")}
              >
                Accept
              </button>
            </li>
            <li>
              <button
                className="btn btn-link shadow-none"
                onClick={() => handleShow("decline")}
              >
                Decline
              </button>
            </li>
          </ul>
        </div>
      </div>
      <RequestResponse
        show={show}
        handleClose={handleClose}
        id={friend.id}
        message={`${action} friend request from ${friend.username}?`}
        response={action}
        setUpdate={setUpdate}
      />
    </div>
  );
};

function getFormattedDateTime(datetime: Date) {
  return new Date(datetime).toLocaleString().split("GMT")[0];
}

export default RequestCard;
