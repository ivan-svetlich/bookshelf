import { useState } from "react";
import Book from "../../../types/book";
import { useAppSelector } from '../../../store/hooks/redux';
import { LoginState } from "../../../store/slices/loginSlice";
import { BookListState } from "../../../store/slices/bookListSlice";
import { useNavigate } from "react-router-dom";
import BookEntry from "../../../types/bookEntry";
import UpdateBook from "../../updateModal/components/UpdateBook";


export interface ItemProps {
    item: Book
}
const ItemCard = ({item}: ItemProps) => {
    const bookList: (BookListState['data']) = useAppSelector(state => state.bookList.data);
    const isLoggedIn: (LoginState['isLoggedIn']) = useAppSelector(state => state.login.isLoggedIn);
    const [show, setShow] = useState(false);
    let navigate = useNavigate();

    const handleClose = () => setShow(false);
    const handleShow = () => {     
        isLoggedIn ? setShow(true) : navigate('/login');  
    }
    const getBookEntryById = (bookId: string) => {
        if(bookList) {
          return bookList.find(book => book?.googleBooksId === bookId) as BookEntry;
        }
        return undefined;
    }

    return(
        <div className="card-border">
        <div className="card flex-row flex-wrap item-card">
            <div className="card-header border-0 item-image" title={item.title}>
                <img src={item.thumbnail} alt={item.title} />
            </div>
            <div className="item-info">
                <div className="line-clamp-1" title={item.title}><a href={`/book/${item.id}`}><h2>{item.title}</h2></a></div>       
                <div className="line-clamp-1" title={item.authors}><h5><b>Author(s): {item.authors}</b></h5></div>
                <div className="line-clamp-1" title={item.publisher}><p>Publisher: {item.publisher}</p></div>
                <ul id="card-links">
                    <li><button className="btn btn-link shadow-none"><a href={`/book/${item.id}`}>Details</a></button></li>
                    {getBookEntryById(item.id) ? 
                    <li><button className="btn btn-link shadow-none" onClick={handleShow}>Edit status</button></li>
                    : <li><button className="btn btn-link shadow-none" onClick={handleShow}>Add to list</button></li>
                    }   
                </ul>
            </div>
            <UpdateBook 
                show={show} 
                handleClose={handleClose} 
                item={item} 
                userEntry={getBookEntryById(item.id)}
            />
        </div>
        </div>

    );
};

export default ItemCard