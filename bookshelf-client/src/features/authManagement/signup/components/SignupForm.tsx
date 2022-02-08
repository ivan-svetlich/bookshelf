import React, { useState, useEffect } from "react";
import $ from 'jquery';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NavLink from "react-bootstrap/NavLink";
import ReCaptcha from "./ReCaptcha";
import { SignupArgs } from "../../../../utils/api/authManagement";


interface SignupFormProps {
    signup: (args: SignupArgs) => Promise<void>
}

const SignupForm = ({signup}: SignupFormProps) => {
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        captchaToken: ''
    });
    const [token, setToken] = useState<string | null>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [inputName]: value}))
    }

    const validateInput = (event: React.FocusEvent<HTMLInputElement>) => {
        const element = event.target;
        element.checkValidity();
        element.reportValidity();
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        
        Object.keys(inputs).forEach(key => {
            const element = $(`input[name=${key}]`);
            if((element[0] as HTMLInputElement).value === '') {
                element.addClass('invalid');
                console.log("Asd")
            }
        })
        event.preventDefault();
        signup(inputs);
    }
    
    useEffect(() => {
        if(token){
            setInputs(values => ({...values, captchaToken: token}));
        }  
    },[token]);

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" name="username" 
                    onChange={handleChange}
                    onBlur={(e) => validateInput(e as React.FocusEvent<HTMLInputElement>)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name="email" 
                onChange={handleChange}
                onBlur={(e) => validateInput(e as React.FocusEvent<HTMLInputElement>)} required />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" 
                onChange={handleChange}
                onBlur={(e) => validateInput(e as React.FocusEvent<HTMLInputElement>)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCaptcha">
                <ReCaptcha setToken={setToken} />
            </Form.Group>
            <Button variant="dark" type="submit" size="lg" id="signup-button">
                Sign up
            </Button>
            <hr></hr>
            <p className="content-is-centered">Already have an account?</p>
                <NavLink href="/login">
                    <Button variant="outline-dark" type="button">
                        Log in
                    </Button>
                </NavLink>
        </Form>
    );
};

export default SignupForm;