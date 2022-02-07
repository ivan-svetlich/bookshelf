import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import bookshelfService from "../../../utils/api/books";
import { LoginState } from '../../../store/slices/loginSlice';
import '../styles/homeStyles.css';
import { BookState, useFetchBooks } from "../hooks/useFetchBooks";
import News from './news/News';
import RecentBooks from './recentUpdates/RecentUpdates';
import TopBooks from './topBooks/TopBooks';
import { useAppSelector } from '../../../store/hooks/redux';
import SubHeader from '../../header/components/SubHeader';
import Loading from '../../loading/Loading';
import MyStats from './statistics/MyStats';

const HomePage = () => {
    const isLoggedIn: LoginState['isLoggedIn'] = useAppSelector(state => state.login.isLoggedIn)
    const {loading: loadingUpdates, data: lastUpdates, error: updatesError}: BookState = useFetchBooks(bookshelfService.getUpdates, 5);
    const {loading: loadingTopBooks, data: topBooks, error: topBooksError}: BookState = useFetchBooks(bookshelfService.getTopBooks, 3);

    const loading = (loadingUpdates || loadingTopBooks || !topBooks || !lastUpdates);

    return (
        <div>
            <SubHeader title={`Home`} icon='fas fa-home'></SubHeader> 
            <div>
            {loading && <Loading />}
            {topBooks && lastUpdates &&
            <div id="home-page">
                <Row className="home-container">
                    <Col xs={1}></Col>
                    <Col className="d-flex justify-content-center">                 
                        <RecentBooks books={lastUpdates} />
                        {updatesError && 'No data'}
                    </Col>
                    
                    <Col xs={4} className="justify-content-center">
                        {isLoggedIn && <><MyStats /><News /></>}
                        <TopBooks books={topBooks} />
                        {topBooksError && 'No data'}
                    </Col>
                    <Col xs={1} className='right-side'></Col>
                </Row>
            </div>
                            
                }
            </div>
        </div>
    );
};

export default HomePage