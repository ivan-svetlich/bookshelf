import { AnyAction, combineReducers } from "redux";
import bookListReducer from "./slices/bookListSlice";
import loginReducer from "./slices/loginSlice";
import messageReducer from "./slices/messageSlice";
import { RootState } from "./store";
import { Reducer } from "react";
import purchasedBooksReducer from "./slices/purchasedBooksSlice";
import { eraseCookie } from "../services/cookies/cookies";

const rootReducer = combineReducers({
  bookList: bookListReducer,
  purchasedBooks: purchasedBooksReducer,
  login: loginReducer,
  messages: messageReducer,
});

const appReducer: Reducer<any, any> = (state: RootState, action: AnyAction) => {
  if (action.type === "LOGOUT") {
    eraseCookie("id_token");

    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export default appReducer;
