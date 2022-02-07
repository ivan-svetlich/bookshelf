import { useReducer } from 'react';
import friends from '../../../utils/api/friends';

export interface RequestState {
    loading: boolean,
    success: boolean,
    error: string | null
};

const initialState: RequestState = {
    loading: false,
    success: false,
    error: null
};

type ACTION = { type: "LOAD", payload: null } | 
    { type: "SUCCESS"; payload: null } | 
    { type: "FAILURE", payload: string};

function fetchProfileReducer<UserProfileState>(state: UserProfileState, action: ACTION) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD':
      return { ...state, loading: true, success: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, success: true, error: null };
    case 'FAILURE':
      return { ...state, loading: false, success: false, error: payload };
    default:
      return state;
  }
};

type UseSendRequestReturnArgs = [
  RequestState,
  (username: string) => Promise<void>
]

export const useSendRequest = (): UseSendRequestReturnArgs => {
  const [state, dispatch] = useReducer(fetchProfileReducer, initialState);
  let sendFriendRequest = (username: string) => sendRequest(username, dispatch);

  return [state as RequestState, sendFriendRequest];
}

async function sendRequest(username: string, dispatch: React.Dispatch<ACTION>) {
  if (username) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      await friends.sendFriendRequest(username);
      
      dispatch({ type: 'SUCCESS', payload: null });
    }
    catch (error: any) {
      dispatch({ type: 'FAILURE', payload: error.response.data });
    }
  }
}