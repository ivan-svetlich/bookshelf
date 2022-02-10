import { useEffect, useReducer } from "react";
import IComment from "../../../types/comment";

export type CommentState = {
  loading: boolean;
  data: IComment[];
  error: string | null;
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: IComment[] }
  | { type: "FAILURE"; payload: string };

const initialState: CommentState = { loading: false, data: [], error: null };

function fetchCommentsReducer<CommentState>(
  state: CommentState,
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

export const useFetchComments = (
  fetchResource: Function,
  username: string,
  update: boolean,
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>
): CommentState => {
  const [state, dispatch] = useReducer(fetchCommentsReducer, initialState);

  useEffect(() => {
    if (update) {
      fetchComments(username, fetchResource, dispatch);
      setUpdate(false);
    }
  }, [fetchResource, username, update, setUpdate]);
  return state as CommentState;
};

async function fetchComments(
  username: string,
  fetchResource: Function,
  dispatch: React.Dispatch<ACTION>
) {
  if (username) {
    dispatch({ type: "LOAD", payload: null });
    try {
      const response = await fetchResource(username);
      dispatch({ type: "SUCCESS", payload: response.data });
    } catch (error: any) {
      dispatch({ type: "FAILURE", payload: error.response.data });
    }
  }
}
