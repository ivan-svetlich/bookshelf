import React, { useState } from "react";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Book from "../../../types/book";
import Product from "../../../types/product";

type UpdateProductProps = {
  show: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  item: Book;
  product: Product | null;
  handleAddProduct: Function;
  handleUpdateProduct: Function;
  handleRemoveProduct: Function;
  setUpdateProductInfo: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateProduct = ({
  show,
  handleClose,
  item,
  product,
  handleAddProduct,
  handleUpdateProduct,
  handleRemoveProduct,
  setUpdateProductInfo,
}: UpdateProductProps) => {
  const [inputs, setInputs] = useState({
    title: item.title,
    authors: item.authors,
    publisher: item.publisher,
    googleBooksId: item.id,
    price: product ? product.price.toString() : null,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const value = event.target.value;

    if (isNumeric(value)) {
      $(`input[name=${inputName}]`).removeClass("invalid");
      setInputs((values) => ({
        ...values,
        [inputName]: value.replace(",", "."),
      }));
    } else {
      $(`input[name=${inputName}]`).addClass("invalid");
      setInputs((values) => ({
        ...values,
        [inputName]: value.replace(",", "."),
      }));
    }
  };

  const handleSubmit = async () => {
    if (product) {
      if (inputs.price === null) {
        await handleUpdateProduct({
          id: product.id,
          price: product.price.toString(),
        });
      } else if (inputs.price && isNumeric(inputs.price)) {
        await handleUpdateProduct({ id: product.id, price: inputs.price });
      }
    } else if (inputs.price && isNumeric(inputs.price)) {
      await handleAddProduct(inputs);
    }
    setUpdateProductInfo(true);
  };

  const RemoveProduct = async (productId: number) => {
    await handleRemoveProduct(productId);
    setUpdateProductInfo(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        {product ? (
          <Modal.Title>Update product</Modal.Title>
        ) : (
          <Modal.Title>Add product to store</Modal.Title>
        )}
      </Modal.Header>
      <form name="add_book">
        <Modal.Body>
          <table width="100%" cellSpacing="0" cellPadding="5">
            <tbody>
              <tr>
                <td width="130" valign="top">
                  Book title
                </td>
                <td>
                  <strong>
                    <a href={`/book/${item.id}`}>{item.title}</a>
                  </strong>
                  <input
                    type="hidden"
                    name="googleBooksId"
                    id="book_id"
                    value={item.id}
                  />
                  <input
                    type="hidden"
                    name="title"
                    id="book_title"
                    value={item.title}
                  />
                </td>
              </tr>
              <tr>
                <td width="130" valign="top">
                  Author(s)
                </td>
                <td>
                  {item.authors}
                  <input
                    type="hidden"
                    name="authors"
                    id="book_title"
                    value={item.authors}
                  />
                  <input
                    type="hidden"
                    name="publisher"
                    id="book_title"
                    value={item.publisher}
                  />
                </td>
              </tr>
              <tr>
                <td width="130" valign="top">
                  Price
                </td>
                <td>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">$</span>
                    </div>
                    <input
                      name="price"
                      type="text"
                      defaultValue={product ? product.price.toString() : ""}
                      className="form-control price-input"
                      required
                      onChange={(e) => handleChange(e)}
                      onKeyPress={(e) => handleKeyPress(e)}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {product ? (
            <Button variant="link" onClick={() => RemoveProduct(product.id)}>
              Remove from store
            </Button>
          ) : (
            ""
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {product ? (
            <Button
              name="update-btn"
              type="button"
              variant="primary"
              onClick={() => handleSubmit()}
            >
              <i className="fas fa-edit" /> Update
            </Button>
          ) : (
            <Button
              name="add-btn"
              type="button"
              variant="primary"
              onClick={() => handleSubmit()}
            >
              <i className="fas fa-plus" /> Add
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

function isNumeric(value: string) {
  var reg = /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/;

  return reg.test(value.replace(",", "."));
}

export default UpdateProduct;
