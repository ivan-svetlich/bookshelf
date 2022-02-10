import BookEntry from "../../../../types/bookEntry";

export interface TopBookProps {
  topBook: BookEntry;
  index: number;
}

const ItemCard = ({ topBook, index }: TopBookProps) => {
  const getRankingClass = (index: number) => {
    switch (index) {
      case 0:
        return "first-place";
      case 1:
        return "second-place";
      case 2:
        return "third-place";
      default:
        return "low-place";
    }
  };
  return (
    <div className="card flex-row flex-wrap item-card">
      <div
        className={`card-header border-0 ranking ${getRankingClass(index)}`}
        title={topBook.title}
      >
        {index === 0 ? <i className="fas fa-crown" /> : `#${index + 1}`}
      </div>
      <div className="card-header border-0 item-image" title={topBook.title}>
        <img src={topBook.thumbnail} alt={topBook.title} width={"60px"} />
      </div>
      <div className="item-info top-book">
        <div className="line-clamp-1" title={topBook.title}>
          <a href={`/book/${topBook.googleBooksId}`}>
            <h5>{topBook.title}</h5>
          </a>
        </div>
        <div
          className="line-clamp-1"
          title={topBook.authors ? topBook.authors : "No data"}
        >
          <p>
            <b>Author(s): {topBook.authors}</b>
          </p>
        </div>
        <div className="line-clamp-1">
          <p>{topBook!.count} member(s)</p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
