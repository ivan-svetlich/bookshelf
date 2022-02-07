import { useEffect, useReducer, useState } from 'react';
import { Friend } from '../../../types/friend';
import friends from '../../../utils/api/friends';

export interface FriendListState {
    loading: boolean,
    data: Friend[] | null,
    error: string | null
};

const initialState: FriendListState = {
    loading: false,
    data: null,
    error: null
};

type ACTION = { type: "LOAD", payload: null } | 
    { type: "SUCCESS"; payload: Friend[] } | 
    { type: "FAILURE", payload: string};

function fetchProfileReducer<FriendListState>(state: FriendListState, action: ACTION) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD':
      return { ...state, loading: true, data: null, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: payload, error: null };
    case 'FAILURE':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

type UseFetchFriendListReturnArgs = [FriendListState, React.Dispatch<React.SetStateAction<boolean>>];

export const useFetchFriendList = (filter: string): UseFetchFriendListReturnArgs => {
  const [state, dispatch] = useReducer(fetchProfileReducer, initialState);
  const [update, setUpdate] = useState(true);
  
  useEffect(() => {
    if(update) {
        setUpdate(false);
        fetchFriendList(dispatch, filter);
    }
  }, [filter, update])
  return [state as FriendListState, setUpdate];
}

async function fetchFriendList(dispatch: React.Dispatch<ACTION>, filter: string) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      const res = await friends.getFriendList(filter);
      
      dispatch({ type: 'SUCCESS', payload: res.data as Friend[] });
    }
    catch (error: any) {
      dispatch({ type: 'FAILURE', payload: error.response.data });
    }
}