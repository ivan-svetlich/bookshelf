import "../../styles/commentStyles.css";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/esm/Form";
import Table from "react-bootstrap/esm/Table";
import CommentBox from "./CommentBox";
import { useState } from "react";
import React from "react";
import Loading from "../../../loading/Loading";
import { CommentState, useFetchComments } from "../../hooks/useFetchComments";
import {
  getProfileComments,
  submitComment,
} from "../../../../utils/api/comments";

type CommentsProps = {
  username: string;
};
const Comments = ({ username }: CommentsProps) => {
  const [update, setUpdate] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const { loading, data, error }: CommentState = useFetchComments(
    getProfileComments,
    username,
    update,
    setUpdate
  );
  const [input, setInput] = useState("");
  const commentsRef = React.createRef<HTMLDivElement>();
  let hash = window.location.hash.split("#")[1] || null;

  const scrollToComments = () => {
    if (commentsRef && commentsRef.current && hash) {
      commentsRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    if (event.target.value.length > 0) {
      setInvalid(false);
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.length > 0) {
      submitComment(username, input).then(() => {
        setUpdate(true);
        setInput("");
      });
    } else {
      setInvalid(true);
    }
  };
  return (
    <div
      id="comments-container"
      ref={commentsRef}
      onLoad={() => scrollToComments()}
    >
      <h4>Comments</h4>
      <Form className="submit-comment" onSubmit={(e) => handleSubmit(e)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Write a comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            onChange={(e) =>
              handleChange(e as React.ChangeEvent<HTMLInputElement>)
            }
            required
            isInvalid={invalid}
            value={input}
          />
          <Form.Control.Feedback type="invalid">
            Please write your comment before submit.
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit">Submit comment</Button>
      </Form>
      {loading && <Loading />}
      {error && "Error. Try again"}
      {!loading && data && (
        <div>
          <Table striped className="no-border comments-table">
            <tbody className="comment-box">
              {data.length > 0 &&
                data
                  .slice(0)
                  .reverse()
                  .map((comment, index) => {
                    return <CommentBox comment={comment} key={comment.id} />;
                  })}
              {data.length === 0 && (
                <div className="text-is-centered">No comments yet!</div>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Comments;
