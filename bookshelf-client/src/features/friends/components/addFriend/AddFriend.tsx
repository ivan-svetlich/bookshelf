import "../../styles/addFriendStyles.css";
import { useAppSelector } from "../../../../store/hooks/redux";
import Loading from "../../../loading/Loading";
import UserCard from "./UserCard";
import FriendsNav from "../FriendsNav";
import { LoginState } from "../../../../store/slices/loginSlice";
import useQuery from "../../../../utils/hooks/useQuery";
import { useSearchUser } from "../../hooks/useSearchUser";
import SubHeader from "../../../header/components/SubHeader";
import { Profile } from "../../../../types/profile";
import { useFetchFriendList } from "../../hooks/useFetchFriendList";
import { Friend } from "../../../../types/friend";

const AddFriend = () => {
  const query = useQuery();
  let [profileState, username, setUsername] = useSearchUser(
    query.get("q") ? (query.get("q") as string) : "",
    1000
  );
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);
  const [fiendListState, setUpdate] = useFetchFriendList("all");

  return (
    <div>
      <SubHeader
        title="Add friend"
        childComp={() => FriendsNav("add")}
        icon="fas fa-user-plus"
      ></SubHeader>
      <div id="add-friend-page">
        <div id="search-bar">
          <span id="search-span">Search by username: </span>
          <input
            id="user-search-input"
            type="text"
            placeholder="Search"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div id="add-friend-results">
          {(profileState.loading || fiendListState.loading) && <Loading />}
          {profileState.error && "Could not find user"}
          {!profileState.loading &&
            profileState.data &&
            fiendListState.data && (
              <UserCard
                user={profileState.data}
                setUpdate={setUpdate}
                friendRequestSent={
                  isFriend(profileState.data, fiendListState.data) ||
                  user?.username === profileState.data.username
                }
              />
            )}
        </div>
      </div>
    </div>
  );
};

function isFriend(user: Profile, friendList: Friend[]) {
  const match = friendList.find((friend) => friend.username === user.username);
  return match ? true : false;
}

export default AddFriend;
