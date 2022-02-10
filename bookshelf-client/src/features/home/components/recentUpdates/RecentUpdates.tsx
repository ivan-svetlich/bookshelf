import BookEntry from "../../../../types/bookEntry";
import "../../styles/recentBooksStyles.css";
import RecentBookCard from "./RecentUpdateCard";

type RecentBooksProps = {
  books: BookEntry[];
};

const RecentBooks = ({ books }: RecentBooksProps) => {
  const handleHighlight = () => {};
  return (
    <div id="recent-updates" onFocus={handleHighlight}>
      <div id="updates-title">
        <h5 className="animated-underline from-center">Recent updates</h5>
      </div>
      <div id="recent-books">
        {books.map((item: BookEntry) => (
          <RecentBookCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default RecentBooks;
