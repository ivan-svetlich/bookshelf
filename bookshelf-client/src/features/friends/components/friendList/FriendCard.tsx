import { useState } from "react";
import { Friend } from "../../../../types/friend";
import RemoveFriend from "./RemoveFriend";

type FriendCardProps = {
    friend: Friend,
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

const FriendCard = ({friend, setUpdate}: FriendCardProps) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className="card flex-row flex-wrap friend-card">
            <div className="card-header border-0 friend-image-container">
                <img src={friend.profilePicture ? 
                    `data:image/jpg;base64,${friend.profilePicture}` 
                    : '/default_profile_picture.png'} alt={friend.username} className="friend-image"/>
            </div>
            <div className="friend-info">     
                <div className="line-clamp-1"><a href={`/profile/${friend.username}`}><h5><b>{friend.username}</b></h5></a></div>
                <div className="line-clamp-1"><p>Friends since: {friend.createdAt ? friend.createdAt.toString().split('T')[0] : '-/-/-'}</p></div>
                <div className="remove-link line-clamp-1">
                    <button className="btn btn-link shadow-none" onClick={handleShow}>Remove friend</button>
                </div> 
            </div>
            <RemoveFriend 
                show={show} 
                handleClose={handleClose} 
                username={friend.username}
                id={friend.id} 
                setUpdate={setUpdate}
            />
        </div>
    );
};

export default FriendCard;