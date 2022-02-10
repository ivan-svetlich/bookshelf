import { useState } from "react";
import Button from "react-bootstrap/Button";
import ReactHtmlParser from "react-html-parser";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../styles/itemStyles.css";
import UpdateProduct from "./UpdateProduct";
import { useEffect } from "react";
import BuyItemButton from "./BuyItemButton";
import { BookState, useFetchBook } from "../hooks/useFetchBook";
import googleBooksService from "../../search/api/googleBooks";
import { LoginState } from "../../../store/slices/loginSlice";
import { useAppSelector } from "../../../store/hooks/redux";
import { BookListState } from "../../../store/slices/bookListSlice";
import Product, { ProductDTO, ProductUpdate } from "../../../types/product";
import useUpdateProduct, {
  addProduct,
  removeProduct,
  updateProduct,
} from "../hooks/useAddProduct";
import BookEntry from "../../../types/bookEntry";
import products from "../../../utils/api/products";
import SubHeader from "../../header/components/SubHeader";
import Loading from "../../loading/Loading";
import UpdateBook from "../../updateModal/components/UpdateBook";

const ItemPage = () => {
  const { id } = useParams();

  const { loading, data, error }: BookState = useFetchBook(
    googleBooksService.getBookById,
    id
  );
  const isLoggedIn: LoginState["isLoggedIn"] = useAppSelector(
    (state) => state.login.isLoggedIn
  );
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);
  const bookList: BookListState["data"] = useAppSelector(
    (state) => state.bookList.data
  );
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  let location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => {
    isLoggedIn ? setShow(true) : navigate("/login");
  };

  const [showUpdateProduct, setShowUpdateProduct] = useState(false);
  const handleCloseUpdateProduct = () => setShowUpdateProduct(false);
  const handleShowUpdateProduct = () => setShowUpdateProduct(true);
  const [addProductState, dispatchUpdateProduct] = useUpdateProduct();

  const handleAddProduct = async (product: ProductDTO) => {
    (handleCloseUpdateProduct as Function)();
    await addProduct(product, dispatchUpdateProduct);
  };

  const handleUpdateProduct = async (update: ProductUpdate) => {
    (handleCloseUpdateProduct as Function)();
    await updateProduct(update, dispatchUpdateProduct);
  };

  const handleRemoveProduct = async (productId: number) => {
    (handleCloseUpdateProduct as Function)();
    await removeProduct(productId, dispatchUpdateProduct);
  };

  const getBookEntryById = (bookId: string) => {
    if (bookList) {
      return bookList.find(
        (book) => book?.googleBooksId === bookId
      ) as BookEntry;
    }
    return undefined;
  };

  const [updateProductInfo, setUpdateProductInfo] = useState(true);
  useEffect(() => {
    async function getProduct(id: string) {
      await products
        .getProductById(id)
        .then(async (response) => {
          setProduct(response.data as Product);
          setLoadingProduct(false);
        })
        .catch(() => {
          setLoadingProduct(false);
          setProduct(null);
        });
    }
    if (data && updateProductInfo) {
      setUpdateProductInfo(false);
      getProduct(data.id);
    }
  }, [data, updateProductInfo]);

  const handleReddirect = () => {
    navigate(`/login?redirectTo=${location.pathname}`, { replace: true });
  };

  return (
    <div>
      <SubHeader
        title={data ? `${data.title}, by ${data.authors}` : "Loading..."}
        icon="fas fa-book"
      ></SubHeader>
      <div id="item-page">
        {(loading || loadingProduct) && <Loading />}
        {error && "error"}
        {data && !loading && !loadingProduct && (
          <>
            <div className="card flex-row flex-wrap item-card">
              <div
                className="card-header border-0 item-image"
                title={data.title}
              >
                <img src={data.thumbnail} alt={data.title} />
                <ul id="card-links">
                  {getBookEntryById(data.id) ? (
                    <li>
                      <button
                        className="btn btn-link shadow-none"
                        onClick={handleShow}
                      >
                        Edit status
                      </button>
                    </li>
                  ) : (
                    <li>
                      <button
                        className="btn btn-link shadow-none"
                        onClick={handleShow}
                      >
                        Add to list
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              <div className="item-info">
                <div className="card-title" title={data.title}>
                  <h2>{data.title}</h2>
                </div>
                <div className="line-clamp-1" title={data.authors}>
                  <h5>
                    <b>Author(s): {data.authors}</b>
                  </h5>
                </div>
                <div className="line-clamp-1" title={data.publisher}>
                  <p>Publisher: {data.publisher}</p>
                </div>

                {product ? (
                  isLoggedIn ? (
                    <BuyItemButton id={product.id.toString()} />
                  ) : (
                    <Button variant="primary" onClick={() => handleReddirect()}>
                      Log In to buy!
                    </Button>
                  )
                ) : (
                  <span className="not-available">
                    Not available in Bookshelf Store
                  </span>
                )}
              </div>
              {user?.isAdmin && (
                <div className="admin-btn">
                  <div className="admin-attribution">
                    <i className="fas fa-user-lock" /> Admin attribution
                  </div>
                  {!addProductState.loading && !product && (
                    <Button
                      variant="outline-dark"
                      onClick={handleShowUpdateProduct}
                    >
                      <i className="fas fa-shopping-cart" /> Add to store
                    </Button>
                  )}
                  {!addProductState.loading && product && (
                    <Button
                      variant="outline-dark"
                      onClick={handleShowUpdateProduct}
                    >
                      <i className="fas fa-shopping-cart" /> Update product
                    </Button>
                  )}
                  {addProductState.loading && <Loading />}
                  {/* {addProductState.id && <span className="add-success">Product updated successfully! (id: {addProductState.id})</span>} */}
                  {addProductState.error && (
                    <span className="add-failure">{addProductState.error}</span>
                  )}
                </div>
              )}
              <Description content={data.description} />
            </div>
            <UpdateBook
              show={show}
              handleClose={handleClose}
              item={data}
              userEntry={getBookEntryById(data.id)}
            />
            <UpdateProduct
              show={showUpdateProduct}
              handleClose={handleCloseUpdateProduct}
              item={data}
              product={product}
              handleAddProduct={handleAddProduct}
              handleUpdateProduct={handleUpdateProduct}
              handleRemoveProduct={handleRemoveProduct}
              setUpdateProductInfo={setUpdateProductInfo}
            />
          </>
        )}
      </div>
    </div>
  );
};

type descriptionProps = {
  content: string;
};
const Description = ({ content }: descriptionProps) => {
  return (
    <div className="description">
      <h4>Description</h4>
      {ReactHtmlParser(content)}
    </div>
  );
};

export default ItemPage;
