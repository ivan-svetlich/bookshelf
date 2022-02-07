import { Navigate, RouteProps } from 'react-router-dom';
import { useAppSelector } from '../store/hooks/redux';
import { LoginState } from "../store/slices/loginSlice";

export type ProtectedRouteProps = {
} & RouteProps;

function LoggedOutRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn: (LoginState['isLoggedIn']) = useAppSelector(state => state.login.isLoggedIn);
  
  return <> {!isLoggedIn ? children : <Navigate to={`/home`} />} </>;
}

export default LoggedOutRoute;