import React, { useState } from "react";
import $ from "jquery";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavLink from "react-bootstrap/NavLink";
import { login } from "../../../../store/slices/loginSlice";
import { useAppDispatch } from "../../../../store/hooks/redux";
import { setMessage } from "../../../../store/slices/messageSlice";

interface Inputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [inputs, setInputs] = useState<Inputs>({
    email: "",
    password: "",
  });
  let dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = event.target.name;
    const value = event.target.value;
    if (value !== "") {
      $(`input[name=${inputName}]`).removeClass("invalid");
    }
    setInputs((values) => ({ ...values, [inputName]: value }));
  };
  const validateInput = (event: React.FocusEvent<HTMLInputElement>) => {
    const element = event.target;
    element.checkValidity();
    element.reportValidity();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputs.email === "" || inputs.password === "") {
      dispatch(
        setMessage({
          content: "email and/or password fields cannot be empty",
          variant: "Danger",
        })
      );
    } else {
      dispatch(login(inputs));
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onBlur={(e) => validateInput(e as React.FocusEvent<HTMLInputElement>)}
          name="email"
          onChange={handleChange}
          required
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          onBlur={(e) => validateInput(e as React.FocusEvent<HTMLInputElement>)}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <p className="content-is-centered">
        <Button variant="dark" type="submit" size="lg" id="login-button">
          Log in
        </Button>
      </p>
      <hr></hr>
      <p className="content-is-centered">Still don't have an account?</p>
      <p className="content-is-centered">
        <NavLink href="/signup">
          <Button variant="outline-dark" type="button">
            Sign up
          </Button>
        </NavLink>
      </p>
    </Form>
  );
};

export default LoginForm;
