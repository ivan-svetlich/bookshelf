import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../../store/hooks/redux";
import { LoginState } from "../../../../../store/slices/loginSlice";
import useConfirmEmail, { VerificationState } from "./hooks/useVerifyEmail";
import SubHeader from "../../../../header/components/SubHeader";
import Loading from "../../../../loading/Loading";

const EmailConfirmationPage = () => {
    const verificationState: VerificationState = useConfirmEmail();
    const isLoggedIn: LoginState['isLoggedIn'] = useAppSelector(state => state.login.isLoggedIn);  
    const navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn){ 
            navigate(-1);
        }
    },[isLoggedIn, navigate]);
    
    return (
        <div>
            <SubHeader title="Email confirmation"></SubHeader>
            {(verificationState.loading || isLoggedIn) && <Loading />}
            {verificationState.success &&
            <a href="/login">Go to login</a>
            }
        </div>
    );
};

export default EmailConfirmationPage;