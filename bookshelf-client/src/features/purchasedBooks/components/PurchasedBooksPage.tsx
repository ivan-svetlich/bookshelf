import "../styles/purchasedBooksStyles.css";
import { useEffect } from "react";
import { useAppSelector } from "../../../store/hooks/redux";
import Table from "react-bootstrap/Table";
import Loading from "../../loading/Loading";
import { useAppDispatch } from "../../../store/hooks/redux";
import {
  fetchPurchasedBooks,
  PurchasedBooksState,
} from "../../../store/slices/purchasedBooksSlice";
import { LoginState } from "../../../store/slices/loginSlice";
import SubHeader from "../../header/components/SubHeader";

const PurchasedBooksPage = () => {
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);
  const { data, loading, error }: PurchasedBooksState = useAppSelector(
    (state) => state.purchasedBooks
  );
  const dispatch = useAppDispatch();

  var formatter = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  useEffect(() => {
    dispatch(fetchPurchasedBooks());
  }, [dispatch]);

  return (
    <div>
      <SubHeader title={`My purchases`} icon="fas fa-shopping-cart"></SubHeader>
      <div id="purchased-books-page">
        {loading && <Loading />}
        {error && "error"}
        {data && (
          <div className="list-container">
            <span className="purchased-books-description">
              Books purchased in BOOKSHELF STORE by {user?.username}
            </span>
            <div className="row">
              <Table
                striped
                bordered
                hover
                responsive
                className="purchased-books-list"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author(s)</th>
                    <th>Publisher</th>
                    <th>Price</th>
                  </tr>
                </thead>
                {data && (
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td className="title-col">
                          <a href={`/book/${item.googleBooksId}`}>
                            {item.title}
                          </a>
                        </td>
                        <td className="authors-col">{item.authors}</td>
                        <td className="publisher-col">{item.publisher}</td>
                        <td className="price-col">
                          {formatter.format(item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasedBooksPage;
