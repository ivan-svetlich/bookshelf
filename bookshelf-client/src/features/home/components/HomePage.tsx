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
                <div className="home-container">
                    <div className='empty-col'></div>
                    <div className="left-col">                 
                        <RecentBooks books={lastUpdates} />
                        {updatesError && 'No data'}
                    </div>
                    
                    <div className="right-col">
                        {isLoggedIn && <><MyStats /><News /></>}
                        <TopBooks books={topBooks} />
                        {topBooksError && 'No data'}
                    </div>
                    <div className='empty-col'></div>
                </div>
            </div>
                            
                }
            </div>
        </div>
    );
};

export default HomePage