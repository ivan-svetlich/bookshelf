import SubHeader from "../../header/components/SubHeader";
import FriendsNav from "./FriendsNav";

const FriendsPage = () => {
    return (
        <SubHeader title="My friends" childComp={() => FriendsNav('list')}></SubHeader>
    );
};

export default FriendsPage;