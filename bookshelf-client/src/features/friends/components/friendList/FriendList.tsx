import '../../styles/friendListStyles.css';
import FriendsNav from "../FriendsNav";
import FriendCard from "./FriendCard";
import SubHeader from '../../../header/components/SubHeader';
import Loading from '../../../loading/Loading';
import { useFetchFriendList } from '../../hooks/useFetchFriendList';

const FriendsList = () => {
    let [friendListState, setUpdate] = useFetchFriendList('accepted');

    return (
        <div>
            <SubHeader title="Friend list" childComp={() => FriendsNav('list')} icon='fas fa-user-friends'></SubHeader>
            <div id="friends-page">
                {friendListState.loading && <Loading />}
                {!friendListState.loading && friendListState.data &&
                (friendListState.data.length > 0 ?
                    friendListState.data.map(friend => (<FriendCard friend={friend} setUpdate={setUpdate} />))
                :   "Your friend list is empty")}
            </div>
        </div>
    );
};

export default FriendsList;