import '../../styles/topBooksStyles.css';
import TopBookCard from "./TopBookCard";
import BookEntry from '../../../../types/bookEntry';

type TopBooksProps = {
    books: BookEntry[]
}

const TopBooks = ({ books }: TopBooksProps) => {
    return (
        <div id="top-books">
            <div id="top-books-title">
                <h5 className='animated-underline from-center'>Top books</h5>
            </div>
            <div id="top-books-cards">
                {books.map((item: BookEntry, index) => ( 
                    <TopBookCard topBook={item} key={item.googleBooksId} index={index} />
                ))}
            </div>
        </div>
    );
};

export default TopBooks;