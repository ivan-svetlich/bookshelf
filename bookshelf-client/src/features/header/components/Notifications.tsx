import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { LoginState } from "../../../store/slices/loginSlice";
import { useAppSelector } from "../../../store/hooks/redux";
import { useFetchNotifications } from "../../../utils/hooks/useFetchNotifications";
import notifications from "../../../utils/api/notifications";
import Loading from "../../loading/Loading";

const Notifications = () => {
    const user: (LoginState['user']) = useAppSelector(state => state.login.user);
    const [notificationState, setUpdate] = useFetchNotifications();

    const markAsRead = async () => {
       await notifications.markAllAsRead().then(() => setUpdate(true));
    }


    return(
        <NavDropdown title={<div title="Notifications"><i className="fas fa-bell"/>
            {notificationState.data && notificationState.data.length > 0 
            && <sup className="notif-number"> {notificationState.data.length}</sup>}</div>} 
            id="collasible-nav-dropdown" className="header-item notif" align="end">
            <NavDropdown.ItemText className="dropdown-heading">
                Notifications
                <div  className="read-btn">
                    <Button size="sm" variant="link" onClick={markAsRead} 
                        disabled={(notificationState.data && notificationState.data.length === 0) 
                            || notificationState.loading}
                    >✓ Mark all as read</Button>
                </div>
            </NavDropdown.ItemText>
            <NavDropdown.Divider />
            {notificationState.data && notificationState.data.length > 0 &&
            notificationState.data.map(notification => {
                if(notification.category === "Friend request"){
                    return (
                        <NavDropdown.ItemText className="notif-item line-clamp-1" key={`request-${notification.id}`}>
                            <span className="notif-icon-container"><i className='far fa-user notif-icon' /></span>
                            <a href={`/profile/${notification.reference}`}> {notification.reference}</a> sent you a friend request. <a href={`/friends/pending`}>See</a>
                        </NavDropdown.ItemText>
                    )
                }
                else if(notification.category === "New comment"){
                    return (
                        <NavDropdown.ItemText className="notif-item line-clamp-1" key={`comment-${notification.id}`}>
                            <span className="notif-icon-container"><i className='far fa-comment notif-icon' /></span>
                            <a href={`/profile/${notification.reference}`}> {notification.reference}</a> posted a comment on your profile.  
                            <a href={`/profile/${user?.username}#comments`}> See</a>        
                        </NavDropdown.ItemText>
                    )
                }
                else return ''
            })}
            {notificationState.data && notificationState.data.length === 0 &&
            <NavDropdown.ItemText className="notif-item line-clamp-1" key={`empty`}>
                No new notifications
            </NavDropdown.ItemText>}
            {notificationState.loading && <div className="loading-container"><Loading /></div>}
            {notificationState.error && "Sorry! Couldn't load notifications. Please reload the page."}
        </NavDropdown>
    );
};

export default Notifications;