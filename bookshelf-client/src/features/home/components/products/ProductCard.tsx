import { DateTime } from "luxon";
import { useAppSelector } from "../../../../store/hooks/redux";
import { LoginState } from "../../../../store/slices/loginSlice";
import BookEntry from "../../../../types/bookEntry";

export interface ItemProps {
  item: BookEntry;
}
const RecentBookCard = ({ item }: ItemProps) => {
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);

  return (
    <div className="card flex-row flex-wrap item-card">
      <div className="card-header border-0 item-image" title={item.title}>
        <img src={item.thumbnail} alt={item.title} width={"100px"} />
      </div>
      <div className="item-info">
        <div className="line-clamp-1" title={item.title}>
          <a href={`/book/${item.googleBooksId}`}>
            <h5>
              <b>{item.title}</b>
            </h5>
          </a>
        </div>
        <div className="line-clamp-1">
          <p>
            <b>
              {statusMapper(item.status)}
              {item.score ? " - score: " + item.score : ""}
            </b>
          </p>
        </div>
        <div className="date-user">
          <p>
            {item.updatedAt ? formatDate(item.updatedAt) : "-/-/-"}
            <span> by </span>
            <a href={`/profile/${item.username}`} title={item.username}>
              {user && user.username === item.username ? "me" : item.username}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const formatDate = (date: Date) => {
  const datetime = DateTime.fromISO(date.toString(), { zone: "utc" })
    .setZone()
    .toLocaleString(DateTime.DATETIME_MED);

  return datetime;
};

const statusMapper = (statusId: string | null) => {
  let bookStatus;
  switch (statusId) {
    case "1":
      bookStatus = "Reading";
      break;
    case "2":
      bookStatus = "Completed";
      break;
    case "3":
      bookStatus = "On-Hold";
      break;
    case "4":
      bookStatus = "Dropped";
      break;
    case "5":
      bookStatus = "Plan to Read";
      break;
    default:
      bookStatus = "-";
      break;
  }
  return bookStatus;
};

export default RecentBookCard;
