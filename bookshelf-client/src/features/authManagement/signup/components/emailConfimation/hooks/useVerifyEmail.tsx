import { useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import authManagement, {
  ConfirmEmailArgs,
} from "../../../../../../utils/api/authManagement";

export type VerificationState = {
  loading: boolean;
  success: boolean;
  error: string | null;
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: null }
  | { type: "FAILURE"; payload: string };

const initialState: VerificationState = {
  loading: false,
  success: false,
  error: null,
};

function emailVerificationReducer<VerificationState>(
  state: VerificationState,
  action: ACTION
) {
  const { type, payload } = action;

  switch (type) {
    case "LOAD":
      return { ...state, loading: true, success: false, error: null };
    case "SUCCESS":
      return { ...state, loading: false, success: true, error: null };
    case "FAILURE":
      return { ...state, loading: false, error: payload };
    default:
      return state;
  }
}

const useConfirmEmail = () => {
  const location = useLocation();
  const params = getQueryParams(location.search);
  const [state, dispatch] = useReducer(emailVerificationReducer, initialState);

  useEffect(() => {
    if (params.id && params.token) {
      const confirmArgs: ConfirmEmailArgs = {
        id: params.id,
        token: params.token,
      };
      confirmEmailAsync(confirmArgs, dispatch);
    }
  }, [dispatch, params.id, params.token]);

  return state as VerificationState;
};

const confirmEmailAsync = async (
  confirmArgs: ConfirmEmailArgs,
  dispatch: React.Dispatch<ACTION>
) => {
  dispatch({ type: "LOAD", payload: null });
  try {
    await authManagement.confirmEmail(confirmArgs).then(() => {
      dispatch({ type: "SUCCESS", payload: null });
    });
  } catch (e: any) {
    dispatch({ type: "FAILURE", payload: e.response.data });
  }
};

const getQueryParams = (pathname: string) => {
  const query = new URLSearchParams(pathname);
  const id = query.get("id");
  const token = query.get("token");

  return { id, token };
};

export default useConfirmEmail;
