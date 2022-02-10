import BookEntry from "../../../../types/bookEntry";
import "../../styles/recentBooksStyles.css";
import RecentBookCard from "./ProductCard";

type RecentBooksProps = {
  books: BookEntry[];
};

const RecentBooks = ({ books }: RecentBooksProps) => {
  return (
    <div id="recent-books">
      {books.map((item: BookEntry) => (
        <RecentBookCard item={item} key={item.id} />
      ))}
    </div>
  );
};

export default RecentBooks;
