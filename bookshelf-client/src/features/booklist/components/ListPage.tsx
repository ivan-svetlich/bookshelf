import "../styles/listStyles.css";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import { LoginState } from "../../../store/slices/loginSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks/redux";
import {
  BookListState,
  fetchBookList,
} from "../../../store/slices/bookListSlice";
import useDownload from "../hooks/useDownload";
import SubHeader from "../../header/components/SubHeader";
import Loading from "../../loading/Loading";
import DownloadModal from "./DownloadModal";

const ListPage = () => {
  const { username } = useParams();
  const [fileLoading, setFileLoading] = useState(false);
  const user: LoginState["user"] = useAppSelector((state) => state.login.user);
  const booklistState: BookListState = useAppSelector(
    (state) => state.bookList
  );
  const dispatch = useAppDispatch();

  const [download, setDownload] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const [fileType, setFileType] = useState("pdf");
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setBtnDisabled(false);
  };
  const handleShow = () => {
    setShow(true);
    setBtnDisabled(true);
  };

  useEffect(() => {
    if (username && !booklistState.data) {
      dispatch(fetchBookList(username));
    }
  }, [booklistState.data, dispatch, username]);

  useDownload({
    download,
    setDownload,
    fileType,
    setBtnDisabled,
    setFileLoading,
  });

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

  return (
    <div>
      <SubHeader title={`${username}'s list`} icon="fas fa-list"></SubHeader>
      <div id="list-page">
        {booklistState.loading && <Loading />}
        {booklistState.data && (
          <div className="list-container">
            {user?.username === username && (
              <div className="row">
                <div id="download-btn-container">
                  {fileLoading && (
                    <div className="loading-container">
                      <Loading />
                    </div>
                  )}
                  <Button
                    onClick={handleShow}
                    variant="outline-dark"
                    size="sm"
                    id="download-btn"
                    disabled={btnDisabled}
                  >
                    <i className="fas fa-download" /> Download
                  </Button>
                  <DownloadModal
                    show={show}
                    fileType={fileType}
                    setDownload={setDownload}
                    setFileType={setFileType}
                    handleClose={handleClose}
                  />
                </div>
              </div>
            )}
            <div className="row">
              <Table striped bordered hover responsive className="book-list">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Author(s)</th>
                    <th>Publisher</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                {booklistState.data && (
                  <tbody>
                    {booklistState.data.map((item) => (
                      <tr key={item.id}>
                        <td className="title-col">
                          <a href={`/book/${item.googleBooksId}`}>
                            {item.title}
                          </a>
                        </td>
                        <td className="authors-col">{item.authors}</td>
                        <td className="publisher-col">{item.publisher}</td>
                        <td className="status-col">
                          {statusMapper(item.status)}
                        </td>
                        <td className="score-col">
                          {item.score ? item.score : "-"}
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

// function b64DecodeUnicode(str: string) {
//     return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
//     }).join(''))
// }

export default ListPage;
