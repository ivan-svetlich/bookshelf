import React, { useEffect } from "react";
import "../styles/signupStyles.css";
import SignupForm from "./SignupForm";
import { useNavigate } from "react-router-dom";
import { LoginState } from "../../../../store/slices/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { useSignup } from "../hooks/useSignup";
import SubHeader from "../../../header/components/SubHeader";
import Loading from "../../../loading/Loading";
import { setMessage } from "../../../../store/slices/messageSlice";

const SignupPage = () => {
  const isLoggedIn: LoginState["isLoggedIn"] = useAppSelector(
    (state) => state.login.isLoggedIn
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signupState, signup] = useSignup();

  useEffect(() => {
    if (isLoggedIn) {
      navigate(-1);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (signupState.data) {
      dispatch(
        setMessage({
          content: `A confirmation email has been sent to ${signupState.data.email}`,
          variant: "Success",
        })
      );
    }
  });

  return (
    <div>
      <SubHeader title="Sign up" icon="fas fa-id-card"></SubHeader>
      {(signupState.loading || isLoggedIn) && (
        <div id="loading-container">
          <Loading />
        </div>
      )}
      {!(signupState.loading || signupState.data || isLoggedIn) && (
        <div id="signup-page">
          <div id="signup-form-container">
            <SignupForm signup={signup} />
          </div>
        </div>
      )}
      {signupState.data && (
        <div>
          <a href="/login">Go to login page</a>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
