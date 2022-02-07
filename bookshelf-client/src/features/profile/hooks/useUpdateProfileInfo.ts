import { useReducer, useState } from 'react';
import { Profile } from '../../../types/profile';
import profiles, { UpdateProfileArgs } from '../../../utils/api/profiles';
import profileResponseToEntity from '../../../utils/mappers/profileResponseMapper';

export interface ProfileState {
    loading: boolean,
    profileInfo: Profile | null
    error: string | null
};

const initialState: ProfileState = {
    loading: false,
    profileInfo: null,
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
      return { ...state, loading: false, profileInfo: payload, error: null };
    case 'FAILURE':
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
};

type UseUpdateProfileReturnArgs = [
  ProfileState,
  React.Dispatch<React.SetStateAction<UpdateProfileArgs>>,
  () => Promise<void>
]

export const useUpdateProfileInfo = (inputs: UpdateProfileArgs): UseUpdateProfileReturnArgs => {
    const [state, dispatch] = useReducer(updateProfileReducer, initialState);
    const [_inputs, setInputs] = useState(inputs);

    const updateProfileInfo = () => updateProfile(_inputs, dispatch);

    return [(state as ProfileState), setInputs, updateProfileInfo];
}

async function updateProfile(args: UpdateProfileArgs, dispatch: React.Dispatch<ACTION>) {
  if (args) {
    dispatch({ type: 'LOAD', payload: null });
    try {
      const res = await profiles.updateProfileInfo(args);
      const profileInfo = profileResponseToEntity(res.data);
      //appDispatch(setMessage({content: 'Profile info updated successfuly', variant: 'Success'}));

      dispatch({ type: 'SUCCESS', payload: profileInfo });
    }
    catch (error: any) {
      dispatch({ type: 'FAILURE', payload: error.response.data });
    }
  }
}