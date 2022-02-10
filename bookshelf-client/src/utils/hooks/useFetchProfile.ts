import { useEffect, useReducer, useState } from "react";
import BookEntry from "../../types/bookEntry";
import { Profile } from "../../types/profile";
import profileResponseToEntity from "../mappers/profileResponseMapper";

export interface ProfileState {
  loading: boolean;
  profileInfo: Profile | null;
  booklist: BookEntry[] | null;
  error: string | null;
}

const initialState: ProfileState = {
  loading: false,
  profileInfo: null,
  booklist: null,
  error: null,
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "INFO_SUCCESS"; payload: Profile }
  | { type: "BOOKLIST_SUCCESS"; payload: BookEntry[] }
  | { type: "FAILURE"; payload: string };

function fetchProfileReducer<UserProfileState>(
  state: UserProfileState,
  action: ACTION
) {
  const { type, payload } = action;

  switch (type) {
    case "LOAD":
      return { ...state, loading: true, error: null };
    case "INFO_SUCCESS":
      return { ...state, loading: false, profileInfo: payload, error: null };
    case "BOOKLIST_SUCCESS":
      return { ...state, loading: false, booklist: payload, error: null };
    case "FAILURE":
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
}

type UseFetchProfileReturnArgs = [
  ProfileState,
  React.Dispatch<React.SetStateAction<boolean>>
];

export const useFetchProfile = (
  fetchProfileInfo: Function,
  fetchBooklist: Function,
  username: string | undefined
): UseFetchProfileReturnArgs => {
  const [state, dispatch] = useReducer(fetchProfileReducer, initialState);
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    if (update && username) {
      setUpdate(false);
      fetchProfile(username, fetchProfileInfo, fetchBooklist, dispatch);
    }
    return () => {};
  }, [username, update, setUpdate, fetchProfileInfo, fetchBooklist]);
  return [state as ProfileState, setUpdate];
};

async function fetchProfile(
  username: string,
  fetchProfileInfo: Function,
  fetchBooklist: Function,
  dispatch: React.Dispatch<ACTION>
) {
  if (username) {
    dispatch({ type: "LOAD", payload: null });
    try {
      const res = await fetchProfileInfo(username);
      const profileInfo = profileResponseToEntity(res.data);
      dispatch({ type: "INFO_SUCCESS", payload: profileInfo });

      dispatch({ type: "LOAD", payload: null });

      const booklist = await fetchBooklist(username);
      dispatch({
        type: "BOOKLIST_SUCCESS",
        payload: booklist.data as BookEntry[],
      });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: error.response.data });
    }
  }
}
