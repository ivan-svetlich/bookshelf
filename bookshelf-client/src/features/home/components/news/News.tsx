import '../../styles/newsStyles.css';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../../store/hooks/redux';
import { LoginState } from '../../../../store/slices/loginSlice';
import { useFetchNotifications } from '../../../../utils/hooks/useFetchNotifications';

const News = () => {
    const user: LoginState['user'] = useAppSelector(state => state.login.user);
    const [notificationState] = useFetchNotifications();

    return (
        <div id="news">    
            {!notificationState.loading && notificationState.data &&
                <div><h5 className='animated-underline slide-in'>Notifications</h5>
                {notificationState.data.length > 0
                ? notificationState.data.map(notification => {
                    if(notification.category === "Friend request"){
                        return (
                            <div className='notif' key={`request-${notification.id}`}>
                                <span className="notif-icon-container"><i className='far fa-user notif-icon' /></span>
                                <a href={`/profile/${notification.reference}`}> {notification.reference}</a> sent you a friend request. 
                                <a href={`/friends/pending`}> See</a>
                            </div>
                        )
                    }
                    else if(notification.category === "New comment"){
                        return (
                            <div className='notif' key={`comment-${notification.id}`}>
                                <span className="notif-icon-container"><i className='far fa-comment notif-icon' /></span>
                                <a href={`/profile/${notification.reference}`}> {notification.reference}</a> posted a comment on your profile.  
                                <Link to={{pathname: `/profile/${user?.username}`, hash: '#comments'}}> See</Link >                                    
                            </div>
                        )
                    }
                    else return ''
                }
                )
                : <div className='notif'>No new notifications</div>}
                </div>
            }
        </div>
    );
};

export default News;