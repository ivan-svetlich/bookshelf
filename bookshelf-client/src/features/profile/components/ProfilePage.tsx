import "../styles/profileStyles.css";
import { Row, Col, Table, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Statistics from "./Statistics";
import ProfilePicture from "./ProfilePicture";
import Comments from "./comments/Comments";
import { DateTime } from "luxon";
import { useFetchProfile } from "../../../utils/hooks/useFetchProfile";
import profiles from "../../../utils/api/profiles";
import books from "../../../utils/api/books";
import { LoginState } from "../../../store/slices/loginSlice";
import { useAppSelector } from "../../../store/hooks/redux";
import SubHeader from "../../header/components/SubHeader";
import Loading from "../../loading/Loading";
import formatDate from "../../../utils/helpers/formatDate";
import getAverageSCore from "../../../utils/helpers/getAverageScore";

const ProfilePage = () => {

    const { username } = useParams();
    let [{ loading, profileInfo, booklist, error }] = useFetchProfile(
        profiles.getProfileInfo, books.getAll, username);
    const user: (LoginState['user']) = useAppSelector(state => state.login.user);

    return (
        <div>
        <SubHeader title={profileInfo ? `${profileInfo.username}'s profile` : error ? "Error" : "Loading..."} icon='fas fa-user-alt' />
        {loading && <Loading />}
        {profileInfo && booklist &&
            <div id="profile-page">
                <div className="profile-settings">
                        {username === user!.username 
                        ?   <a href="/settings/info" className="settings">
                                <i className="fas fa-user-edit"></i> 
                                <span> Edit profile</span>
                            </a>
                        :   ''}
                </div>
                    <Row>
                        <Col className="profile-info">
                            <br></br>
                            <div className="image-container">
                            {profileInfo.profilePicture ? <ProfilePicture source={profileInfo.profilePicture} sourceType="base64"/>
                                : <ProfilePicture source="default" sourceType=""/>}
                            </div>
                            <Table size="sm">
                            <tbody>
                                {username === user!.username &&  
                                <tr className="buttons-row">         
                                    <td className="content-is-center buttons-row">
                                        <a href={`/list/${username}`}><Button variant="outline-primary" className="profile-button"><i className="fas fa-list"></i></Button></a>
                                    </td>
                                </tr>}
                                {username !== user!.username &&   
                                    <tr className="buttons-row">
                                        <td className="content-is-center buttons-row">
                                            <a href={`/list/${username}`}><Button variant="outline-primary" className="profile-button"><i className="fas fa-list"></i></Button></a>
                                            <span>  </span>
                                            {profileInfo.isFriend 
                                            ? <Button variant="primary" disabled={true} className="profile-button"><i className="fas fa-user-check"></i></Button>
                                            : profileInfo.friendRequestSent
                                            ? <a href={`/friends/pending`}>
                                                <Button variant="secondary" title="Pending request" className="profile-button"><i className="fas fa-user-clock"></i></Button>
                                            </a>
                                                
                                            : <a href={`/friends/add/?q=${username}`}>
                                                <Button variant="outline-primary" className="profile-button"><i className="fas fa-user-plus"></i></Button>
                                            </a>
                                            }
                                        </td>
                                    </tr>
                                    }
                             </tbody>
                            </Table> 
                            <Table hover striped size="sm">
                                <tbody>
                                <tr>
                                        <td className="content-is-left">Last online:</td>
                                        <td className="content-is-right">
                                            <span className={checkOnline(profileInfo.lastOnline) ? 'text-is-green' : 'text-is-grey'}>
                                                {checkOnline(profileInfo.lastOnline) ? 'Now' : formatDate(profileInfo.lastOnline)}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="content-is-left">Gender:</td>
                                        <td className="content-is-right">{profileInfo.gender}</td>
                                    </tr>
                                    <tr>
                                        <td className="content-is-left">Birthday:</td>
                                        <td className="content-is-right">
                                            {profileInfo.birthday ? profileInfo.birthday.toString().split('T')[0] : '-/-/-'}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="content-is-left">Location:</td>
                                        <td className="content-is-right">{profileInfo.location}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <hr></hr>
                            <Table hover striped size="sm">
                                <tbody>
                                    <tr>
                                        <td className="content-is-left">Total entries:</td>
                                        <td className="content-is-center">{booklist.length}</td>
                                    </tr>
                                    <tr>
                                        <td className="content-is-left">Average score:</td>
                                        <td className="content-is-center">{getAverageSCore(booklist)}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                        {username &&
                        <Col className="right-col">
                        <br></br>
                        <Statistics username={username} booklist={booklist}/>
                        <Comments username={username} />
                        </Col>
                        }
                    </Row> 
            </div>

    }
    <div id="comments"></div>
    </div>
    );
};

function checkOnline(lastOnline: Date) {
    if(DateTime.fromISO(lastOnline.toString(), {zone: 'utc'}).setZone().diffNow('minutes').minutes > -1) {
        return true;
    }
    else {
        return false;
    }
}

export default ProfilePage;