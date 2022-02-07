import { Navigate, RouteProps, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks/redux';
import { LoginState } from "../store/slices/loginSlice";

export type ProtectedRouteProps = {
} & RouteProps;

function PrivateRoute({ children }: ProtectedRouteProps) {
  const redirectTo = useLocation().pathname;
  const isLoggedIn: (LoginState['isLoggedIn']) = useAppSelector(state => state.login.isLoggedIn);
  
  return <> {isLoggedIn ? children : <Navigate to={`/login?redirectTo=${redirectTo}`} />} </>;
}

export default PrivateRoute;
