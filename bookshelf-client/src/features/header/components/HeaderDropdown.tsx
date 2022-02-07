import React from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/redux";
import { LoginState, logout } from "../../../store/slices/loginSlice";

const HeaderDropdown = () => {
    const user: (LoginState['user']) = useAppSelector(state => state.login.user);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        dispatch(logout());
    }

    return(
        <NavDropdown title={user?.isAdmin ? <><i className="fas fa-user-lock" title="admin"/> {user!.username}</> : <>{user!.username}</>} 
            id="collasible-nav-dropdown" align="end">
            <NavDropdown.Item href={`/profile/${user!.username}`} className="dropdown-item">Profile</NavDropdown.Item>
            <NavDropdown.Item href={`/friends/list/`} className="dropdown-item">Friends</NavDropdown.Item>
            <NavDropdown.Item href={`/list/${user!.username}`} className="dropdown-item">My List</NavDropdown.Item>
            <NavDropdown.Item href={`/my_purchases`} className="dropdown-item">My Purchases</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className="dropdown-item">Logout</NavDropdown.Item>
        </NavDropdown>
    );
};

export default HeaderDropdown;