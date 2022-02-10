import "../../styles/pendingRequestsStyles.css";
import FriendsNav from "../FriendsNav";
import RequestCard from "./RequestCard";
import { useFetchFriendList } from "../../hooks/useFetchFriendList";
import SubHeader from "../../../header/components/SubHeader";
import Loading from "../../../loading/Loading";

const PendingRequests = () => {
  const [friendListState, setUpdate] = useFetchFriendList("pending");

  return (
    <div>
      <SubHeader
        title="Pending requests"
        childComp={() => FriendsNav("pending")}
        icon="fas fa-user-clock"
      ></SubHeader>
      <div id="requests-page">
        {friendListState.loading && <Loading />}
        {friendListState.error}
        {!friendListState.loading &&
        friendListState.data &&
        friendListState.data.length > 0
          ? friendListState.data.map((friend) => (
              <RequestCard friend={friend} setUpdate={setUpdate} />
            ))
          : "No pending requests"}
      </div>
    </div>
  );
};

export default PendingRequests;
