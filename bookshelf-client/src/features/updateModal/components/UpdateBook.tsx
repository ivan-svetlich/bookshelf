import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Book from "../../../types/book";
import BookEntry from "../../../types/bookEntry";
import { useAppDispatch } from "../../../store/hooks/redux";
import { add, remove, update } from "../../../store/slices/bookListSlice";

type UpdateBookProps = {
    show: boolean;
    handleClose: React.MouseEventHandler<HTMLButtonElement>;
    item: Book;
    userEntry: BookEntry | undefined;
}

const UpdateBook = ({show, handleClose, item, userEntry}: UpdateBookProps) => {
    let dispatch = useAppDispatch();

    const [inputs, setInputs] = useState({
        id: userEntry ? userEntry.id : undefined,
        title: item.title, 
        authors: item.authors, 
        publisher: item.publisher,
        googleBooksId: item.id,
        status: userEntry ? userEntry.status : '1',
        score: userEntry ? userEntry.score : ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const inputName = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [inputName]: value}))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(userEntry) {
          dispatch(update({...inputs, id: userEntry.id}));
        }
        else{
            dispatch(add(inputs));
        }
        (handleClose as Function)()
    }

    const RemoveFromList = async (bookId?: number) => {
      if(bookId) {
        dispatch(remove(bookId));
      }
        (handleClose as Function)()
    }

    return (
        <Modal show={show} onHide={handleClose} data>
        <Modal.Header closeButton>
          {userEntry 
          ? <Modal.Title><i className="fas fa-edit" /> Edit book status</Modal.Title>
          : <Modal.Title><i className="fas fa-list" /> Add book to my list</Modal.Title>
          }
          
        </Modal.Header>
        <form name="add_book" onSubmit={handleSubmit}>
          <Modal.Body>
              <table width="100%" cellSpacing="0" cellPadding="5">
                <tbody>
                  <tr>
                    <td width="130" valign="top">Book title</td>
                    <td>
                      <strong>
                        <a href={`/book/${item.id}`}>{item.title}</a>
                      </strong>
                      <input type="hidden" name="googleBooksId" id="book_id" value={item.id} />
                      <input type="hidden" name="title" id="book_title" value={item.title} />
                    </td>
                  </tr>
                  <tr>
                    <td width="130" valign="top">Author(s)</td>
                    <td>
                      {item.authors}
                      <input type="hidden" name="authors" id="book_title" value={item.authors} />
                      <input type="hidden" name="publisher" id="book_title" value={item.publisher} />
                    </td>
                  </tr>
                  <tr>
                    <td width="130" valign="top">Status</td>
                    <td>
                      <select id="add_book_status" name="status" className="inputtext" onChange={(e) => handleChange(e)} 
                        defaultValue={userEntry ? 
                            userEntry["status"] ?
                            userEntry["status"] : '' : ''}>            
                        <option value="1">Reading</option>
                        <option value="2">Completed</option>
                        <option value="3">On-Hold</option>
                        <option value="4">Dropped</option>
                        <option value="5">Plan to Read</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td width="130" valign="top">Your score</td>
                    <td>
                        <select id="add_book_score" name="score" className="inputtext" onChange={(e) => handleChange(e)} 
                            defaultValue={userEntry ? 
                                userEntry["score"] ?
                                userEntry["score"] : '' : 'Select'}>
                            <option value="">Select</option>            
                            <option value="10">(10) Masterpiece)</option>
                            <option value="9">(9) Great</option>
                            <option value="8">(8) Very Good</option>
                            <option value="7">(7) Good</option>
                            <option value="6">(6) Fine</option>
                            <option value="5">(5) Average</option>
                            <option value="4">(4) Bad</option>
                            <option value="3">(3) Very Bad</option>
                            <option value="2">(2) Horrible</option>
                            <option value="1">(1) Appalling</option>
                        </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              {userEntry ?  
                <Button variant="link" onClick={() => RemoveFromList(userEntry.id)}>
                  Remove from my list
                </Button>  
                : ''
              }       
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
};

export default UpdateBook;