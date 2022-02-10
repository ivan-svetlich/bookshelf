import "./mainStyles.css";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks/redux";
import useQuery from "../utils/hooks/useQuery";
import { setMessage } from "../store/slices/messageSlice";
import SearchPage from "../features/search/components/SearchPage";
import ItemPage from "../features/itemDetails/components/ItemPage";
import PrivateRoute from "./PrivateRoute";
import ListPage from "../features/booklist/components/ListPage";
import PurchasedBooksPage from "../features/purchasedBooks/components/PurchasedBooksPage";
import ProfilePage from "../features/profile/components/ProfilePage";
import ProfileInfoPage from "../features/profile/components/profileSettings/ProfileInfo";
import ProfilePicturePage from "../features/profile/components/profileSettings/ProfilePicture";
import FriendList from "../features/friends/components/friendList/FriendList";
import PendingRequests from "../features/friends/components/pendingRequests/PendingRequests";
import AddFriend from "../features/friends/components/addFriend/AddFriend";
import ChatPage from "../features/chat/components/ChatPage";
import HomePage from "../features/home/components/HomePage";
import LoginPage from "../features/authManagement/login/components/LoginPage";
import SignupPage from "../features/authManagement/signup/components/SignupPage";
import EmailConfirmationPage from "../features/authManagement/signup/components/emailConfimation/EmailConfirmationPage";
import LoggedOutRoute from "./LoggedOutRoute";

const Main = () => {
  const dispatch = useAppDispatch();
  const query = useQuery();
  const buyStatus = query.get("buy_status");

  if (buyStatus) {
    switch (buyStatus) {
      case "success":
        dispatch(
          setMessage({
            content:
              "Done! Your payment was credited. Thank you for your order!",
            variant: "Success",
          })
        );
        break;
      case "pending":
        dispatch(
          setMessage({
            content: "We are processing your payment.",
            variant: "Warning",
          })
        );
        break;
      case "failure":
        dispatch(
          setMessage({
            content: "Sorry! Your payment couldn't be processed.",
            variant: "Danger",
          })
        );
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <Routes>
        <Route path="/search" element={<SearchPage />} />
        <Route path="/book/:id" element={<ItemPage />} />
        <Route
          path="/list/:username"
          element={
            <PrivateRoute>
              <ListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my_purchases"
          element={
            <PrivateRoute>
              <PurchasedBooksPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/info"
          element={
            <PrivateRoute>
              <ProfileInfoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/picture"
          element={
            <PrivateRoute>
              <ProfilePicturePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/friends/list"
          element={
            <PrivateRoute>
              <FriendList />
            </PrivateRoute>
          }
        />
        <Route
          path="/friends/pending"
          element={
            <PrivateRoute>
              <PendingRequests />
            </PrivateRoute>
          }
        />
        <Route
          path="/friends/add"
          element={
            <PrivateRoute>
              <AddFriend />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <LoggedOutRoute>
              <LoginPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <LoggedOutRoute>
              <SignupPage />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/confirm"
          element={
            <LoggedOutRoute>
              <EmailConfirmationPage />
            </LoggedOutRoute>
          }
        />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  );
};

function NoMatch() {
  let location = useLocation();

  return (
    <div>
      <br />
      <h4>
        No match for <code>{location.pathname}</code>
      </h4>
      <a href="/home">Go to Home Page</a>
    </div>
  );
}

export default Main;
