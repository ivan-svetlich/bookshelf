import '../../styles/myStatsStyles.css';
import Table from "react-bootstrap/Table";
import { useAppSelector } from "../../../../store/hooks/redux";
import { BookListState } from "../../../../store/slices/bookListSlice";
import getStatusCount from "../../../../utils/helpers/getStatusCount";

const MyStats = () => {
    const booklist: BookListState['data'] = useAppSelector(state => state.bookList.data);
    const statusCount = getStatusCount(booklist ? booklist : []);

    return (
        <div id="my-stats">
            {booklist &&
            <div> 
                <div id="my-stats-title">
                    <h5 className='animated-underline slide-in'>My statistics</h5>
                </div>                  
                <Table id="my-stats-table">
                    <tbody>
                        <tr className='total-row'>
                            <td colSpan={2}>Total entries</td>
                            <td>{booklist.length}</td>
                        </tr>
                        <tr className='reading-row'>
                            <td></td>
                            <td>Reading</td>
                            <td>{statusCount['1'] | 0}</td>
                        </tr>
                        <tr className='completed-row'>
                            <td></td>
                            <td>Completed</td>
                            <td>{statusCount['2'] | 0}</td>
                        </tr>
                        <tr className='on-hold-row'>
                            <td></td>
                            <td>On-Hold</td>
                            <td>{statusCount['3'] | 0}</td>
                        </tr>
                        <tr className='dropped-row'>
                            <td></td>
                            <td>Dropped</td>
                            <td>{statusCount['4'] | 0}</td>
                        </tr>
                        <tr className='plan-to-read-row'>
                            <td></td>
                            <td>Plan to Read</td>
                            <td>{statusCount['5'] | 0}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            }
        </div>
    );
};

export default MyStats;