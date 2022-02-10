import { useEffect, useReducer, useState } from "react";
import { useAppSelector } from "../../store/hooks/redux";
import { LoginState } from "../../store/slices/loginSlice";
import { INotification } from "../../types/notification";
import notifiactions from "../api/notifications";

export type NotificationState = {
  loading: boolean;
  data: INotification[];
  error: string | null;
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: INotification[] }
  | { type: "FAILURE"; payload: string };

const initialState: NotificationState = {
  loading: false,
  data: [],
  error: null,
};

function fetchNotificationsReducer<NotificationState>(
  state: NotificationState,
  action: ACTION
) {
  const { type, payload } = action;

  switch (type) {
    case "LOAD":
      return { ...state, loading: true, data: null, error: null };
    case "SUCCESS":
      return { ...state, loading: false, data: payload, error: null };
    case "FAILURE":
      return { ...state, loading: false, data: null, error: payload };
    default:
      return state;
  }
}

type UseFetchNotificationsReturnArgs = [
  NotificationState,
  React.Dispatch<React.SetStateAction<boolean>>
];

export const useFetchNotifications = (): UseFetchNotificationsReturnArgs => {
  const [state, dispatch] = useReducer(fetchNotificationsReducer, initialState);
  const isLoggedIn: LoginState["isLoggedIn"] = useAppSelector(
    (state) => state.login.isLoggedIn
  );
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (update && isLoggedIn) {
      fetchNotifications(dispatch);
      setUpdate(false);
    }
    return () => {};
  }, [update, setUpdate, isLoggedIn]);

  return [state as NotificationState, setUpdate];
};

async function fetchNotifications(dispatch: React.Dispatch<ACTION>) {
  dispatch({ type: "LOAD", payload: null });
  try {
    const response = await notifiactions.getNotifications();
    dispatch({ type: "SUCCESS", payload: response.data });
  } catch (error: any) {
    dispatch({ type: "FAILURE", payload: error.response.data });
  }
}
