import { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../../../types/profile';
import profiles from '../../../utils/api/profiles';

export type ProfileState = {
    loading: boolean,
    data: Profile | null,
    error: string | null
}

const initialState: ProfileState = { loading: false, data: null, error: null };

type ACTION = { type: "LOAD", payload: null } | 
    { type: "SUCCESS"; payload: Profile } | 
    { type: "FAILURE", payload: string };

function searchUserReducer<ProfileState>(state: ProfileState, action: ACTION) {
    const { type, payload } = action;
    
    switch (type) {
        case 'LOAD':
        return { ...state, loading: true, data: null, error: null };
        case 'SUCCESS':
        return { ...state, loading: false, data: payload, error: null };
        case 'FAILURE':
        return { ...state, loading: false, data: null, error: payload };
        default:
        return state;
    }
};

type UseSearchUserReturn = [
    ProfileState,
    string,
    React.Dispatch<React.SetStateAction<string>>
]

export const useSearchUser = (username: string, timeout: number): UseSearchUserReturn => {
    const [state, dispatch] = useReducer(searchUserReducer, initialState);
    const [_username, setUsername] = useState(username);
    const navigate = useNavigate();

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if(_username) {
                navigate(`/friends/add?q=${_username}`, { replace: true })
                fetchProfile(_username, dispatch);
            }
        }, timeout);
        return () => {
            clearTimeout(timeoutId);
        }
    }, [_username, timeout, dispatch, navigate])
    return [state as ProfileState, _username, setUsername];
}

async function fetchProfile(username: string, dispatch: React.Dispatch<ACTION>) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      if(username) {
        const response = await profiles.getProfileInfo(username);
        dispatch({ type: 'SUCCESS', payload: response.data });
      }  
    }
    catch (error: any) {
        dispatch({ type: 'FAILURE', payload: error.response.data });
    }

}