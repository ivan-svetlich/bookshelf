import '../styles/headerStyles.css';
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import HeaderDropdown from "./HeaderDropdown";
import Notifications from './Notifications';
import { LoginState } from '../../../store/slices/loginSlice';
import { useAppSelector } from '../../../store/hooks/redux';

const Header = () => {  
    const user: (LoginState['user']) = useAppSelector(state => state.login.user);

    return(
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" id="header" className='navbar'>
            <Container>
            <Navbar.Brand href="/home">
                <div id='brand-title' className='header-link'>
                    <span className='icon-container'>
                    <i className="fas fa-book-open"/> 
                    <i className="fas fa-book"/>
                    </span>
                     <span className='animated-underline'>BOOKSHELF</span>
                </div>
                </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href={user ? `/my_purchases` : '/login'} className='header-link'>
                        <span className='icon-container'><i className="fas fa-shopping-cart" /></span>
                        <span className="animated-underline">My purchases</span>
                    </Nav.Link>
                    <Nav.Link href={user ? `/list/${user.username}` : '/login'} className='header-link'>
                        <span className='icon-container'><i className="fas fa-list" /></span>
                        <span className="animated-underline">My list</span>
                    </Nav.Link>
                    <Nav.Link href="/search" className='header-link'>
                        <span className='icon-container'><i className="fas fa-search" /></span>
                        <span className="animated-underline">Search books</span>
                    </Nav.Link>
                </Nav>
                <Nav>
                    
                    {user ? <>
                        <Nav.Link href="/chat" title="Chat"><i className='fas fa-comments' /></Nav.Link>
                        <Notifications />
                        <HeaderDropdown />
                    </>
                    : <>
                        <Nav.Link href="/login" className="border-right">Login</Nav.Link>
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                    </>}
                    
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;