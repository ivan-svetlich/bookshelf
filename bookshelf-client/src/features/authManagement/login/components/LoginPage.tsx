import React, { useEffect } from "react";
import "../styles/loginStyles.css";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import useQuery from "../../../../utils/hooks/useQuery";
import { BookListState, fetchBookList } from "../../../../store/slices/bookListSlice";
import { fetchPurchasedBooks, PurchasedBooksState } from "../../../../store/slices/purchasedBooksSlice";
import { LoginState } from "../../../../store/slices/loginSlice";
import SubHeader from "../../../header/components/SubHeader";
import Loading from "../../../loading/Loading";

const LoginPage = () => {

    let dispatch = useAppDispatch();
    let query = useQuery();
    let navigate = useNavigate();
    let bookListState: BookListState = useAppSelector(state => state.bookList);
    let purchasesState: PurchasedBooksState = useAppSelector(state => state.purchasedBooks);
    let loginState: LoginState = useAppSelector(state => state.login);

    useEffect(() => {
        if(loginState.user) {
            dispatch(fetchBookList(loginState.user.username));
            dispatch(fetchPurchasedBooks());
        }
    }, [dispatch, loginState.user])

    useEffect(() => {
        if(loginState.isLoggedIn && bookListState.data && purchasesState.data){ 
            const redirectTo = query.get('redirectTo');
            if(redirectTo) {
                navigate(redirectTo, { replace: true });
            }
            else {
                navigate(-1);
            }
        }
    },[navigate, query, loginState.isLoggedIn, bookListState.data, purchasesState.data])

    let loading = loginState.loading || bookListState.loading || purchasesState.loading;

    return (
        <div>
            <SubHeader title="Login" icon='fas fa-sign-in-alt'></SubHeader>
            <div id="login-page">
                {(loading || loginState.isLoggedIn) && <div id="loading-container"><Loading /></div>}
                {!(loading || loginState.isLoggedIn) &&             
                <div id="login-form-container">
                    <LoginForm /> 
                </div>
                }
            </div>
        </div>
    )
}

export default LoginPage;

