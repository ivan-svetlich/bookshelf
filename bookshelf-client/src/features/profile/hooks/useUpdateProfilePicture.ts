import { useReducer } from 'react';
import { Profile } from '../../../types/profile';
import profiles from '../../../utils/api/profiles';
import profileResponseToEntity from '../../../utils/mappers/profileResponseMapper';

export interface ProfileState {
    loading: boolean,
    data: Profile | null
    error: string | null
};

const initialState: ProfileState = {
    loading: false,
    data: null,
    error: null
};

type ACTION = { type: "LOAD", payload: null } | 
    { type: "SUCCESS"; payload: Profile } | 
    { type: "FAILURE", payload: string};

function updateProfileReducer<ProfileState>(state: ProfileState, action: ACTION) {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD':
      return { ...state, loading: true, error: null };
    case 'SUCCESS':
      return { ...state, loading: false, data: payload, error: null };
    case 'FAILURE':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

type UseUpdateProfileReturnArgs = [
  ProfileState,
  (formData: FormData) => Promise<void>
]

export const useUpdateProfilePicture = (): UseUpdateProfileReturnArgs => {
  const [state, dispatch] = useReducer(updateProfileReducer, initialState);
  
  const updateProfilePicture = (formData: FormData) => updateProfile(formData, dispatch);

  return [(state as ProfileState), updateProfilePicture];
}

async function updateProfile(formData: FormData | undefined, dispatch: React.Dispatch<ACTION>) {
  if (formData) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      const res = await profiles.updateProfilePicture(formData);
      const profilePicture = profileResponseToEntity(res.data);
      //appDispatch(setMessage({content: 'Profile Picture updated successfuly', variant: 'Success'}));

      dispatch({ type: 'SUCCESS', payload: profilePicture });
    }
    catch (error: any) {
      dispatch({ type: 'FAILURE', payload: error.response.data });
    }
  }
}
