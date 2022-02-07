import { useReducer } from 'react';
import User from '../../../../types/user';
import authManagement, { SignupArgs } from '../../../../utils/api/authManagement';

export type SignupState = {
  loading: boolean,
  data: User | null,
  error: string | null
};

type ACTION = 
  { type: "LOAD", payload: null } | 
  { type: "SUCCESS"; payload: User } | 
  { type: "FAILURE", payload: string };

const initialState: SignupState = { loading: false, data: null, error: null };

function signupReducer<SignupState>(state: SignupState, action: ACTION) {
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

type UseSignupProps = [
  SignupState,
  (args: SignupArgs) => Promise<void>
]
export const useSignup = (): UseSignupProps => {
  const [state, dispatch] = useReducer(signupReducer, initialState);
  const dispatchSignup = (args: SignupArgs) => signup(args, dispatch);

  return [state as SignupState, dispatchSignup]
}

async function signup(args: SignupArgs, dispatch: React.Dispatch<ACTION>) {
    dispatch({ type: 'LOAD', payload: null });
    try {
        const response = await authManagement.signup(args);
        dispatch({ type: 'SUCCESS', payload: response.data });
    }
    catch (error: any) {
        dispatch({ type: 'FAILURE', payload: error.response.data });
    }

}